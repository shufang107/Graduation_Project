<template>
  <v-content class="marketing-emailtask-wrap">
    <v-row class="top-form">
      <v-col span="12">
        <div style="margin-bottom:10px;">免邮门槛：</div>
        <v-form direction="horizontal" :model="topForm" ref="topForm" :rules="topFormRule">
          <v-row class="left-form">
            <v-col span="8">
              <v-form-item
                label="邮费"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                prop="postage"
              >
                <v-input type="input" v-model="topForm.postage" size="large"></v-input>
              </v-form-item>
            </v-col>
            <v-col span="10">
              <v-form-item
                label="免邮门槛"
                :label-col="labelCol"
                :wrapper-col="wrapperCol"
                prop="freePrice"
              >
                <v-input type="input" v-model="topForm.freePrice" size="large"></v-input>
              </v-form-item>
            </v-col>
            <v-col span="6">
              <v-button type="primary" html-type="button" @click="updatePostage">生效</v-button>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
      <v-col span="12">
        <div style="margin-bottom:10px;">当前免邮门槛：</div>
        <v-data-table
          ref="emailFreeTable"
          :data="getEmailFreeTable"
          :columns="emailFreeColum"
          :emptyText="'没有找到您想要的信息......'"
        ></v-data-table>
      </v-col>
    </v-row>

    <div style="margin:10px;text-align:left">购物车N选N规则：</div>
    <v-row class="bottom-row">
      <v-form direction="horizontal" :model="bottomForm" ref="bottomForm">
        <v-col span="6">
          <v-form-item label="规则中文名称" :label-col="labelCol" :wrapper-col="wrapperCol">
            <v-input type="input" size="large" v-model="bottomForm.roleNameCn"></v-input>
          </v-form-item>
        </v-col>
        <v-col span="6">
          <v-form-item label="专场ID" :label-col="labelCol" :wrapper-col="wrapperCol">
            <v-input type="input" size="large" v-model="bottomForm.collectionId"></v-input>
          </v-form-item>
        </v-col>
        <v-col span="6">
          <v-form-item label="状态" :label-col="labelCol" :wrapper-col="wrapperCol">
            <v-select
              placeholder="请选择状态"
              style="width: 120px;"
              :data="options"
              value="all"
              v-model="bottomForm.vaildName"
            ></v-select>
          </v-form-item>
        </v-col>
        <v-col span="6" style="text-align:left">
          <span>
            <v-button type="primary" @click="onSearch" html-type="button">查询</v-button>
            <v-button type="primary" @click="onAddRule" html-type="button">添加</v-button>
          </span>
        </v-col>
      </v-form>
    </v-row>
    <v-data-table
      ref="cartBottomTable"
      :data="getCartTable"
      :columns="cartFreeColums"
      :currentData="cartlistData"
      :emptyText="'没有找到您想要的信息......'"
    >
      <template slot="th" slot-scope="props">
        <strong v-if="props.column.field=='album'">操作</strong>
        <strong v-else v-html="props.title"></strong>
      </template>

      <template slot="td" slot-scope="props">
        <div v-if="props.column.field=='album'">
          <!-- <div>{{JSON.stringify(props)}}</div> -->
          <div v-if="props.item.vaildName ==0">
            <v-button type="primary" size="small" @click="onlineRule(props.item)">上线</v-button>
            <v-button type="primary" size="small" @click="offRule(props.item)" disabled>下线</v-button>
            <v-button type="primary" size="small" @click="onEditRule(props.item)">编辑</v-button>
            <v-button type="primary" size="small" @click="onDelRule(props.item)">删除</v-button>
          </div>
          <div v-if="props.item.vaildName ==1">
            <v-button type="primary" size="small" @click="onlineRule(props.item)" disabled>上线</v-button>
            <v-button type="primary" size="small" @click="offRule(props.item)">下线</v-button>
            <v-button type="primary" size="small" @click="onEditRule(props.item)" disabled>编辑</v-button>
            <v-button type="primary" size="small" @click="onDelRule(props.item)" disabled>删除</v-button>
          </div>
          <div v-if="props.item.vaildName ==2">
            <v-button type="primary" size="small" @click="onlineRule(props.item)">上线</v-button>
            <v-button type="primary" size="small" @click="offRule(props.item)" disabled>下线</v-button>
            <v-button type="primary" size="small" @click="onEditRule(props.item)">编辑</v-button>
            <v-button type="primary" size="small" @click="onDelRule(props.item)">删除</v-button>
          </div>
        </div>
        <div v-if="props.column.field=='vaildName'">
          <div v-if="props.content=='0'">待发布</div>
          <div v-if="props.content=='1'">上线</div>
          <div v-if="props.content=='2'">下线</div>
        </div>
        <span v-else v-html="props.content"></span>
      </template>
    </v-data-table>

    <add-rule
      :addVisible="addVisible"
      :collectId="collectId"
      @cancleStat="onCancleRule"
      @conformstat="onConfirmRule"
    ></add-rule>
    <edit-rule
      :addVisible="editVisible"
      :collectId="collectId"
      :ruledata="cartRule"
      @cancleStat="onCancleRule"
      @conformstat="onConfirmRule"
    ></edit-rule>
  </v-content>
</template>

<script>
import request from "@/util/ajax.js";
import transform from "@/util/transform.js";
import addRule from "./addrule/addrule";
import editRule from "./editrule/editrule";
import api from "./api.js";
export default {
  name: "marketing-emailtask",
  data() {
    //邮费验证的规则
    var validatePost = (rule, value, callback) => {
      var value = parseFloat(value);
      //console.log('value',value)
      if (isNaN(value)) {
        callback(new Error("请输入数字值"));
      } else {
        if (value < 0) {
          callback(new Error("不能为负"));
        } else {
          callback();
        }
      }
    };
    var validateFreePrice = (rule, value, callback) => {
      var value = parseFloat(value);
      if (isNaN(value)) {
        callback(new Error("请输入数字值"));
      } else {
        if (value < 0) {
          callback(new Error("不能为负"));
        } else {
          callback();
        }
      }
    };
    return {
      collectId: [],
      topForm: {
        postage: 0,
        freePrice: 0
      },
      cartRule: {
        roleNameCn: "",
        roleNameEn: "",
        collectionId: "",
        minPiece: "",
        minPrice: ""
      },
      bottomForm: {
        roleNameCn: "",
        collectionId: "",
        vaildName: ""
      },
      addVisible: false,
      editVisible: false,
      options: [
        {
          value: "all",
          label: "全部"
        },
        {
          value: 0,
          label: "待发布"
        },
        {
          value: 1,
          label: "上线"
        },
        {
          value: 2,
          label: "下线"
        }
      ],
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      },
      emailFreeColum: [
        { title: "邮费 ($)", field: "postage" },
        { title: "免邮门槛 ($)", field: "freePrice" }
      ],
      cartFreeColums: [
        { title: "规则中文名称", field: "roleNameCn" },
        { title: "规则英文名称", field: "roleNameEn" },
        { title: "专场ID", field: "collectionId" },
        { title: "满多少件", field: "minPiece" },
        { title: "价格", field: "minPrice" },
        { title: "状态", field: "vaildName" },
        { title: "操作", field: "album" }
      ],
      topFormRule: {
        postage: [
          {
            validator: validatePost
          }
        ],
        freePrice: [
          {
            validator: validateFreePrice
          }
        ]
      },
      cartlistData: []
    };
  },
  components: {
    addRule,
    editRule
  },
  mounted() {},
  methods: {
    onSearch() {
      let roleNameCn = this.bottomForm.roleNameCn;
      let collectionId = this.bottomForm.collectionId;
      let vaildStatus = this.bottomForm.vaildName;
      if (vaildStatus === "all") {
        vaildStatus = "";
      }
      console.log(roleNameCn + "-" + collectionId + "-" + vaildStatus);
      this.$http
        .get(api.freepost_query, {
          params: {
            roleNameCn,
            collectionId,
            vaildStatus
          }
        })
        .then(res => {
          console.log(res);
          this.cartlistData = res.data;
        });
    },
    onDelRule(item) {
      var _this = this;
      _this.$modal.confirm({
        title: "删除当前数据",
        content: "确认要删除当前数据么？",
        onOk: function() {
          _this.$http
            .post(api.freepost_delete, {
              id: item.id
            })
            .then(res => {
              if (res.code == 0) {
                _this.$message.success("删除成功!", 0.5);
                _this.$refs.cartBottomTable.reload();
              } else {
                _this.$message.error("删除成功!", 0.5);
              }
            });
        },
        onCancel: function() {}
      });
    },
    onEditRule(item) {
      let roleNameCn = item.roleNameCn;
      let roleNameEn = item.roleNameEn;
      let collectionId = item.collectionId;
      let minPiece = item.minPiece;
      let minPrice = item.minPrice;
      let id = item.id;
      this.cartRule = {
        roleNameCn,
        roleNameEn,
        collectionId,
        minPiece,
        minPrice,
        id
      };
      this.editVisible = true;
    },
    onlineRule(item) {
      var _this = this;
      _this.$modal.confirm({
        title: "上线当前规则",
        content: "确认要上线当前规则么？",
        onOk: function() {
          _this.$http
            .post(api.freepost_online, {
              id: item.id
            })
            .then(res => {
              if (res.code == 0) {
                _this.$message.success("上线成功!", 0.5);
                _this.$refs.cartBottomTable.reload();
              } else {
                _this.$message.error("上线失败!", 0.5);
              }
            });
        },
        onCancel: function() {}
      });
    },
    offRule(item) {
      var _this = this;
      _this.$modal.confirm({
        title: "下线当前规则",
        content: "确认要下线当前规则么？",
        onOk: function() {
          _this.$http
            .post(api.freepost_offline, {
              id: item.id
            })
            .then(res => {
              if (res.code == 0) {
                _this.$message.success("下线成功!", 0.5);
                _this.$refs.cartBottomTable.reload();
              } else {
                _this.$message.error("下线失败!", 0.5);
              }
            });
        },
        onCancel: function() {}
      });
    },
    onAddRule() {
      this.addVisible = true;
    },
    onCancleRule(data) {
      this.addVisible = data;
      this.editVisible = data;
    },
    onConfirmRule(data) {
      this.addVisible = data;
      this.editVisible = data;
      this.$refs.cartBottomTable.reload();
    },
    updatePostage() {
      var _this = this;
      _this.$refs["topForm"].validate(valid => {
        if (valid) {
          let postage = this.topForm.postage || 0;
          let freePrice = this.topForm.freePrice || 0;
          _this.$modal.confirm({
            title: "生效当前免邮门槛",
            content: "确认要生效当前免邮门槛么？",
            onOk: function() {
              _this.$http
                .post(api.postage_create, {
                  postage,
                  freePrice
                })
                .then(res => {
                  if (res.code == 0) {
                    _this.$message.success("更新成功!", 0.5);
                    _this.$refs.emailFreeTable.reload();
                  } else {
                    _this.$message.error("更新失败!", 0.5);
                  }
                });
            },
            onCancel: function() {}
          });
        } else {
          console.log("submit error !!!");
          return false;
        }
      });
    },
    getEmailFreeTable() {
      var _this = this;
      return _this.$http.get(api.postage_query).then(res => {
        let item = [];
        item.push(res.data); //把对象塞进去，变为数组
        console.log("res.data", res.data); //返回对象
        //console.log('item',item)//返回数组
        let result = transform.getDataTable({
          items: item
        });
        return result;
      });
    },
    getCartTable() {
      var _this = this;
      return _this.$http.get(api.freepost_query).then(res => {
        console.log("getCartTable", res.data); //返回数组
        //把专场ID存起来
        for (let i = 0; i < res.data.length; i++) {
          _this.collectId.push(res.data[i].collectionId);
        }
        //console.log(_this.collectId)
        let result = transform.getDataTable({
          items: res.data
        });
        return result;
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./emailtask.less" lang="less"></style>

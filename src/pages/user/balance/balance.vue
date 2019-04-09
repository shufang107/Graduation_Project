<template>
  <v-content class="user-assets-wrap">
    <v-form class="search-form" :model="ruleForm" ref="ruleForm">
      <v-row class="demo-row">
        <v-col span="24">
          <v-form-item label="用户ID" prop="userId">
            <v-input placeholder="请输入以‘，’分隔" v-model="ruleForm.userId"></v-input>
          </v-form-item>
           <v-form-item label="店铺ID" prop="storeId">
            <v-input placeholder="请输入以‘，’分隔" v-model="ruleForm.storeId"></v-input>
          </v-form-item>
          <v-form-item label="结算编号" prop="settlementId">
            <v-input placeholder="请输入以‘，’分隔" v-model="ruleForm.settlementId"></v-input>
          </v-form-item>
          <v-form-item label="创建时间" prop="createTimeStart">
            <v-date-picker
              style="width: 100px;"
              placeholder="选择开始时间"
              clearable
              show-time
              v-model="ruleForm.createTimeStart"
            ></v-date-picker>
          </v-form-item>
          <v-form-item label="到" prop="createTimeEnd">
            <v-date-picker
              style="width: 100px;"
              placeholder="选择结束时间"
              clearable
              show-time
              v-model="ruleForm.createTimeEnd"
            ></v-date-picker>
          </v-form-item>
          <v-form-item label="结算状态" prop="status">
            <v-select
              placeholder="请选择结算状态"
              v-model="ruleForm.status"
              style="width:100px"
              :data="options"
            ></v-select>
          </v-form-item>
          <v-form-item>
            <v-button type="primary" html-type="button" @click="onSearch">查询</v-button>
            <v-button type="ghost" @click.prevent="resetForm('ruleForm')">清空条件</v-button>
          </v-form-item>
        </v-col>
      </v-row>
    </v-form>
    <div class="data-gird" :style="`height:${gridHeight};text-align:left`">
      <v-data-table :columns="columns" :data="getData" :currentData="cartlistData">
        <template slot="td" slot-scope="props">
          <div v-if="props.column.field=='status'">
            <div v-if="props.content=='0'">待结算</div>
            <div v-if="props.content=='1'" style="color:green">已打款</div>
            <div v-if="props.content=='2'" style="color:red">已拒绝</div>
          </div>
           <div v-else-if="props.column.field=='operate'">
            <div v-if="props.item.status=='0'">
              <v-button type="primary" size="small" @click="onTransfer(props.item)">打款</v-button>
              <v-button type="primary" size="small" @click="onReject(props.item)">拒绝</v-button>
              <v-button type="primary" size="small" @click="onRemark(props.item)">备注</v-button>
            </div>
            <div v-if="props.item.status=='1'">
              <v-button type="primary" size="small" @click="onTransfer(props.item)" disabled>打款</v-button>
              <v-button type="primary" size="small" @click="onReject(props.item)" disabled>拒绝</v-button>
              <v-button type="primary" size="small" @click="onRemark(props.item)">备注</v-button>
            </div>
            <div v-if="props.item.status=='2'">
              <v-button type="primary" size="small" @click="onTransfer(props.item)" disabled>打款</v-button>
              <v-button type="primary" size="small" @click="onReject(props.item)" disabled>拒绝</v-button>
              <v-button type="primary" size="small" @click="onRemark(props.item)">备注</v-button>
            </div>
          </div>
          <span v-else v-html="props.content"></span>
        </template>
      </v-data-table>
    </div>
    <v-pagination
      style="text-align:right;"
      show-quick-jumper
      :total="dataTotal"
      @change="pageChange"
      :value="currentPage"
    ></v-pagination>
    <v-modal
      title="打款备注"
      :visible="remarkVisible"
      @ok="remarkOk"
      @cancel="remarkCancel"
      ok-text="ok"
      cancel-text="Cancel"
      style="text-align:left"
    >
      <p>备注信息：</p>
      <v-input type="textarea" v-model="currentRemark" :value="currentRemark"></v-input>
    </v-modal>
  </v-content>
</template>

<script>
import api from "./api.js";
import transform from "@/util/transform.js";
import Cookie from "cookie.js";

export default {
  data() {
    return {
      dataTotal: 0, //页总数
      currentPage: 1,
      numsPerPage: 10,
      ruleForm: {
        userId: "",
        storeId: "",
        settlementId: "",
        createTimeStart: "",
        createTimeEnd: "",
        status: "" //结算状态 0待结算 1已打款 2已拒绝
      },
      detailItem: {},
      username: "",
      gridHeight: "500px",
      cartlistData: [],
      detailVisible: false,
      remarkVisible: false, // 打款备注
      currentRemark: "", //当前显示的备注
      currentSettlementId: "", //当前结算ID
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: '0',
          label: "待结算"
        },
        {
          value: '1',
          label: "已打款"
        },
        {
          value: '2',
          label: "已拒绝"
        }
      ]
    };
  },
  created() {
    this.username = Cookie.get("username") || "";
    this.columns = [
      { title: "创建时间", field: "createTime" },
      { title: "用户ID", field: "userId" },
      { title: "店铺ID", field: "storeId" },
      { title: "结算编号", field: "settlementId" },
      { title: "提现金额", field: "totalCommission" },
      { title: "结算状态", field: "status" },
      { title: "备注", field: "remark" },
      { title: "处理时间", field: "updateTime" },
      { title: "操作员", field: "operatorName" },
      { title: "操作", field: "operate" }
    ];
  },
  mounted() {},
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getData() {
      let _this = this;
      return _this.$http
        .get(api.settlement_list, {
          params: {
            currentPage: _this.currentPage,
            numsPerPage: _this.numsPerPage
          }
        })
        .then(res => {
          _this.dataTotal = parseInt(res.data.count);
          let ary = res.data.items;
          let result = transform.getDataTable({
            items: res.data.items
          });
          return result;
        });
    },
    showNormaldetail(item) {
      //console.log(item.userId)
      // this.detailId = item.id;
      this.detailItem = item;
      this.detailVisible = true;
    },
    bulState(data) {
      //console.log(data)
      this.detailVisible = data;
    },
    pageChange(page) {
      let _this = this;
      _this.currentPage = page;
      _this.onFetchSearch();
    },
    onFetchSearch() {
      var _this = this;
      return _this.$http
        .get(api.settlement_list, {
          params: {
            currentPage: _this.currentPage,
            numsPerPage: _this.numsPerPage,
            userId: _this.ruleForm.userId,
            storeId:_this.ruleForm.storeId,
            createTimeStart: _this.ruleForm.createTimeStart,
            createTimeEnd: _this.ruleForm.createTimeEnd,
            settlementId: _this.ruleForm.settlementId,
            status: _this.ruleForm.status
          }
        })
        .then(res => {
          _this.dataTotal = res.data.count;
          let ary = res.data.items;
          _this.dataTotal = res.data.count;
          let result = transform.getDataTable({
            items: res.data.items
          });
          _this.cartlistData = result.result;
          return result;
        });
    },
    //已打款
    onTransfer(item) {
      let _this = this;
      this.$modal.confirm({
        title: "您是否确认要打款到该用户",
        content: "确认则打款",
        onOk: function() {
          _this.$http
            .post(api.change_status, {
              id: item.id,
              status: 1,
              operatorName: _this.username
            })
            .then(res => {
              _this.$message.success("操作成功!", 0.5);
              _this.pageChange(1);
            });
        },
        onCancel: function() {
          // return new Promise(function(resolve) {
          //   setTimeout(resolve, 1000);
          // });
        }
      });
    },
    //拒绝打款
    onReject(item) {
      let _this = this;
      this.$modal.confirm({
        title: "您是否要拒绝打款到该用户",
        content: "确认则拒绝打款",
        onOk: function() {
          _this.$http
            .post(api.change_status, {
              id: item.id,
              status: 2,
              operatorName: _this.username
            })
            .then(res => {
              _this.$message.success("操作成功!", 0.5);
              _this.pageChange(1);
            });
        },
        onCancel: function() {
          // return new Promise(function(resolve) {
          //   setTimeout(resolve, 1000);
          // });
        }
      });
    },
    //备注
    onRemark(item) {
      this.remarkVisible = true;
      this.currentRemark = item.remark;
      this.currentSettlementId = item.id;
    },
    //确定备注信息
    remarkOk() {
      let _this = this;
      _this.$http
        .post(api.add_remark, {
          id: _this.currentSettlementId,
          remark: _this.currentRemark
        })
        .then(res => {
          _this.$message.success("操作成功!", 0.5);
          _this.pageChange(1);
        });
      this.remarkVisible = false;
    },
    remarkCancel() {
      this.remarkVisible = false;
    },
    onSearch() {
      this.pageChange(1);
    }
  },
  components: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./balance.less" lang="less"></style>

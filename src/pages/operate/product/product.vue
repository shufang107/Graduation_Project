<template>
  <v-content class="operate-product-wrap">
    
    
    <div class="data-gird" :style="`height:${gridHeight};width:${gridWidth};text-align:left`">
      <v-data-table :data="getData" :columns="columns" :currentData="cartlistData" ref="singleList">
        <template slot="th" slot-scope="props">
          <strong v-if="props.column.field=='album'">操作</strong>
          <strong v-else v-html="props.title"></strong>
        </template>
        <template slot="td" slot-scope="props">
          <div v-if="props.column.field=='spStatus'">
            <div v-if="props.item.spStatus=='0'">待发布</div>
            <div v-if="props.item.spStatus=='1'" style="color:green">预告</div>
            <div v-if="props.item.spStatus=='2'" style="color:green">在售</div>
            <div v-if="props.item.spStatus=='3'"  style="color:red">过期</div>
            <div v-if="props.item.spStatus=='4'">下线</div>
          </div>
          <div v-else-if="props.column.field=='album'">
            <div v-if="props.item.spStatus=='0'">
              <v-button type="primary" size="small" @click="online(props.item)">上线</v-button>
              <v-button type="primary" size="small" @click="offline(props.item)" disabled>下线</v-button>
              <v-button type="primary" size="small" @click="showEditmodel(props.item)">编辑</v-button>
              <v-button type="primary" size="small" @click="deleteproduct(props.item)">删除</v-button>
              <v-button type="primary" size="small" @click="showDetailmodel(props.item)">详情</v-button>
            </div>
            <div v-if="props.item.spStatus=='1'">
              <v-button type="primary" size="small" @click="online(props.item)" disabled>上线</v-button>
              <v-button type="primary" size="small" @click="offline(props.item)">下线</v-button>
              <v-button type="primary" size="small" @click="showEditmodel(props.item)" disabled>编辑</v-button>
              <v-button type="primary" size="small" @click="deleteproduct(props.item)" disabled>删除</v-button>
              <v-button type="primary" size="small" @click="showDetailmodel(props.item)">详情</v-button>
            </div>
            <div v-if="props.item.spStatus=='2'">
              <v-button type="primary" size="small" @click="online(props.item)" disabled>上线</v-button>
              <v-button type="primary" size="small" @click="offline(props.item)">下线</v-button>
              <v-button type="primary" size="small" @click="showEditmodel(props.item)" disabled>编辑</v-button>
              <v-button type="primary" size="small" @click="deleteproduct(props.item)" disabled>删除</v-button>
              <v-button type="primary" size="small" @click="showDetailmodel(props.item)">详情</v-button>
            </div>
            <div v-if="props.item.spStatus=='3'">
              <v-button type="primary" size="small" @click="online(props.item)" disabled>上线</v-button>
              <v-button type="primary" size="small" @click="offline(props.item)" >下线</v-button>
              <v-button type="primary" size="small" @click="showEditmodel(props.item)" disabled>编辑</v-button>
              <v-button type="primary" size="small" @click="deleteproduct(props.item)">删除</v-button>
              <v-button type="primary" size="small" @click="showDetailmodel(props.item)">详情</v-button>
            </div>
            <div v-if="props.item.spStatus=='4'">
              <v-button type="primary" size="small" @click="online(props.item)">上线</v-button>
              <v-button type="primary" size="small" @click="offline(props.item)" disabled>下线</v-button>
              <v-button type="primary" size="small" @click="showEditmodel(props.item)">编辑</v-button>
              <v-button type="primary" size="small" @click="deleteproduct(props.item)">删除</v-button>
              <v-button type="primary" size="small" @click="showDetailmodel(props.item)">详情</v-button>
            </div>
          </div>
          <span v-else v-html="props.content"></span>
        </template>
      </v-data-table>
      <br>
      <v-pagination style="text-align:right;" show-quick-jumper :total="dataTotal" @change="pageChange" :value="currentPage"></v-pagination>
    </div>
    <new-add :addVisible="addVisible" v-on:changeBul="bulState"></new-add>
    <pro-edit :editVisible="editVisible" :specialId="selectSpecial" v-on:changeBul="bulState"></pro-edit>
    <pro-detail :detailVisible="detailVisible" :specialId="selectSpecial" v-on:changeBul="bulState"></pro-detail>
  </v-content>
</template>

<script>
import api from "./api.js";
import transform from "@/util/transform.js";
import newAdd from "./newadd/newadd";
import proEdit from "./proedit/proedit";
import proDetail from "./prodetail/prodetail";
import moment from "moment";
export default {
  name: "operate-product",
  data() {
    return {
      dataTotal:0,//页总数
      currentPage:1,
      numsPerPage:10,
      addVisible: false,
      editVisible: false,
      detailVisible: false,
      spuId: "",
      spStatus: "",
      rangeTime:['',''],
      gridHeight: "500px",
      gridWidth: "800px",
      cartlistData: [],
      selectSpecial: "", //选中的专场ID
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "0",
          label: "待发布"
        },
        {
          value: "1",
          label: "预售"
        },
        {
          value: "2",
          label: "在售"
        },
        {
          value: "3",
          label: "过期"
        },
        {
          value: "4",
          label: "下线"
        }
      ],
      columns: []
    };
  },
  created() {
    this.gridHeight = document.body.clientHeight - 280 + "px";
    this.gridWidth = document.body.clientWidth - 230 + "px";
    this.columns = [
      { title: "专场ID", field: "spId",width:"5" },
      { title: "专场名称", field: "spTitleCn",width:"5" },
      { title: "商品SKU数量", field: "spGoodsNum",width:"5" },
      { title: "专场状态", field: "spStatus",width:"5" },
      { title: "开始时间", field: "spStartTime" ,width:"20"},
      { title: "结束时间", field: "spEndTime",width:"20"},
      { title: "操作", field: "album",width:"45" }
    ];
    // this.loadData();
  },
  mounted() {},
  methods: {
    pageChange(page) {
      let _this = this;
      _this.currentPage = page;
      _this.onFetchSearch();
    },
    getData() {
      let _this = this;
      return _this.$http
        .get(api.get_special, {
          params: {
            type: 0,
            currentPage: _this.currentPage,
            numsPerPage: _this.numsPerPage
          }
        })
        .then(res => {
          //console.log(res);
          _this.dataTotal = res.data.count
          let ary = res.data.items;
          _this.dataTotal = res.data.count;
          // _this.specialFSForm.spSubTitleCn = res.data.special.spSubTitleCn;
          // for (let i = 0; i < ary.length; i++) {
          //   ary[i]["spStartTime"] = moment(ary[i].spStartTime)
          //     .utcOffset(-8)
          //     .format("YYYY-MM-DD HH:mm:ss");
          //   ary[i]["spEndTime"] = moment(ary[i].spEndTime)
          //     .utcOffset(-8)
          //     .format("YYYY-MM-DD HH:mm:ss");
          // }
          let result = transform.getDataTable({
            items: res.data.items
            //totalCount: res.data.count
          });
          return result;
        });
    },

    showModel() {
      this.addVisible = true;
    },
    //点击编辑
    showEditmodel(item) {
      this.selectSpecial = item.spId + "";
      this.editVisible = true;
    },
    //点击详情
    showDetailmodel(item) {
      this.selectSpecial = item.spId + "";
      this.detailVisible = true;
    },
    bulState(data) {
      this.addVisible = data.add;
      this.editVisible = data.edit;
      this.detailVisible = data.detail;
      if (data.isconform) {
        //刷新列表数据
        this.$refs.singleList.reload();
      }
    },
    online(item) {
      let _this = this;
      _this.$modal.confirm({
        title: "您确认要上线该专场？",
        content: "",
        onOk: function() {
          _this.$http
            .post(api.online_special, { spId: item.spId })
            .then(res => {
              if (res.code === 0) {
                _this.$message.success("上线成功!", 0.5);
                _this.$refs.singleList.reload();
              } else {
             if (res.otherSp || res.errorGoods) {
                  let content1 = "";
                  let content2 = "";
                    if (res.otherSp && res.otherSp.length > 0) {
                      let errorlist = [];
                      for (let i in res.otherSp) {
                        errorlist.push(res.otherSp[i].spgSkuId);
                      }
                      content1 =  "存在" +
                      errorlist.join(",") +
                      "商品存在上线或者预售专场中!!!";
                    }

                     if (res.errorGoods && res.errorGoods.length > 0) {
                      let errorlist = [];
                      for (let i in res.errorGoods) {
                        errorlist.push(res.errorGoods[i].spgSkuId);
                      }
                      content2 =  "存在" +
                      errorlist.join(",") +
                      "商品可售库存为0";
                    }

                    let content =content1 + ' | ' + content2;
                    _this.$message.error(content, 10);
                } else {
                  _this.$message.error(res.msg, 10);
                }
              }
            });
        },
        onCancel: function() {}
      });
    },
    offline(item) {
      let _this = this;
      _this.$modal.confirm({
        title: "您确认要下线该专场？",
        content: "",
        onOk: function() {
          _this.$http
            .post(api.offline_special, { spId: item.spId })
            .then(res => {
              if (res.code === 0) {
                _this.$message.success("下线成功!", 0.5);
                _this.$refs.singleList.reload();
              }
            });
        },
        onCancel: function() {}
      });
    },
    deleteproduct(item) {
      let _this = this;
      _this.$modal.confirm({
        title: "您确认要删除该专场？",
        content: "",
        onOk: function() {
          _this.$http.post(api.del_special, { spId: item.spId }).then(res => {
            if (res.code === 0) {
              _this.$message.success("删除成功!", 0.5);
              _this.$refs.singleList.reload();
            }
          });
        },
        onCancel: function() {}
      });
    },
    onFetchSearch() {
      var _this = this;
      return _this.$http
        .get(api.get_special, {
          params: {
            type: 0,
            currentPage: _this.currentPage,
            numsPerPage: _this.numsPerPage,
            ids: _this.spuId,
            status: _this.spStatus,
            startTime: _this.rangeTime[0],
            endTime: _this.rangeTime[1],
            // currentPage:_this.currentPage,
            // numsPerPage:_this.numsPerPage,
          }
        })
        .then(res => {
          _this.dataTotal = res.data.count;
          let ary = res.data.items;
          _this.dataTotal = res.data.count;
          for (let i = 0; i < ary.length; i++) {
            ary[i]["spStartTime"] = moment(ary[i].spStartTime).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            ary[i]["spEndTime"] = moment(ary[i].spEndTime).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          }
          let result = transform.getDataTable({
            items: res.data.items
          });
          _this.cartlistData = result.result;
          return result;
        });
    },
    onSearch() {
        this.pageChange(1);
    }
  },

  components: {
    newAdd,
    proEdit,
    proDetail
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./product.less" lang="less"></style>

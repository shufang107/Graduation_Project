<template>
  <v-content class="user-assets-wrap">
    <v-form class="search-form" :model="ruleForm" ref="ruleForm">
      <v-row class="demo-row">
        <v-col span="24">
          <v-form-item label="用户ID" prop="userId">
            <v-input placeholder="请输入" v-model="ruleForm.userId"></v-input>
          </v-form-item>
          <v-form-item label="用户昵称" prop="userName">
            <v-input placeholder="请输入" v-model="ruleForm.userName"></v-input>
          </v-form-item>
          <v-form-item label="店铺ID" prop="storeId">
            <v-input placeholder="请输入" v-model="ruleForm.storeId"></v-input>
          </v-form-item>
          <v-form-item label="佣金余额区间" prop="balanceMin">
            <v-input placeholder="请输入金额" v-model="ruleForm.balanceMin"></v-input>
          </v-form-item>
          <v-form-item label="到" prop="balanceMax">
            <v-input placeholder="请输入金额" v-model="ruleForm.balanceMax"></v-input>
          </v-form-item>
          <v-form-item label="上次结算时间" prop="settlementTimeStart">
            <v-date-picker
              style="width: 100px;"
              placeholder="选择开始时间"
              clearable
              show-time
              v-model="ruleForm.settlementTimeStart"
            ></v-date-picker>
          </v-form-item>
          <v-form-item label="到" prop="settlementTimeEnd">
            <v-date-picker
              style="width: 100px;"
              placeholder="选择结束时间"
              clearable
              show-time
              v-model="ruleForm.settlementTimeEnd"
            ></v-date-picker>
          </v-form-item>
          <v-form-item>
            <v-button type="primary" html-type="button" @click="onSearch">查询</v-button>
            <v-button type="primary" html-type="button" :loading="upLoading" @click="onUpdate">实时更新</v-button>
            <v-button type="ghost" @click.prevent="resetForm('ruleForm')">清空条件</v-button>
          </v-form-item>
        </v-col>
      </v-row>
    </v-form>
    <div class="data-gird" :style="`height:${gridHeight};text-align:left`">
      <v-data-table :columns="columns" :currentData="cartlistData" :data="getData">
        <template slot="td" slot-scope="props">
          <div v-if="props.column.field=='operate'">
            <v-button type="primary" size="small" @click="onTransferData(props.item)">结算</v-button>
            <v-button type="primary" size="small" @click="showNormaldetail(props.item)">详情</v-button>
          </div>
          <span v-else v-html="props.content"></span>
        </template>
      </v-data-table>
    </div>
    <template>
      <v-pagination
          style="text-align:right;margin-top:10px"
          show-quick-jumper
          :total="dataTotal"
          @change="pageChange"
          :value="currentPage"
          :show-total="showTotal"
      ></v-pagination>
    </template>
    <detail-assets
      :detailVisible="detailVisible"
      v-on:changeBul="bulState"
      :detailItem="detailItem"
    ></detail-assets>
    
  </v-content>
</template>

<script>
import api from "./api.js";
import transform from "@/util/transform.js";
import detailAssets from "./detailassets/detailassets.vue";
import moment from "moment";
import Cookie from "cookie.js";
import { setTimeout } from 'timers';
export default {
  name: "assets-list",
  data() {
    return {
      dataTotal: 0, //页总数
      currentPage: 1,
      numsPerPage: 10,
      cartlistData: [],
      ruleForm: {
        userId: "",
        userName: "",
        storeId: "",
        balanceMin: "",
        balanceMax: "",
        settlementTimeStart: "",
        settlementTimeEnd: ""
      },
      detailItem: {},
      gridHeight: "500px",
      detailVisible: false,
      upLoading:false
    };
  },
  created() {
    this.columns = [
      { title: "用户ID", field: "userId" },
      { title: "用户昵称", field: "userName" },
      { title: "店铺ID", field: "storeId" },
      { title: "佣金余额", field: "balance" },
      { title: "累计收益", field: "earning" },
      { title: "累计消费", field: "expend" },
      { title: "累计结算", field: "settlement" },
      { title: "待入账", field: "account" },
      { title: "结算次数", field: "times" },
      { title: "上次结算时间", field: "settlementTime" },
      { title: "操作员", field: "operator" },
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
        .get(api.asset_list, {
          params: {
            currentPage: _this.currentPage,
            numsPerPage: _this.numsPerPage
          }
        })
        .then(res => {
          _this.dataTotal = res.data.count;
          let ary = res.data.items;
          _this.dataTotal = res.data.count;
          let result = transform.getDataTable({
            items: res.data.items
          });
          console.log(result);
          return result;
        });
    },
    pageChange(page) {
      let _this = this;
      _this.currentPage = page;
      _this.onFetchSearch();
    },
    onFetchSearch() {
      var _this = this;
      return _this.$http
        .get(api.asset_list, {
          params: {
            currentPage: _this.currentPage,
            numsPerPage: _this.numsPerPage,
            userId: _this.ruleForm.userId,
            userName: _this.ruleForm.userName,
            storeId: _this.ruleForm.storeId,
            balanceMin: _this.ruleForm.balanceMin,
            balanceMax: _this.ruleForm.balanceMax,
            settlementTimeStart: _this.ruleForm.settlementTimeStart,
            settlementTimeEnd: _this.ruleForm.settlementTimeEnd
          }
        })
        .then(res => {
          console.log(res.data);
          _this.dataTotal = res.data.count;
          let ary = res.data.items;
          _this.dataTotal = res.data.count;
          for (let i = 0; i < ary.length; i++) {
            ary[i]["settlementTime"] = moment(ary[i].settlementTime).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          }
          let result = transform.getDataTable({
            items: res.data.items
          });
          console.log(result);
          _this.cartlistData = result.result;
          return result;
        });
    },
    onSearch() {
      this.pageChange(1);
    },
    showTotal() {
      return `总共` + this.dataTotal + `条数据`;
    },
    showNormaldetail(item) {
      this.detailItem = item;
      this.detailVisible = true;
    },
    bulState(data) {
      this.detailVisible = data;
    },
    //实时更新资产列表数据
    onUpdate() {
      let _this = this;
      _this.upLoading = true;
      this.$http.get(api.data_update).then(res => {
        if (parseInt(res.code) == 0) {
          _this.$message.success("操作成功!", 0.5);
        }
      });
      setTimeout(function(){
          _this.upLoading = false;
      },5000)
    },
    //结算当前数据
    onTransferData(item) {
      let _this = this;
      let operator = Cookie.get("username") ;
      // console.log('username',username)
      this.$modal.confirm({
        title: "您是否要结算当前数据",
        content: "确认则结算",
        onOk: function() {
          _this.$http
            .post(api.settlement, {
              userId: item.userId,
              storeId: item.storeId,
              operator:operator,
            })
            .then(res => {
              if(res.code == 1000){
                _this.$message.error("已存在结算信息或者佣金余额为0!", 1);
              }else{
                _this.$message.success("操作成功!", 0.8);
                _this.pageChange(1);
              }
              
            });
        },
        onCancel: function() {
          // return new Promise(function(resolve) {
          //   setTimeout(resolve, 1000);
          // });
        }
      });
    }
  },

  components: {
    detailAssets
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./assets.less" lang="less"></style>

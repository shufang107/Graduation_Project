<template>
  <v-content class="teamProfit-wrap">
    <v-form class="search-form" :model="searchForm" ref="searchForm">
      <v-row class="demo-row">
        <v-col span="24">
          <v-form-item label="用户ID" prop="userId">
            <v-input v-model="searchForm.userId" placeholder="请输入，以‘，’分隔"></v-input>
          </v-form-item>
          <v-form-item label="店铺ID" prop="storeId">
            <v-input v-model="searchForm.storeId" placeholder="请输入，以‘，’分隔"></v-input>
          </v-form-item>
          <v-form-item label="用户昵称" prop="nickName">
            <v-input v-model="searchForm.nickName" placeholder="请输入"></v-input>
          </v-form-item>
        </v-col>
        <v-col span="24">
          <v-form-item label="团队人数" prop="teamNumSt">
            <v-input v-model="searchForm.teamNumSt" placeholder="请输入"></v-input>
          </v-form-item>
          <v-form-item label="至" prop="teamNumEd">
            <v-input v-model="searchForm.teamNumEd" placeholder="请输入"></v-input>
          </v-form-item>
          <v-form-item label="团队销售额" prop="teamSaleSt">
            <v-input v-model="searchForm.teamSaleSt" placeholder="请输入"></v-input>
          </v-form-item>
          <v-form-item label="至" prop="teamSaleEd">
            <v-input v-model="searchForm.teamSaleEd" placeholder="请输入"></v-input>
          </v-form-item>
          <v-form-item label="团队总收益" prop="teamProfitSt">
            <v-input v-model="searchForm.teamProfitSt" placeholder="请输入"></v-input>
          </v-form-item>
          <v-form-item label="至" prop="teamProfitEd">
            <v-input v-model="searchForm.teamProfitEd" placeholder="请输入"></v-input>
          </v-form-item>
          <v-form-item>
            <v-button type="primary" html-type="button" @click="onSearch">查询</v-button>
            <v-button type="ghost" @click.prevent="resetForm('searchForm')">清空条件</v-button>
          </v-form-item>
        </v-col>
      </v-row>
    </v-form>
    <div class="data-gird" :style="`height:${gridHeight};text-align:left`">
      <v-data-table :columns="columns" :data="getData" :currentData="cartlistData">
        <template slot="td" slot-scope="props">
          <div v-if="props.column.field=='headImgUrl'">
            <img :src="props.content" style="width:50px" :key="props.content" >
          </div>
          <span v-else v-html="props.content"></span>
        </template>
      </v-data-table>
      <v-pagination
        style="text-align:right;margin-top:10px;"
        show-quick-jumper
        :total="dataTotal"
        @change="pageChange"
        :value="currentPage"
      ></v-pagination>
    </div>
  </v-content>
</template>

<script>
import api from "./api.js";
import transform from "@/util/transform.js";

export default {
  data() {
    return {
      dataTotal: 0, //页总数
      currentPage: 1,
      numsPerPage: 10,
      gridHeight: "500px",
      gridWidth: "800px",
      cartlistData: [],
      searchForm: {
        userId: "",
        storeId: "",
        nickName: "",
        teamNumSt: "",
        teamNumEd: "",
        teamSaleSt: "",
        teamSaleEd: "",
        teamProfitSt: "",
        teamProfitEd: ""
      }
    };
  },
  mounted() {},
  created() {
    this.columns = [
      { title: "用户ID", field: "userId" },
      { title: "用户头像", field: "headImgUrl" },
      { title: "店铺ID", field: "storeId" },
      { title: "店主昵称", field: "nickName" },
      { title: "好友佣金奖励", field: "inviteCommission" },
      { title: "团队人数", field: "memberCount" },
      { title: "客单价", field: "perCustomerTransaction" },
      { title: "件单价", field: "perGoodsTransaction" },
      { title: "团队销售额", field: "teamSale" },
      { title: "团队总收益", field: "teamCommission" }
    ];
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getData() {
      let _this = this;
      return _this.$http
        .get(api.get_team_income, {
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
        .get(api.get_team_income, {
          params: {
            type: 0,
            currentPage: _this.currentPage,
            numsPerPage: _this.numsPerPage,
            userId: _this.searchForm.userId,
            storeId: _this.searchForm.storeId,
            nickName: _this.searchForm.nickName,
            teamNumSt: _this.searchForm.teamNumSt,
            teamNumEd: _this.searchForm.teamNumEd,
            teamSaleSt: _this.searchForm.teamSaleSt,
            teamSaleEd: _this.searchForm.teamSaleEd,
            teamProfitSt: _this.searchForm.teamProfitSt,
            teamProfitEd: _this.searchForm.teamProfitEd
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
    onSearch() {
      this.pageChange(1);
    }
  },
  components: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./teamProfit.less" lang="less"></style>

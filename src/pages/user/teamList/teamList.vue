<template>
  <v-content class="teamList-wrap">
    <v-form class="search-form" :model="ruleForm" ref="ruleForm">
      <v-row class="demo-row">
        <v-col span="24">
          <v-form-item label="用户ID" prop="userId">
            <v-input v-model="ruleForm.userId" placeholder="请输入"></v-input>
          </v-form-item>
          <v-form-item label="店铺ID" prop="storeId">
            <v-input v-model="ruleForm.storeId" placeholder="请输入"></v-input>
          </v-form-item>
          <v-form-item label="用户昵称" prop="nickName">
            <v-input v-model="ruleForm.nickName" placeholder="请输入"></v-input>
          </v-form-item>
          <v-form-item label="团队人数" prop="teamNumSt">
            <v-input-number :min="1" :step="1" v-model="ruleForm.teamNumSt"></v-input-number>
          </v-form-item>
          <v-form-item label="到" prop="teamNumEd">
            <v-input-number :min="1" :step="1" v-model="ruleForm.teamNumEd"></v-input-number>
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
          <div v-if="props.column.field=='operate'">
            <v-button type="primary" size="small" @click="showDetailmodel(props.item)">团队详情</v-button>
          </div>
          <div v-else-if="props.column.field=='headImgUrl'">
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
    <team-detail :detailVisible="detailVisible" :detailItem="detailItem" @changeBul="bulState"></team-detail>
  </v-content>
</template>

<script>
import api from "./api.js";
import teamDetail from "./teamDetail/teamDetail";
import transform from "@/util/transform.js";

export default {
  data() {
    return {
      dataTotal: 0, //页总数
      currentPage: 1,
      numsPerPage: 10,
      ruleForm: {
        userId: "",
        storeId: "",
        nickName: "",
        teamNumSt: "",
        teamNumEd: ""
      },
      gridHeight: "500px",
      gridWidth: "800px",
      cartlistData: [],
      detailVisible: false,
      detailItem:{},
      columns: []
    };
  },
  mounted() {},
  created() {
    this.columns = [
      { title: "用户ID", field: "userId" },
      { title: "用户头像", field: "headImgUrl" },
      { title: "用户昵称", field: "nickName" },
      { title: "店铺ID", field: "storeId" },
      { title: "所在地区", field: "city" },
      { title: "上级店主", field: "parentName" },
      { title: "上级店主ID", field: "parentId" },
      { title: "团队人数", field: "memberCount" },
      { title: "操作", field: "operate" }
    ];
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getData() {
      let _this = this;
      return _this.$http
        .get(api.get_team, {
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
    showDetailmodel(obj) {
      this.detailItem = obj;
      this.detailVisible = true;
    },
    bulState(data) {
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
        .get(api.get_team, {
          params: {
            currentPage: _this.currentPage,
            numsPerPage: _this.numsPerPage,
            userId: _this.ruleForm.userId,
            storeId: _this.ruleForm.storeId,
            nickName: _this.ruleForm.nickName,
            teamNumSt: _this.ruleForm.teamNumSt,
            teamNumEd: _this.ruleForm.teamNumEd
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
  components: {
    teamDetail
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./teamList.less" lang="less"></style>

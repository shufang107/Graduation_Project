<template>
  <div class="activitymanagement-wrap">
    <v-form class="search-form">
      <v-row class="demo-row">
        <v-col span="18">
          <v-form-item label="用户ID">
            <v-input v-model="ruleForm.userId" placeholder="请输入用户ID"></v-input>
          </v-form-item>
          <v-form-item label="店铺ID">
            <v-input v-model="ruleForm.storeId" placeholder="请输入店铺ID"></v-input>
          </v-form-item>
          <v-form-item label="用户昵称">
            <v-input v-model="ruleForm.nickName" placeholder="请输入用户昵称"></v-input>
          </v-form-item>
          <v-form-item label="备注">
            <v-input v-model="ruleForm.reMark" placeholder="请输入备注"></v-input>
          </v-form-item>
        </v-col>
        <v-col span="4">
            <v-button type="primary" @click="onSearch(ruleForm)">查询</v-button>
            <!-- <v-button type="ghost" @click.prevent="resetForm('ruleForm')">清空条件</v-button> -->
        </v-col>
      </v-row>
    </v-form>
    <br>
    <v-row class="demo-row">
      <v-col span="6">
        <v-button type="primary" html-type="button" @click="downloadtemp">下载导入模板</v-button>
          <v-button type="primary" html-type="button" @click="showModel">新建活动</v-button>
      </v-col>
    </v-row>  
    <br>    
    <div class="data-gird" :style="`height:${gridHeight};width:${gridWidth};text-align:left;margin-bottom:10px `">
      <v-data-table :data="getData" :currentData="cartlistData" :columns="columns">
        <template slot="td" slot-scope="props">
          <div v-if="props.column.field=='headImgUrl'">
            <img :src="props.content" style="width:50px;height:50px" alt>
          </div>
          <span v-else v-html="props.content"></span>
        </template>
      </v-data-table>
      <br>
      <v-pagination
        style="text-align:left;"
        size="small"
        show-quick-jumper
        :total="dataTotal"
        @change="pageChange"
        :value="currentPage"
        :show-total="showTotal"
      ></v-pagination>
      <upload-active :uploadVisible="uploadVisible" @close=close />
     </div> 
    </div> 
</template>

<script>
import request from "@/util/ajax.js";
import transform from "@/util/transform.js";
import api from "./api.js";
import uploadActive from "./uploadactive/uploadactive";
import setting from "@/setting/index.js";

export default {
    name:"marketing-activitymanagement",
    data(){
        return{
            searchLength:0,//查询条数
            dataTotal: 0, //页总数
            currentPage: 1,
            numsPerPage: 10,
            uploadVisible: false,
            columns: [],
            name: "file",
            action: setting.uploadSpuExcel,
            header: {},
            cartlistData: [] ,//更新的数组
            ruleForm:{
                userId:"",
                storeId:"",
                nickName:"",
                reMark:""
            }
        };
    },
    created() {
    // console.log(api.getGoodsBystatus)
    this.gridHeight = document.body.clientHeight - 280 + "px";
    this.gridWidth = document.body.clientWidth - 180 + "px";
    this.columns = [
      { title: "用户ID", field: "userId"},
      { title: "用户头像", field: "headImgUrl"},
      { title: "用户昵称", field: "nickname" },
      { title: "店铺ID", field: "storeId"},
      { title: "奖励金额", field: "commission"},
      { title: "备注", field: "remark" },
    ];
  },
    methods: {
      // resetForm(formName) {
      //   this.$refs[formName].resetFields();
      // },
      close() {
        this.uploadVisible = false;
      },
      getData() {
      var _this = this;
      return _this.$http
        .get(api.userbalance, {
          params: {
            currentPage: _this.currentPage,
            numsPerPage: _this.numsPerPage
          }
        })
        .then(res => {
          _this.dataTotal = res.data.count;
          let result = transform.getDataTable({
            items: res.data.data,
            pageSize: res.data.numsPerPage,
            pageNo: res.data.count
          });
          console.log(result);
          return result;
        });
    },
    onFetchSearch() {
      var _this = this;
      return _this.$http
        .get(api.userbalance, {
          params: {
            nickName: _this.ruleForm.nickName,
            storeId: _this.ruleForm.storeId,
            reMark: _this.ruleForm.reMark,
            userId:_this.ruleForm.userId,
            currentPage: _this.currentPage,
            numsPerPage: _this.numsPerPage
          }
        })
        .then(res => {
          _this.dataTotal = res.data.count;
          let result = transform.getDataTable({
            items: res.data.data,
          });
          
          console.log(result)
          this.cartlistData = result.result;
          return result;
        });
    },
    pageChange(page) {
      this.currentPage = page;
      this.onFetchSearch();
      this.cartlistData=null;
    },
    showTotal() {
      return `总共` + this.dataTotal + `条数据`;
    },
    onSearch() {
      this.currentPage = 1;
      this.onFetchSearch();
      this.dataTotal = this.searchLength;
      this.cartlistData=null;
    },
    //模板下载
    downloadtemp() {
      location.href = setting.downLoadSalesdetail + new Date().getTime();
    },
    //上传
    onChange(info) {
      let _this = this;
      if (info.file.status !== "uploading") {
      }
      if (info.file.status === "done") {
        _this.updataFails = info.file.response.data.fails;
        _this.updataSuccess =  info.file.response.data.success;
        this.uploadAlert();
        _this.$message.success("上传成功!", 0.5);
      } else if (info.file.status === "error") {
        _this.$message.error("上传失败!", 0.5);
      }
    },
    uploadAlert(){
        this.visible=true;
    },
    showModel() {
      this.uploadVisible = true;
    },
  },
  components:{
    uploadActive
  }
};
</script>
<style src="./activitymanagement.less" lang="less"></style>
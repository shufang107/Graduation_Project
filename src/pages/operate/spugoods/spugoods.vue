<template>
  <div class="operate-goods-wrap">
    <br>
    <div class="data-gird" :style="`height:${gridHeight};width:${gridWidth};text-align:left;margin-bottom:10px `">
      <v-data-table :data="getData" :currentData="cartlistData" :columns="columns">
        <template slot="td" slot-scope="props">
          <span v-html="props.content"></span>
        </template>
      </v-data-table>
    </div>
    <br>
     <v-pagination
        style="text-align:right;"
        show-quick-jumper
        :total="dataTotal"
        @change="pageChange"
        :value="currentPage"
        :show-total="showTotal"
      ></v-pagination>
    <!-- <edit-spu :editVisible="editVisible" :listData="listData" v-on:changeBul="bulState"></edit-spu>
    <detail-spu :detailVisible="detailVisible" :spuDatailId="spuDatailId" v-on:changeBul="bulState"></detail-spu> -->
    <v-modal 
       title="上传详情"
       :visible="visible"
       @ok="handleOk"
       @cancel="handleCancel"
       style="text-align: left"
             >
        失败(共{{updataFails.length}}条)：
         <v-row>
            <v-col span="6" :key="fails.spu" v-for="fails in updataFails">
                {{fails.spu}}
            </v-col>
        </v-row>
        <br>
        成功(共{{updataSuccess.length}}条)：
        <v-row>
            <v-col span="6" :key="success.spu"  v-for="success in updataSuccess">
                {{success.spu}}
            </v-col>
        </v-row>
    </v-modal>
  </div>
</template>

<script>
import api from "./api.js";
import transform from "@/util/transform.js";
// import editSpu from "./editspu/editspu";
// import detailSpu from "./detailspu/detailspu";
import request from "@/util/ajax.js";
import setting from "@/setting/index.js";

export default {
  name: "operate-goods",
  data() {
    return {
      searchLength:0,//查询条数
      dataTotal: 0, //页总数
      currentPage: 1,
      numsPerPage: 10,
      editVisible: false,
      detailVisible: false,
      name: "file",
      action: setting.uploadSpuExcel,
      header: {},
      tempId: "",
      gridHeight: "500px",
      gridWidth: "800px",
      ruleForm: {
        spu: "",
        status: ""
      },
      columns: [],
      listData: {},
      spuDatailId:'',//detailspu子组件
      cartlistData: [] ,//更新的数组
      visible:false,
      updataFails:[],
      updataSuccess:[],
      ruleForm:{
        startTime:'',
        endTime:''
      }
    };
  },
  mounted() {
    // this.getData();
  },
  created() {
    // console.log(api.getGoodsBystatus)
    this.gridHeight = document.body.clientHeight - 190 + "px";
    this.gridWidth = document.body.clientWidth - 190 + "px";
    this.columns = [
      { title: "时间",field: "spu"},
      { title: "数值", field: "spuName"},
      { title: "标准值", field: "skuCount"},
      { title: "差值", field: "status"},
    ];
  },
  methods: {
    updaydata(){

    },
    updayalldata(){

    },
    downloadFile(){

    },
    getData() {
      var _this = this;
      return _this.$http
        .get(api.getGoodsBySpuStatus, {
          params: {
            currentPage: _this.currentPage,
            numsPerPage: _this.numsPerPage
          }
        })
        .then(res => {
          _this.dataTotal = res.data.count;
          let result = transform.getDataTable({
            items: res.data.items,
            pageSize: res.data.numsPerPage,
            pageNo: res.data.count
          });
          return result;
        });
    },
    onFetchSearch() {
      //console.log(this.ruleForm.status)
      var _this = this;
      return _this.$http
        .get(api.getGoodsBySpuStatus, {
          params: {
            spuList: _this.ruleForm.spu,
            status: _this.ruleForm.status,
            currentPage: _this.currentPage,
            numsPerPage: _this.numsPerPage
          }
        })
        .then(res => {
          //console.log(res.data) ;
          _this.dataTotal = res.data.count;
          //console.log(res.data.items.length)
          //_this.searchLength = res.data.items.length;
          let result = transform.getDataTable({
            items: res.data.items
          });
          console.log(result)
          this.cartlistData = result.result;
          return result;
        });
    },
    online(item) {
      //console.log(obj)
      var _this = this;
      //console.log(onlineText)
      this.$modal.confirm({
        title: "您确认要上线" + item.spu + "？",
        content: "",
        onOk: function() {
          _this.$http
            .post(
              api.updateSpuStatus,
              {
                spu: item.spu,
                status: "0"
              },
              {
                headers: {
                  "Content-Type": "application/json"
                }
              }
            )
            .then(res => {
              if (res.code == 0) {
                _this.$message.success("上线成功!", 0.5);
                //_this.$refs.ruleForm.reload();
              } else {
                _this.$message.error("上线失败!", 0.5);
              }
               _this.onSearch();//重新查询
            });
         
        },
        onCancel: function() {
           _this.onSearch();//重新查询
        }
      });
    },
    offline(item) {
      //console.log(obj)
      var _this = this;
      //console.log(onlineText)
      this.$modal.confirm({
        title: "您确认要下线" + item.spu + "？",
        content: "",
        onOk: function() {
          _this.$http
            .post(
              api.updateSpuStatus,
              {
                spu: item.spu,
                status: "1"
              },
              {
                headers: {
                  "Content-Type": "application/json"
                }
              }
            )
            .then(res => {
              if (res.code == 0) {
                _this.$message.success("下线成功!", 0.5);
                //_this.$refs.ruleForm.reload();
              } else {
                _this.$message.error("下线失败!", 0.5);
              };
              _this.onSearch();//重新查询
            });
        },
        onCancel: function() {
          _this.onSearch();//重新查询
        }
      });
    },
    deleteproduct(item) {
      //console.log(obj)
      var _this = this;
      //console.log(onlineText)
      this.$modal.confirm({
        title: "您确认要下架" + item.spu + "？",
        content: "",
        onOk: function() {
          _this.$http
            .post(api.updateSpuStatus, {
              spu: item.spu,
              status: "2"
            })
            .then(res => {
              if (res.code == 0) {
                _this.$message.success("下架成功!", 0.5);
                //_this.$refs.ruleForm.reload();
              } else {
                _this.$message.error("下架失败!", 0.5);
              };
              _this.onSearch();//重新查询
            });

        },
        onCancel: function() {
          _this.onSearch();//重新查询
        }
      });
    },
    //编辑
    // showEditmodel(obj) {
    //   this.editVisible = true;
    //   this.listData = obj;
    //   //console.log('obj',obj)
    //   this.onSearch();//重新查询
    // },
    //点击详情
    showDetailmodel(obj) {
      //console.log('obj',obj)
      this.spuDatailId = obj.spu;
      this.detailVisible = true;
      //this.listData = obj;
      this.onSearch();//重新查询
    },
    bulState(data) {
      // this.editVisible = data;
      this.detailVisible = data;
      // this.$refs["ruleForm"].resetFields();//重新加载表
      // this.$refs.ruleForm.refresh();
      this.onSearch();
    },
    onSearch() {
      this.currentPage = this.currentPage;
      this.onFetchSearch();
      this.dataTotal = this.searchLength;
      this.cartlistData=null;
    },
    inputonSearch(){
      this.currentPage = 1;
      this.onFetchSearch();
      this.dataTotal = this.searchLength;
      this.cartlistData=null;
    },
    pageChange(page) {
      this.currentPage = page;
      this.onFetchSearch();
      this.cartlistData=null;
    },
    //模板下载
    downloadtemp() {
      location.href = setting.downLoadSpuTemp + new Date().getTime();
    },
    handleOk(){
        this.visible = false;
    },
    handleCancel(){
        this.visible = false;
    },
    showTotal() {
      return `总共` + this.dataTotal + `条数据`;
    },
  },
  // components: {
  //   editSpu,
  //   detailSpu,
  // }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./spugoods.less" lang="less"></style>

<template>
    <v-content class="shopownerenroll">
        <v-form class="search-from" :model="ruleForm" ref="ruleForm">
            <v-row class="demo-row">
                <v-col span="18">
                    <v-form-item label="开始时间"  prop="startTime">
                        <v-date-picker style="width: 100px;" placeholder="选择开始时间"  clearable v-model="ruleForm.startTime"></v-date-picker>
                    </v-form-item>
                    <v-form-item label="至" prop="endTime">
                        <v-date-picker style="width: 100px;" placeholder="选择结束时间" clearable v-model="ruleForm.endTime"></v-date-picker>
                    </v-form-item>
                    <v-form-item>
                        <v-button type="primary" @click="onSearch(ruleForm)">查询</v-button>&nbsp;&nbsp;
                        <v-button type="ghost" @click.prevent="resetForm('ruleForm')">清空条件</v-button>&nbsp;&nbsp;
                        <v-button type="primary" @click="downloadFile">下载结果</v-button>&nbsp;&nbsp;
                        <v-button type="primary" @click="updaydata">更新当天数据</v-button>&nbsp;&nbsp;
                        <v-button type="primary" @click="updayalldata">更新全部数据</v-button>
                   </v-form-item>
                </v-col>
            </v-row>
        </v-form>
       <br>
    
       <div :style="`height:${gridHeight};width:${gridWidth};text-align:left`">
           <v-data-table :data='getData' :columns='columns' :currentData='cartlistData'>
               <template slot="td" slot-scope="props">
                    <div v-if="props.column.field == 'totalTransaction'">
                        {{props.item.unit}}{{props.content}}
                    </div>
                    <div v-else-if="props.column.field == 'commission'">
                        {{props.item.unit}}{{props.content}}
                    </div>
                    <div v-else-if="props.column.field == 'transactionPerStore'">
                        {{props.item.unit}}{{props.content.toFixed(2)}}
                    </div>
                    <div v-else-if="props.column.field == 'commissionPerStore'">
                        {{props.item.unit}}{{props.content.toFixed(2)}}
                    </div>
                    <div v-else-if="props.column.field == 'orderCountPerStore'">
                        {{props.content.toFixed(2)}}
                    </div>
                    <div v-else-if="props.column.field == 'productCountPerStore'">
                        {{props.content.toFixed(2)}}
                    </div>
                    <span v-else v-html = "props.content"></span>
               </template>
           </v-data-table>
           <br>
            <v-pagination
                style="text-align:right;"
                show-quick-jumper
                :total="dataTotal"
                :show-total="showTotal"
                @change="pageChange"
            ></v-pagination>
        </div>  
    </v-content>
</template>

<script>
import request from "@/util/ajax.js";
import transform from "@/util/transform.js";
import api from "./../api.js";
import setting from "@/setting/index.js";

export default {
    name:"count-shopownerenroll",
    data() {
        return {
            cartlistData:[],    //更新表格组件数据的数组
            columns: [],
            dataTotal:0,
            currentPage:1,
            numsPerPage:10,
            gridHeight:'',
            gridWidth:'',
            collection:'day_order',  //表名 店主销售数据
            query:'{}',   //查询条件
            sort:'{date:-1}',
            ruleForm:{
                startTime:'',
                endTime:''
            }
        };
    },
    created() {
        this.gridHeight = document.body.clicentHeight - 280 + 'px';
        this.gridWidth = document.body.clicentWidth - 180 + 'px';
        this.columns = [
            { title: "日期", field: "date"},
            { title: "开单店主", field: "storeCount"},
            { title: "订单数", field: "orderCount" },
            { title: "销售额", field: "totalTransaction"},
            { title: "销量", field: "productCount"},
            { title: "待支付佣金", field: "commission" },
            { title: "店均订单", field: "orderCountPerStore" },
            { title: "店均销售额", field: "transactionPerStore" },
            { title: "店均销量", field: "productCountPerStore" },
            { title: "店均佣金", field: "commissionPerStore" },
        ];
    },
    mounted() {},
    methods: {
        updaydata(){
          var _this = this;
          return _this.$http
          .get(api.updayResult,{
              params:{
                  day:0,
                  index:4
              }
          })
          .then(res =>{
              _this.getData();
              this.$message.info("数据更新完成");
          })
        },
        updayalldata(){
          var _this = this;
          return _this.$http
          .get(api.updayallResult,{
              params:{
                  index:4
              }
          })
          .then(res =>{
              _this.getData();
              this.cartlistData=null;
              this.$message.info("数据更新完成");
          })
        },
        resetForm(formName){
            this.$refs[formName].resetFields();
        },
        getData() {
            var _this = this;
            return _this.$http
            .get(api.getMongoFindResult, {
                params: {
                    collection:_this.collection,
                    currentPage: _this.currentPage,
                    numsPerPage: _this.numsPerPage,
                    query:_this.query,
                    sort:_this.sort,
                }
            })
            .then(res => {
                _this.dataTotal = res.data.count;
                // console.log(res);
                let result = transform.getDataTable({
                    items: res.data.items,
                    pageSize: res.data.numsPerPage,
                    pageNo: res.data.count
                });
                _this.cartlistData = result.result;
                return result;
            });
        },
        showTotal(){
            return `总共` + this.dataTotal + `条数据`;
        },
        onSearch() {
            this.currentPage = 1;
            this.onFetchSearch();
            this.dataTotal = this.searchLength;
            this.cartlistData=null;
        },
        resetForm(formName){
            this.$nextTick(()=>{
                this.$refs[formName].resetFields();
            })                
        },
        pageChange(page) {
            this.currentPage = page;
            this.onFetchSearch();
            this.cartlistData=null;
        },
        onFetchSearch() {
            var _this = this;
            // var startTime = (_this.ruleForm.startTime).replace(/-/g,''); 
            // var endTime = (_this.ruleForm.endTime).replace(/-/g,'');
            var startTime = (_this.ruleForm.startTime);
            var endTime = (_this.ruleForm.endTime);
            if(startTime && endTime){
                _this.query = `{"date":{$gte:"${startTime}",$lte:"${endTime}"}}`;
            }else if(startTime){
                _this.query = `{"date":{$gte:"${startTime}"}}`;
            }else if(endTime){
                _this.query = `{"date":{$lte:"${endTime}"}}`;
            }else{
                _this.query = '{}';
            }

            return _this.$http
            .get(api.getMongoFindResult, {
                params: {
                    collection:_this.collection,
                    currentPage: _this.currentPage,
                    numsPerPage: _this.numsPerPage,
                    query:_this.query,
                    sort:_this.sort
                }
            })
            .then(res => {
                _this.dataTotal = res.data.count;
                let result = transform.getDataTable({
                    items: res.data.items,
                });
                this.cartlistData = result.result;
                return result;
            });
        },
        downloadFile() {
        var _this = this;
        let url =
            setting.downloadCountexcel +
            `?index=4
            &query=${_this.query}
            &sort=${_this.sort}`;
            location.href=url;
        },
    },
    
}
</script>
<style src="./shopmansalesdata.less" lang="less"></style>


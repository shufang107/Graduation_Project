<template>
 
    <v-content class="shopownerenroll">
       <div :style="`height:${gridHeight};width:${gridWidth};text-align:left`">
           <v-data-table :data='getData' :columns='columns' :currentData='cartlistData'>

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
            collection:'day_user_summary',  //表名用户店主注册
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
            { title: "时间", field: "date"},
            { title: "数值", field: ""},
            { title: "标准值", field: "" },
            { title: "差值", field: ""},
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
                  index:1
              }
          })
          .then(res =>{
            //   _this.query = '{}';
              _this.getData();
              this.$message.info("数据更新完成");
          })
        },
        updayalldata(){
          var _this = this;
          return _this.$http
          .get(api.updayallResult,{
              params:{
                  index:1
              }
          })
          .then(res =>{
            //   _this.query = '{}';
              _this.getData();
              this.$message.info("数据更新完成");
          })
        },
        resetForm(formName){
            console.log(formName);
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
                console.log(res);
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
            // console.log(startTime);
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
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        downloadFile() {
        var _this = this;
        // console.log(_this.query);
        // console.log(_this.sort);
        let url =
            setting.downloadCountexcel +
            `?index=1
            &query=${_this.query}
            &sort=${_this.sort}`;
            // console.log(url);
            location.href=url;
        },
    },
    
}
</script>
<style src="./shopownerenroll.less" lang="less"></style>


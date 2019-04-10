<template>
    <v-content class="shopownerenroll">
        <v-row type="flex">
        <v-col span="24">
            <h1>今日数据曲线</h1>
        </v-col>
        </v-row>

        <v-row type="flex">
        <v-col span="24">
            <g2-line :charData="servenData" id='c8'></g2-line>
        </v-col>
        </v-row>
        
        <br>
        <v-row type="flex">
        <v-col span="24">
            <h1>历史数据曲线</h1>
        </v-col>
        </v-row>

        <v-row type="flex">
        <v-col span="24">
            <g2-line :charData="thirtyData" id='c9'></g2-line>
        </v-col>
        </v-row>
    </v-content>
</template>

<script>
import request from "@/util/ajax.js";
import transform from "@/util/transform.js";
import api from "./../api.js";
import setting from "@/setting/index.js";
import moment from 'moment'; 
import momenttimezone from 'moment-timezone';
import G2Line from "@/components/cg2line/cg2line";

export default {
    name:"count-shopownerenroll",
    data() {
        return {
            servenData: [],
            fourteenData: [],
            thirtyData:[],
            servenSaleData: [],
            fourteenSaleData: [],
            thirtySaleData:[],
            cartlistData:[],    //更新表格组件数据的数组
            columns: [],
            dataTotal:0,
            currentPage:1,
            numsPerPage:10,
            gridHeight:'',
            gridWidth:'',
            collection:'day_product_summary',  //表名 商品销售数据
            query:'{}',   //查询条件
            sort:'{date:-1}',
            ruleForm:{
                startTime:'',
                endTime:''
            } 
        };
    },
    created() {
        this.getorderchar();
    },
    mounted() {},
    methods: {
         getdate(){
            var currentTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            var utcTime = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');   
            var amTime = moment.tz(new Date(), "America/Los_Angeles").format('YYYY-MM-DD HH:mm:ss');    
            var timeDiff = moment(currentTime).unix() - moment(utcTime).unix(); 
            var amtimeDiff = moment(amTime).unix() - moment(utcTime).unix(); 
            var amunixTime = moment(currentTime).unix() - timeDiff + amtimeDiff;
            this.endamtime = moment(amunixTime * 1000).format('YYYY-MM-DD') + '';
            //获取前30天日期
            this.lart30 = moment().subtract('days', 29).format('YYYY-MM-DD');
            this.dayquery = ' {date:"'+ this.endamtime + '"}'; 
            return this.dayquery,this.lart30,this.endamtime;
        },
        getorderchar() {
            var _this = this;
            this.getdate();
            return _this.$http
            .get(api.getMongoFindResult,{
                params:{
                collection:'day_order',
                currentPage: 1,
                numsPerPage: 30,
                query:`{"date":{$gte:"${_this.lart30}",$lte:"${_this.endamtime}"}}`,
                sort:'{date:-1}',
                }
            })
            .then(res => {
                var or_seventemparr = [];
                var or_fourteentemparr = [];
                var or_thirtytemparr = [];
                var sa_seventemparr = [];
                var sa_fourteentemparr = [];
                var sa_thirtytemparr = [];
                for(var i=0 ; i < 7 ; i++){
                or_seventemparr.push({
                    year : res.data.items[i].date,
                    value : res.data.items[i].orderCount
                });
                sa_seventemparr.push({
                    year : res.data.items[i].date,
                    value : res.data.items[i].totalTransaction
                })
                }
                for(var i=0 ; i < 14 ; i++){
                or_fourteentemparr.push({
                    year : res.data.items[i].date,
                    value : res.data.items[i].orderCount
                });
                sa_fourteentemparr.push({
                    year : res.data.items[i].date,
                    value : res.data.items[i].totalTransaction
                })
                }
                for(var i=0 ; i < res.data.items.length ; i++){
                or_thirtytemparr.push({
                    year : res.data.items[i].date,
                    value : res.data.items[i].orderCount
                });
                sa_thirtytemparr.push({
                    year : res.data.items[i].date,
                    value : res.data.items[i].totalTransaction
                })
                }
                _this.servenData = or_seventemparr;
                _this.fourteenData = or_fourteentemparr;
                _this.thirtyData = or_thirtytemparr;
                _this.servenSaleData = sa_seventemparr;
                _this.fourteenSaleData = sa_fourteentemparr;
                _this.thirtySaleData = sa_thirtytemparr;
            })
        },
        updaydata(){
          var _this = this;
          return _this.$http
          .get(api.updayResult,{
              params:{
                  day:0,
                  index:3
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
                  index:3
              }
          })
          .then(res =>{
              _this.getData();
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
                    sort:_this.sort
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
            `?index=3
            &query=${_this.query}
            &sort=${_this.sort}`;
        location.href=url;
        },
    },
    components: {
        G2Line: G2Line,     
    }
    
}
</script>
<style src="./salesdata.less" lang="less"></style>


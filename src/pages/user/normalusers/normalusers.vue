<template>
    <v-content class="user-normalusers-wrap">
       <v-row type="flex">
        <v-col span="24">
            <h1>今日数据曲线</h1>
        </v-col>
        </v-row>

        <v-row type="flex">
        <v-col span="24">
            <g2-line :charData="servenData" id='c6'></g2-line>
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
            <g2-line :charData="thirtyData" id='c7'></g2-line>
        </v-col>
        </v-row>
    </v-content>
</template>

<script>
import api from "./api.js";
import transform from '@/util/transform.js'
import moment from 'moment'; 
import momenttimezone from 'moment-timezone';
import G2Line from "@/components/cg2line/cg2line";

export default {
    name: "user-normalusers",
    data() {
        return {
            currentPage:1,//当前页
            numsPerPage:10,//每页限制条数
            dataTotal:0,//总条数
            ruleForm:{
                userId:'',
                nickname:'',
                sex:'',
                userType:'',
                source:'',
                platform:'',
                startTime:'',
                endTime:''  
            },
            servenData: [],
            fourteenData: [],
            thirtyData:[],
            servenSaleData: [],
            fourteenSaleData: [],
            thirtySaleData:[],
            gridHeight:"500px",
            columns:[],
            detailVisible:false,
            listData:{},
            cartlistData:[],
            sex:[
                {
                    value:"0",
                    label:"全部"
                },
                {
                    value:"1",
                    label:"男"
                },
                {
                    value:"2",
                    label:"女"
                }
                ],
        }
    },
    created() {
        this.getorderchar();
    },
    mounted() {},
    methods:{
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
    1},
        resetForm(formName){
            this.$refs[formName].resetFields();
        },
        getData() {
            var _this = this;
            let userType = '0';
            return _this.$http.get(api.get_user_list,{
                params:{
                    userType:userType,
                    numsPerPage:_this.numsPerPage
                }
            }).then(res => {
                // console.log("res.data",res.data)//对象
                 _this.dataTotal = res.data.items.count;
                let result = transform.getDataTable({
                    items : res.data.items.data
                })
                //console.log(result)
                return result;
            })
        },
        //查询
        onFetchSearch(){
            let userType = '0';//普通用户
            let userId = this.ruleForm.userId;
            let nickname = this.ruleForm.nickname;
            let startTime = this.ruleForm.startTime;
            let endTime = this.ruleForm.endTime;
            let currentPage = this.currentPage;//当前页
            let numsPerPage = this.numsPerPage;//每页限制条数
            console.log(currentPage,numsPerPage)
            this.$http.get(api.get_user_list,{
                params: {
                    userId,
                    userType,
                    nickname,
                    startTime,
                    endTime,
                    currentPage,
                    numsPerPage,
                    // sex,
                    // source,
                    // platform,
                }
            })
            .then( res => {
                console.log('注册列表',res.data);
                this.cartlistData = res.data.items.data;
                this.dataTotal = res.data.items.count;
            })
        },
        showDetailmodel(obj) {
            this.detailVisible = true;
            this.listData = obj ;
        },
        bulState(data) {
            this.detailVisible = data;
        },
         onSearch(){
            this.currentPage = 1;
            this.onFetchSearch();
        },
        pageAdd(page){
            this.currentPage += 1;
            this.onFetchSearch();
        },
        pageDec(page){
            this.currentPage -= 1;
            this.onFetchSearch();
        },
        showTotal() {
            return `总共` + this.dataTotal + `条数据`;
        },
        pageChange(page) {
            this.currentPage = page;
            this.onFetchSearch();
            this.cartlistData=null;
        },
    },
    components: {
        G2Line: G2Line,     
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./normalusers.less" lang="less"></style>

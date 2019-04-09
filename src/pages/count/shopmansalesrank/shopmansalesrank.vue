<template>
    <div class="shopmansalesrank">
        <v-tabs class="shopmansalesrank" active-tab-key="key1" @tab-click="onTabClick">
            <v-tab-pane tab-key="key1" tab="今日店主销售排行榜">
                <div class="data-gird" :style="`height:${gridHeight};width:${gridWidth};text-align:left;margin-bottom:10px `">
                    <v-data-table :data='getData' :columns='todayColumns' :currentData='cartlistData'>
                        <template slot="td" slot-scope="props">
                            <div v-if="props.column.field == 'userImage'">
                                <img :src="props.content" style="width:50px;height:50px" :key="props.content" alt>
                            </div>
                            <span v-else v-html = "props.content"></span>
                        </template> 
                    </v-data-table>
                </div>
            </v-tab-pane> 
            <v-tab-pane tab-key="key2" tab="累计店主销售排行榜">
                <v-data-table :data='allData' :columns='totalColumns' :currentData='allcartlistData'>
                    <template slot="td" slot-scope="props">
                        <div v-if="props.column.field == 'userImage'">
                            <img :src="props.content" style="width:50px;height:50px" :key="props.content" alt>
                        </div>
                        <span v-else v-html = "props.content"></span>
                    </template>
                </v-data-table>
            </v-tab-pane>
        </v-tabs>
        <br>
        <v-row>
            <v-col span="4">
                <v-button type="primary" @click="dltodayFile" v-show="showtoday">下载结果</v-button>
                <v-button type="primary" @click="dlallFile" v-show="showallday">下载结果</v-button>&nbsp;&nbsp;
                <v-button type="primary" @click="updaydata" v-show="showtoday">更新当天数据</v-button>&nbsp;&nbsp;
                <v-button type="primary" @click="updayalldata" v-show="showallday">更新全部数据</v-button>
            </v-col>
            <v-pagination
                    v-show="showtoday"
                    style="text-align:right"
                    show-quick-jumper
                    :total="dataTotal"
                    :show-total="showTotal"
                    @change="pageChange"
            ></v-pagination>
            <v-pagination
                    v-show="showallday"
                    style="text-align:right"
                    show-quick-jumper
                    :total="alldataTotal"
                    :show-total="showallTotal"
                    @change="allpageChange"
            ></v-pagination>
        </v-row>
    </div>   
</template>

<script>
import request from "@/util/ajax.js";
import transform from "@/util/transform.js";
import api from "./../api.js";
import setting from "@/setting/index.js";
import moment from 'moment'; 
import momenttimezone from 'moment-timezone';
    export default {
        data(){
            return{
                todayColumns:[],
                totalColumns:[],
                cartlistData:[],
                cartlistallData:[],
                allcartlistData:[],
                successlist:[],
                faillist:[],
                gridHeight: '',
                gridWidth: '',
                showtoday:true,
                showallday:'',
                currentPage:1,
                allcurrentPage:1,
                numsPerPage:10,
                dataTotal:0,
                alldataTotal:0, 
                collection:'store_rank',  //表名
                dayquery:'{}',
                query:'{date:"ALL"}',   //查询条件
                sort:'{orderCount:-1}',
                ruleForm:{
                    startTime:'',
                    endTime:''
                }
            }
        },
        created(){
            this.gridHeight = document.body.clicentHeight - 280 + 'px';
            this.gridWidth = document.body.clicentWidth - 360 + 'px';
            (this.todayColumns = [
                {title:"店铺ID",field:'storeId'},
                {title:"用户ID",field:'userId'},
                {title:"用户昵称",field:'userName'},
                {title:"用户头像",field:'userImage'},
                {title:"订单销量",field:'orderCount'},
                {title:"申请时间",field:'applyTime'},
                {title:"可用佣金",field:'usableCommission'},
                {title:"未入账佣金",field:'waittingCommission'},
                {title:"累积佣金",field:'accumCommission'},
                {title:"自购订单量",field:'selfOrderCount'},
            ]),
            (this.totalColumns = [ 
                {title:"店铺ID",field:'storeId'},
                {title:"用户ID",field:'userId'},
                {title:"用户昵称",field:'userName'},
                {title:"用户头像",field:'userImage'},
                {title:"订单销量",field:'orderCount'},
                {title:"申请时间",field:'applyTime'},
                {title:"可用佣金",field:'usableCommission'},
                {title:"未入账佣金",field:'waittingCommission'},
                {title:"累积佣金",field:'accumCommission'},
                {title:"自购订单量",field:'selfOrderCount'},
            ]);
        },
        methods: {
            updaydata(){
                var _this = this;
                return _this.$http
                .get(api.updayResult,{
                    params:{
                        day:0,
                        index:7
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
                        index:7
                    }
                })
                .then(res =>{
                    _this.allData();
                    this.cartlistData=null;
                    this.$message.info("数据更新完成");
                })
            },
            //当天数据
            showTotal(){
                return `总共` + this.dataTotal + `条数据`;
            },
            //总数据
            showallTotal(){
                return `总共` + this.alldataTotal + `条数据`;
            },
            pageChange(page){
                this.currentPage = page;
                this.getData();
                this.cartlistData=null;
            },
            allpageChange(page){
                this.allcurrentPage = page;
                this.allData();
                this.allcartlistData=null;
            },
            onTabClick(tabKey) {
                console.log(tabKey);
                if(tabKey == "key1"){
                    this.showtoday = true;
                    this.showallday = false;
                }else if(tabKey == "key2"){
                    this.showtoday = false;
                    this.showallday = true;
                }
            },
            getData() {
                var _this = this;
                var currentTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss'); //获取当前时区的时间
                var utcTime = moment(new Date()).utc().format('YYYY-MM-DD HH:mm:ss');   //获取零时区的时间
                var amTime = moment.tz(new Date(), "America/Los_Angeles").format('YYYY-MM-DD HH:mm:ss');    //获取美西时区时间
                var timeDiff = moment(currentTime).unix() - moment(utcTime).unix(); //当前时区与零时区的差
                var amtimeDiff = moment(amTime).unix() - moment(utcTime).unix(); //当前时区与零时区的差
                var amunixTime = moment(currentTime).unix() - timeDiff + amtimeDiff;
                // console.log(amunixTime);   //差值得到当前美西时间的时间戳
                // console.log(moment(new Date()).unix()); //当前时区的时间戳
                var endamtime = moment(amunixTime * 1000).format('YYYY-MM-DD') + '';
                // console.log(endamtime);
                
                _this.dayquery = ' {date:"'+ endamtime + '"}';

                return _this.$http
                .get(api.getMongoFindResult, {
                    params: {
                        collection:_this.collection,
                        currentPage: _this.currentPage,
                        numsPerPage: _this.numsPerPage,
                        query:_this.dayquery,
                        sort:_this.sort,
                    }
                })
                .then(res => {
                    // console.log(query);
                    _this.dataTotal = res.data.count;
                    let result = transform.getDataTable({
                        items: res.data.items,
                        pageSize: res.data.numsPerPage,
                        pageNo: res.data.count
                    });
                    _this.cartlistData = result.result;
                    return result;
                });
            },
            allData() {
                var _this = this;
                return _this.$http           
                .get(api.getMongoFindResult, {
                    params: {
                        collection:_this.collection,
                        currentPage: _this.allcurrentPage,
                        numsPerPage: _this.numsPerPage,
                        query:_this.query,
                        sort:_this.sort,
                    }
                })
                .then(res => {
                    _this.alldataTotal = res.data.count;
                    // console.log(res);
                    let result = transform.getDataTable({
                        items: res.data.items,
                        pageSize: res.data.numsPerPage,
                        pageNo: res.data.count
                    });
                    _this.allcartlistData = result.result;
                    return result;
                });
            },
            dltodayFile() {
                var _this = this;
                let url =
                    setting.downloadCountexcel +
                    `?index=7
                    &query=${_this.dayquery}
                    &sort=${_this.sort}`;
                location.href=url;
            },
            dlallFile() {
                var _this = this;
                let url =
                    setting.downloadCountexcel +
                    `?index=7
                    &query=${_this.query}
                    &sort=${_this.sort}`;
                location.href=url;
                console.log(url);
            },
        },
    };
</script>

<style src="./shopmansalesrank.less" lang="less"></style>


<template>
  <div id="page-index">
    <com-head type="normal" selected="index"></com-head>
    <div class="index-content">
      <!-- 第一行数据 -->
      <div class="card-groud">
        <v-row type="flex">
           <!-- v-bind="getselldata()" -->
          <v-col span="8"> 
            <v-row>
              <v-col span="4"></v-col>
              <v-col span="14" order="1">
                <div class="data-card">
                  <div>PH</div>
                  <div>{{orderCount}}</div>
                </div>
              </v-col>
              <v-col span="5"></v-col>
            </v-row>
          </v-col>
           <v-col span="8"> 
            <v-row>
              <v-col span="5"></v-col>
              <v-col span="14" order="1">
                <div class="data-card">
                  <div>浑浊度</div>
                  <div>{{orderCount}}</div>
                </div>
              </v-col>
              <v-col span="5"></v-col>
            </v-row>
          </v-col>
          <v-col span="8">
            <v-row>
              <v-col span="6"></v-col>
              <v-col span="14" order="4">
                <div class="data-card">
                  <div>温度</div>
                  <div>{{saleUser}}</div>
                </div>
              </v-col>
              <v-col span="4"></v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>

      <!-- 第二行数据-->
      <div class="row2">
        <v-row type="flex"> 
          <!--第二行左边-->  
          <v-col span="1"> </v-col>
          <v-col span="13">  
            <div>
              <v-row>  <!--左边二层图表-->
                  <div class="card-content">
                    <h2 style="text-align:center">PH值</h2>
                    <v-tabs active-tab-key="1">
                      <v-tab-pane tab-key="1" tab="近14小时数据">
                        <g2-line :charData="servenData" id='c1'></g2-line>
                      </v-tab-pane>
                    </v-tabs>
                  </div>
              </v-row>              
            </div>
          </v-col>
          <v-col span="1"> </v-col>
          <!--第二行右边店主排行tab页-->
          <v-col span="7" class="tabpag">  
            <template>
              <div class="data-gird" :style="`text-align:left;margin-bottom:10px `">
                <h2 style="text-align:center">今日PH数据</h2>
                <v-data-table :data='sp_getData' :columns='todayColumns' :currentData='sp_cartlistData' :emptyText="'暂时没有数据...'">
                    <template slot="td" slot-scope="props">
                        <div v-if="props.column.field == 'userImage'">
                            <img :src="props.content" style="width:50px;height:50px" alt>
                        </div>
                        <div v-else-if="props.column.field == 'transaction'">
                          ${{props.content.toFixed(2)}}
                        </div>
                        <span v-else v-html = "props.content"></span>
                    </template> 
                </v-data-table>
              </div>
            </template>
          </v-col>
        </v-row>
      </div>

      <!-- 第三行数据-->
      <div class="row3">
        <v-row type="flex">
          <v-col span="1"> </v-col>
          <v-col span="13">
            <div>
              <v-row> <!--左边三层图表-->
                    <div class="card-content">
                      <h2 style="text-align:center">浑浊度</h2>
                      <v-tabs active-tab-key="1">
                        <v-tab-pane tab-key="1" tab="近14小时数据">
                          <g2-line2 :charData="servenSaleData" :id="'c2'"></g2-line2>
                        </v-tab-pane>
                      </v-tabs>
                    </div>
                </v-row>
            </div>
          </v-col>
          <v-col span="1"> </v-col>
          <v-col span="7" class="tabpag">
            <template class="tabbackground">
              <div class="data-gird" :style="`text-align:left;margin-bottom:10px `">
                <h2 style="text-align:center">今日浑浊度数据</h2>
                <v-data-table :data='go_getData' :columns='todaygoodsColumns' :currentData='go_cartlistData' :emptyText="'暂时没有数据...'">
                    <template slot="td" slot-scope="props">
                        <div v-if="props.column.field == 'productImage'">
                            <img :src="props.content" style="width:30px;height:30px" alt>
                        </div>
                        <div v-else-if="props.column.field == 'productName'">
                            <span style="display:block;width:180px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis" v-html = "props.content"></span>
                        </div>
                        <span v-else v-html = "props.content"></span>
                    </template> 
                </v-data-table>
              </div>
            </template>
          </v-col>
        </v-row>
      </div>

      <!--第四行数据-->
      <div class="row3">
        <v-row type="flex">
          <v-col span="1"> </v-col>
          <v-col span="13">
            <div>
              <v-row> <!--左边三层图表-->
                    <div class="card-content">
                      <h2 style="text-align:center">温度</h2>
                      <v-tabs active-tab-key="1">
                        <v-tab-pane tab-key="1" tab="近14小时数据">
                          <g2-line2 :charData="servenSaleData" :id="'c3'"></g2-line2>
                        </v-tab-pane>
                      </v-tabs>
                    </div>
                </v-row>
            </div>
          </v-col>
          <v-col span="1"> </v-col>
          <v-col span="7" class="tabpag">
            <template class="tabbackground">
              <div class="data-gird" :style="`text-align:left;margin-bottom:10px `">
                <h2 style="text-align:center">今日温度数据</h2>
                <v-data-table :data='go_getData' :columns='todaygoodsColumns' :currentData='go_cartlistData' :emptyText="'暂时没有数据...'">
                    <template slot="td" slot-scope="props">
                        <div v-if="props.column.field == 'productImage'">
                            <img :src="props.content" style="width:30px;height:30px" alt>
                        </div>
                        <div v-else-if="props.column.field == 'productName'">
                            <span style="display:block;width:180px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis" v-html = "props.content"></span>
                        </div>
                        <span v-else v-html = "props.content"></span>
                    </template> 
                </v-data-table>
              </div>
            </template>
          </v-col>
        </v-row>
      </div>


      
    </div>
    <br><br>
  </div>
</template>

<script>
import request from "@/util/ajax.js";
import transform from "@/util/transform.js";
import comHead from "@/components/chead/chead";
import G2Line from "@/components/cg2line/cg2line";
import G2Line2 from "@/components/cg2line/cg2line2";
import moment from 'moment'; 
import momenttimezone from 'moment-timezone';
import api from "./api.js";

export default {
  name: "index",
  data() {
    return {
      //第一行展示数据
      unit:'',
      orderCount:0, //今日销售订单
      totalTransaction:0, //今日实收金额 
      commission:0,   //今日发放佣金
      saleUser:0,  //今日开单店主
      payShopkeeper:0,  //今日下单店主
      selfPayShopkeeper:0,  //今日自购店主
      
      //第二行左边展示数据
      newUser:0, //新增用户
      newShopkeeper:0,  //新增店主
      newSaleShopkeeper:0,
      newTeam:0,  //新增团队
      joinLeaderCount:0,  //裂变店主
      joinMemberCount:0,  //邀请店主

      todayColumns:[],  //当天排行表头
      totalColumns:[],  //累计排行表头
      todaygoodsColumns:[],
      totalgoodsColumns:[],
      sp_cartlistData:[],
      sp_allcartlistData:[],
      go_cartlistData:[],
      go_allcartlistData:[],
      dataTotal:0, 
      selldatacurrentPage:0,
      shopmancollection:'store_rank',  //表名
      todaycurrentPage:1,  //今日排行当前页
      allcurrentPage:1,   //累计排行当前页
      numsPerPage:5,  //每页数据数量
      dayquery:'',  //今日排行的查询条件
      query:'{date:"ALL"}',   //累计排行的查询条件
      endamtime:'',
      lart30:'',
      sort:'{}',
      servenData: [],
      fourteenData: [],
      thirtyData:[],
      servenSaleData: [],
      fourteenSaleData: [],
      thirtySaleData:[],
    };
  },
  created(){
    (this.todayColumns = [
      {title:"时间",field:'num'},
      {title:"数值",field:'transaction'},
    ]),
    (this.todaygoodsColumns = [
      {title:"时间",field:'num'},
      {title:"数值",field:'transaction'},
    ])
    this.getorderchar();
  },
  components: {
    comHead: comHead,
    G2Line: G2Line,
    G2Line2:G2Line2
  },
  methods: {
    //获取日期，设置传递的日期参数
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
    //第一行数据显示
    getselldata() {
      var _this = this;
      this.getdate();
      return _this.$http
      .get(api.getMongoFindResult,{
        params:{
          collection:'day_order',
          currentPage: _this.selldatacurrentPage,
          numsPerPage: _this.numsPerPage,
          query:_this.dayquery,
          sort:_this.sort,
        }
      })
      .then(res => {
        console.log(res.data.items.length);
        if(res.data.items.length == 0){

        }else{
          _this.unit = res.data.items[0].unit;
          _this.orderCount = res.data.items[0].orderCount;
          _this.totalTransaction = res.data.items[0].totalTransaction;
          _this.commission = res.data.items[0].commission;
        }
        
      });
    },
    getuserdata() {
      var _this = this;
      this.getdate();
      return _this.$http
      .get(api.getMongoFindResult,{
        params:{
          collection:'day_user_summary',
          currentPage: _this.selldatacurrentPage,
          numsPerPage: _this.numsPerPage,
          query:_this.dayquery,
          sort:_this.sort,
        }
      })
      .then(res => {
        console.log(res.data.items.length);
        if(res.data.items.length == 0){

        }else{
          _this.selfPayShopkeeper = res.data.items[0].selfPayShopkeeper;
          _this.saleUser = res.data.items[0].saleUser;
          _this.payShopkeeper = res.data.items[0].payShopkeeper;
          _this.newSaleShopkeeper = res.data.items[0].newSaleShopkeeper;
          _this.newUser = res.data.items[0].newUser;
          _this.newShopkeeper = res.data.items[0].newShopkeeper;
          _this.newTeam = res.data.items[0].newTeam;
        }
        
      })
    },
    getteamdata() {
      var _this = this;
      this.getdate();
      return _this.$http
      .get(api.getMongoFindResult,{
        params:{
          collection:'day_team_split',
          currentPage: _this.selldatacurrentPage,
          numsPerPage: _this.numsPerPage,
          query:_this.dayquery,
          sort:_this.sort,
        }
      })
      .then(res => {
        console.log(res.data.items.length);
        if(res.data.items.length == 0){

        }else{
          _this.joinLeaderCount = res.data.items[0].joinLeaderCount;
          _this.joinMemberCount = res.data.items[0].joinMemberCount;
        }
        
      })
    },
    // 今日店主销售排行
    sp_getData() {
      var _this = this;
      this.getdate();
      return _this.$http
        .get(api.getMongoFindResult, {
            params: {
                collection:'store_rank',
                currentPage: _this.todaycurrentPage,
                numsPerPage: _this.numsPerPage,
                query:_this.dayquery,
                sort:'{orderCount:-1}',
            }
        })
        .then(res => {
            _this.dataTotal = res.data.count;
            let result = transform.getDataTable({
                items: res.data.items,
                pageSize: res.data.numsPerPage,
                pageNo: res.data.count
            });
            if(res.data.count < 5){
              for(var i=0 ; i<res.data.count ; i++){
                res.data.items[i].num = i+1;
              }
            }else{
              for(var i=0 ; i<5 ; i++){
                res.data.items[i].num = i+1;
              }
            }
            _this.sp_cartlistData = result.result;
            return result;
        });
    },
    // 累计店主销售排行
    sp_allData() {
      var _this = this;
      this.getdate();
      return _this.$http           
      .get(api.getMongoFindResult, {
          params: {
              collection:'store_rank',
              currentPage: _this.allcurrentPage,
              numsPerPage: _this.numsPerPage,
              query:_this.query,
              sort:'{orderCount:-1}',
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
          if(res.data.count < 7){
              for(var i=0 ; i<res.data.count ; i++){
                res.data.items[i].num = i+1;
              }
            }else{
              for(var i=0 ; i<7 ; i++){
                res.data.items[i].num = i+1;
              }
            }
          _this.sp_allcartlistData = result.result;
          return result;
      });
    },
    //今日热销商品
    go_getData() {
      var _this = this;
      this.getdate();
      return _this.$http
        .get(api.getMongoFindResult, {
            params: {
                collection:'product_rank',
                currentPage: _this.todaycurrentPage,
                numsPerPage: _this.numsPerPage,
                query:_this.dayquery,
                sort:'{productCount:-1}',
            }
        })
        .then(res => {
            _this.dataTotal = res.data.count;
            let result = transform.getDataTable({
                items: res.data.items,
                pageSize: res.data.numsPerPage,
                pageNo: res.data.count
            });
            if(res.data.count < 7){
              for(var i=0 ; i<res.data.count ; i++){
                res.data.items[i].num = i+1;
              }
            }else{
              for(var i=0 ; i<7 ; i++){
                res.data.items[i].num = i+1;
              }
            }
            _this.go_cartlistData = result.result;
            return result;
        });
    },
    //累计热销商品
    go_allData() {
      var _this = this;
      this.getdate();
      return _this.$http           
      .get(api.getMongoFindResult, {
          params: {
              collection:'product_rank',
              currentPage: _this.allcurrentPage,
              numsPerPage: _this.numsPerPage,
              query:_this.query,
              sort:'{productCount:-1}',
          }
      })
      .then(res => {
          _this.alldataTotal = res.data.count;
          let result = transform.getDataTable({
              items: res.data.items,
              pageSize: res.data.numsPerPage,
              pageNo: res.data.count
          });
          if(res.data.count < 5){
              for(var i=0 ; i<res.data.count ; i++){
                res.data.items[i].num = i+1;
              }
            }else{
              for(var i=0 ; i<5 ; i++){
                res.data.items[i].num = i+1;
            }
          }
          return result;
      });
    },
    //获取30天范围的订单数据
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
    }

  },
  mounted() {
    this.getselldata();
    this.getuserdata();
    this.getteamdata();
  }
};
</script>

<style src="./index.less" lang="less" scoped></style>

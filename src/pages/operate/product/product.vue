<template>
  <v-content class="operate-product-wrap">
    
    <v-row type="flex">
      <v-col span="24">
        <h1>今日数据曲线</h1>
      </v-col>
    </v-row>

    <v-row type="flex">
      <v-col span="24">
        <g2-line :charData="servenData" id='c2'></g2-line>
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
        <g2-line :charData="thirtyData" id='c3'></g2-line>
      </v-col>
    </v-row>
  </v-content>
</template>

<script>
import api from "./api.js";
import transform from "@/util/transform.js";
import moment from 'moment'; 
import momenttimezone from 'moment-timezone';
import G2Line from "@/components/cg2line/cg2line";
export default {
  name: "operate-product",
  data() {
    return {
      dataTotal:0,//页总数
      currentPage:1,
      numsPerPage:10,
      addVisible: false,
      editVisible: false,
      detailVisible: false,
      spuId: "",
      spStatus: "",
      servenData: [],
      fourteenData: [],
      thirtyData:[],
      servenSaleData: [],
      fourteenSaleData: [],
      thirtySaleData:[],
      rangeTime:['',''],
      gridHeight: "500px",
      gridWidth: "800px",
      cartlistData: [],
      selectSpecial: "", //选中的专场ID
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "0",
          label: "待发布"
        },
        {
          value: "1",
          label: "预售"
        },
        {
          value: "2",
          label: "在售"
        },
        {
          value: "3",
          label: "过期"
        },
        {
          value: "4",
          label: "下线"
        }
      ],
      columns: []
    };
  },
  created() {
    this.gridHeight = document.body.clientHeight - 280 + "px";
    this.gridWidth = document.body.clientWidth - 230 + "px";
    this.columns = [
      { title: "专场ID", field: "spId",width:"5" },
      { title: "专场名称", field: "spTitleCn",width:"5" },
      { title: "商品SKU数量", field: "spGoodsNum",width:"5" },
      { title: "专场状态", field: "spStatus",width:"5" },
      { title: "开始时间", field: "spStartTime" ,width:"20"},
      { title: "结束时间", field: "spEndTime",width:"20"},
      { title: "操作", field: "album",width:"45" }
    ];
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
    pageChange(page) {
      let _this = this;
      _this.currentPage = page;
      _this.onFetchSearch();
    },
    getData() {
      let _this = this;
      return _this.$http
        .get(api.get_special, {
          params: {
            type: 0,
            currentPage: _this.currentPage,
            numsPerPage: _this.numsPerPage
          }
        })
        .then(res => {
          //console.log(res);
          _this.dataTotal = res.data.count
          let ary = res.data.items;
          _this.dataTotal = res.data.count;
          // _this.specialFSForm.spSubTitleCn = res.data.special.spSubTitleCn;
          // for (let i = 0; i < ary.length; i++) {
          //   ary[i]["spStartTime"] = moment(ary[i].spStartTime)
          //     .utcOffset(-8)
          //     .format("YYYY-MM-DD HH:mm:ss");
          //   ary[i]["spEndTime"] = moment(ary[i].spEndTime)
          //     .utcOffset(-8)
          //     .format("YYYY-MM-DD HH:mm:ss");
          // }
          let result = transform.getDataTable({
            items: res.data.items
            //totalCount: res.data.count
          });
          return result;
        });
    },

    showModel() {
      this.addVisible = true;
    },
    //点击编辑
    showEditmodel(item) {
      this.selectSpecial = item.spId + "";
      this.editVisible = true;
    },
    //点击详情
    showDetailmodel(item) {
      this.selectSpecial = item.spId + "";
      this.detailVisible = true;
    },
    bulState(data) {
      this.addVisible = data.add;
      this.editVisible = data.edit;
      this.detailVisible = data.detail;
      if (data.isconform) {
        //刷新列表数据
        this.$refs.singleList.reload();
      }
    },
    online(item) {
      let _this = this;
      _this.$modal.confirm({
        title: "您确认要上线该专场？",
        content: "",
        onOk: function() {
          _this.$http
            .post(api.online_special, { spId: item.spId })
            .then(res => {
              if (res.code === 0) {
                _this.$message.success("上线成功!", 0.5);
                _this.$refs.singleList.reload();
              } else {
             if (res.otherSp || res.errorGoods) {
                  let content1 = "";
                  let content2 = "";
                    if (res.otherSp && res.otherSp.length > 0) {
                      let errorlist = [];
                      for (let i in res.otherSp) {
                        errorlist.push(res.otherSp[i].spgSkuId);
                      }
                      content1 =  "存在" +
                      errorlist.join(",") +
                      "商品存在上线或者预售专场中!!!";
                    }

                     if (res.errorGoods && res.errorGoods.length > 0) {
                      let errorlist = [];
                      for (let i in res.errorGoods) {
                        errorlist.push(res.errorGoods[i].spgSkuId);
                      }
                      content2 =  "存在" +
                      errorlist.join(",") +
                      "商品可售库存为0";
                    }

                    let content =content1 + ' | ' + content2;
                    _this.$message.error(content, 10);
                } else {
                  _this.$message.error(res.msg, 10);
                }
              }
            });
        },
        onCancel: function() {}
      });
    },
    offline(item) {
      let _this = this;
      _this.$modal.confirm({
        title: "您确认要下线该专场？",
        content: "",
        onOk: function() {
          _this.$http
            .post(api.offline_special, { spId: item.spId })
            .then(res => {
              if (res.code === 0) {
                _this.$message.success("下线成功!", 0.5);
                _this.$refs.singleList.reload();
              }
            });
        },
        onCancel: function() {}
      });
    },
    deleteproduct(item) {
      let _this = this;
      _this.$modal.confirm({
        title: "您确认要删除该专场？",
        content: "",
        onOk: function() {
          _this.$http.post(api.del_special, { spId: item.spId }).then(res => {
            if (res.code === 0) {
              _this.$message.success("删除成功!", 0.5);
              _this.$refs.singleList.reload();
            }
          });
        },
        onCancel: function() {}
      });
    },
    onFetchSearch() {
      var _this = this;
      return _this.$http
        .get(api.get_special, {
          params: {
            type: 0,
            currentPage: _this.currentPage,
            numsPerPage: _this.numsPerPage,
            ids: _this.spuId,
            status: _this.spStatus,
            startTime: _this.rangeTime[0],
            endTime: _this.rangeTime[1],
            // currentPage:_this.currentPage,
            // numsPerPage:_this.numsPerPage,
          }
        })
        .then(res => {
          _this.dataTotal = res.data.count;
          let ary = res.data.items;
          _this.dataTotal = res.data.count;
          for (let i = 0; i < ary.length; i++) {
            ary[i]["spStartTime"] = moment(ary[i].spStartTime).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            ary[i]["spEndTime"] = moment(ary[i].spEndTime).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          }
          let result = transform.getDataTable({
            items: res.data.items
          });
          _this.cartlistData = result.result;
          return result;
        });
    },
    onSearch() {
        this.pageChange(1);
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
    }
  },

  components: {
    G2Line: G2Line,
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./product.less" lang="less"></style>

<template>
  <v-content class="user-logistics-wrap">
      <v-form class="search-form" :model="ruleForm" ref="ruleForm">
          <v-row class="demo-row">
              <v-col span="24">
                  <v-form-item label="运单号" prop="trackIds">
                        <v-input style="width: 150px;" v-model="ruleForm.trackIds"  placeholder="请输入，以‘，’分隔"></v-input>
                    </v-form-item>
                    <v-form-item label="订单ID" prop="orderId">
                        <v-input style="width: 150px;" v-model="ruleForm.orderId" placeholder="请输入"></v-input>
                    </v-form-item>
                    <v-form-item label="子订单号" prop="orderCode">
                        <v-input style="width: 150px;" v-model="ruleForm.orderCode" placeholder="请输入"></v-input>
                    </v-form-item>
                    <v-form-item label="承运商" prop="logisticsType">
                        <v-input style="width: 150px;" v-model="ruleForm.logisticsType"  placeholder="请输入"></v-input>
                    </v-form-item>
                    <v-form-item label="发货状态" prop="isDeliver">
                        <v-select
                        v-model="ruleForm.isDeliver"
                        style="width: 120px;"
                        :data="statusOptions" 
                        ></v-select>
                    </v-form-item>
                     <v-form-item>
                        <v-button type="primary" html-type="button" @click="onSearch">查询</v-button>
                        <v-button type="ghost" @click.prevent="resetForm('ruleForm')">清空条件</v-button>
                    </v-form-item>
              </v-col>

          </v-row>
      </v-form>
      <div class="data-gird" :style="`height:${gridHeight};text-align:left`">
          <v-data-table :data="getData" :columns="columns" :currentData="listData" ref="ruleData">
                <template slot="td" slot-scope="props">
                    <div v-if="props.column.field=='isDeliver'">
                        <div v-if="props.content==0">未送达</div>
                        <div v-if="props.content==1">已送达</div>
                    </div>
                    <div v-else-if="props.column.field =='operation'">
                        <div  v-if="props.item.isDeliver==0">
                            <v-button
                            type="primary"
                            size="small"
                            @click="onSend(props.item)"
                            >送达</v-button>
                        </div>
                         <div v-else-if="props.item.isDeliver==1">
                              <v-button
                            type="primary"
                            size="small"
                            disabled
                            >送达</v-button>
                         </div>
                    </div>
                    <span v-else v-html="props.content"></span>
                </template>
          </v-data-table>
          <v-pagination
            style="text-align:right;margin-top:10px"
            show-quick-jumper
            :total="dataTotal"
            @change="pageChange"
            :value="currentPage"
            :show-total="showTotal"
        ></v-pagination>
      </div>
</v-content>
</template>

<script>
import api from "./api.js";
import transform from "@/util/transform.js";
export default {
  data() {
    return {
        ruleForm:{
            trackIds:'',//运单号
            orderId:'',      //订单ID
            orderCode:'',    //子订单号
            logisticsType:'',      //承运商
            isDeliver:'' ,    //发货状态
        },
        currentPage: 1, //当前页
        numsPerPage:10,
        dataTotal: 0,
        columns:[],
        listData:[],//更新数组
         gridHeight: "500px",
        statusOptions:[
            {
                value: '0',
                label: "未送达"
            },
            {
                value: '1',
                label: "已送达"
            }
        ],
    };
  },
  created() {
      this.columns = [
          { title: "创建时间", field: "createTime" },
          { title: "运单号", field: "orderTrackId" },
          { title: "订单ID", field: "orderId" },
          { title: "子订单号", field: "orderCode" },    
          { title: "承运商", field: "logisticsType" },
          { title: "发货状态", field: "isDeliver" },
          { title: "操作", field: "operation" },
      ]
  },
  mounted() {},
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getData() {
       // this.currentPage = i.pageNo;
        var _this = this;
        return _this.$http
        .get(api.query_logistics_orders, {
          params: {
            currentPage: 1, //当前页
            numsPerPage: _this.numsPerPage
          }
        })
        .then(res => {
            //console.log(res.data)
            _this.dataTotal = res.data.count;
            let result = transform.getDataTable({
            items:res.data.items
          });
          return result;
        })
    },
    onFetchSearch() {
        var _this = this;
        let orderCode = _this.ruleForm.orderCode;
        let trackIds = _this.ruleForm.trackIds;
        let orderId = _this.ruleForm.orderId;
        let logisticsType = _this.ruleForm.logisticsType;
        let isDeliver = _this.ruleForm.isDeliver;

        let currentPage = _this.currentPage;
        let numsPerPage = _this.numsPerPage;
        let option = {
            orderCode,
            trackIds,
            orderId,
            logisticsType,
            isDeliver, 
            currentPage,
            numsPerPage,
        };
        return _this.$http
        .get(api.query_logistics_orders,{
            params:option
        })
        .then(res => {
            _this.dataTotal = res.data.count;
            let result = transform.getDataTable({
                items: res.data.items
            });
           _this.listData = result.result;
        })

    },
    showTotal() {
      return `总共` + this.dataTotal + `条数据`;
    },
    onSearch() {
      this.pageChange(1);
    },
    pageChange(page) {
      this.currentPage = page;
      this.onFetchSearch();
    },
    onSend(item) {
        var _this = this;
        console.log('item',item.id,item.orderId)
        this.$modal.confirm({
            title: '您是否确认要发送'+item.orderId +'这条订单',
            content: '',
            onOk: function () {
                _this.$http.get(api.deliver_logistics,
                {
                    params:{
                        id:item.id,
                        orderId:item.orderId
                    } 
                }
                ).then(res => {
                    if (res.code == 0) {
                        _this.$message.success("设置成功!", 0.5);
                        _this.$refs.ruleData.reload();
                    } else {
                        _this.$message.error("设置失败!", 0.5);
                    }
                })
            },
            onCancel: function () {}
        })
    }
  },
  components: {

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./logistics.less" lang="less"></style>

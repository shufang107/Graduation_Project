<template>
  <v-content class="user-orders-wrap">
    <v-form class="search-form" :model="ruleForm" ref="ruleForm">
      <v-row class="demo-row">
        <v-col span="24">
          <v-form-item label="子订单号" prop="orderCode">
            <v-input style="width: 150px;" v-model="ruleForm.orderCode" placeholder="请输入，以‘，’分隔"></v-input>
          </v-form-item>
          <v-form-item label="父订单号" prop="parentOrderCode">
            <v-input
              style="width: 150px;"
              v-model="ruleForm.parentOrderCode"
              placeholder="请输入，以‘，’分隔"
            ></v-input>
          </v-form-item>
          <v-form-item label="订单类型" prop="orderType">
            <v-select
              v-model="ruleForm.orderType"
              style="width: 120px;"
              multiple
              :data="options"
              value="['1']"
            ></v-select>
          </v-form-item>
           <v-form-item label="店铺ID" prop="storeId">
            <v-input style="width: 100px;" v-model="ruleForm.storeId" placeholder="请输入"></v-input>
          </v-form-item>
          <v-form-item label="店主昵称" prop="storerNickName">
            <v-input style="width: 100px;" v-model="ruleForm.storeNickname" placeholder="请输入"></v-input>
          </v-form-item>
          <v-form-item label="用户ID" prop="userId">
            <v-input style="width: 100px;" v-model="ruleForm.userId" placeholder="请输入"></v-input>
          </v-form-item>
          <v-form-item label="购买用户昵称" prop="nickName">
            <v-input style="width: 100px;" v-model="ruleForm.nickName" placeholder="请输入"></v-input>
          </v-form-item>
          <!-- <v-form-item label="SKU" prop="skuErp">
            <v-input style="width: 100px;" v-model="ruleForm.skuErp" placeholder="请输入"></v-input>
          </v-form-item> -->
          <v-form-item label="支付方式" prop="payType">
            <v-select
              v-model="ruleForm.payType"
              style="width: 120px;"
              :data="payTypeOptions"
            ></v-select>
          </v-form-item>
          <v-form-item label="订单状态" prop="orderStatus">
            <v-select
              v-model="ruleForm.orderStatus"
              style="width: 120px;"
              :data="statusOptions"
              multiple
              value="['1']"
            ></v-select>
          </v-form-item>
          <v-form-item label="是否导单成功" prop="autoOrderStatus">
            <v-select v-model="ruleForm.autoOrderStatus" style="width: 120px;" :data="autoOptions"></v-select>
          </v-form-item>
          <v-form-item label="开始时间" prop="startTime">
            <v-date-picker clearable show-time v-model="ruleForm.startTime"></v-date-picker>
          </v-form-item>
          <v-form-item label="结束时间" prop="endTime">
            <v-date-picker clearable show-time v-model="ruleForm.endTime"></v-date-picker>
          </v-form-item>
          <v-form-item>
            <v-button type="primary" html-type="button" @click="onSearch">查询</v-button>
            <v-button type="ghost" @click.prevent="resetForm('ruleForm')">清空条件</v-button>
          </v-form-item>
        </v-col>
      </v-row>
    </v-form>
    <div class="data-gird" :style="`height:${gridHeight};width:${gridWidth};text-align:left`">
      <v-data-table :data="getData" :columns="columns" :currentData="listData">
        <template slot="td" slot-scope="props">
          <!-- 1:普通订单;2:团购订单,3:店铺申请订单，4:店铺礼品订单 -->
          <div v-if="props.column.field=='orderType'">
            <div v-if="props.content==1">普通订单</div>
            <div v-if="props.content==2">团购订单</div>
            <div v-if="props.content==3">店铺申请订单</div>
            <div v-if="props.content==4">店铺礼品订单</div>
            <!-- <span v-else v-html="props.content"></span> -->
          </div>
          <div v-else-if="props.column.field=='orderTotal'">{{props.item.unit}}{{props.content}}</div>
          <div v-else-if="props.column.field=='payType'">
              <span v-if="props.content == null">未支付</span>
              <span v-if="props.content == 0">微信支付</span>
              <span v-if="props.content == 1">paypal支付</span>
              <span v-if="props.content == 2">worldpay支付</span>
              <span v-if="props.content == 3">stripe</span> 
              <span v-if="props.content == 4">HantePay</span>
          </div>
          <div v-else-if="props.column.field=='orderStatus'">
            <!-- 0: unPaid,未支付；1: Paid,已支付；2: Processing,已配货；3: Shipped,已发货；4: Refunding,退款中；5: Refunded 已退款；6：待支付确认；7:已完成；8已失效） -->
            <div v-if="props.content=='0'">未支付</div>
            <div v-if="props.content=='1'">已支付</div>
            <div v-if="props.content=='2'">已配货</div>
            <div v-if="props.content=='3'">已发货</div>
            <div v-if="props.content=='4'">退款中</div>
            <div v-if="props.content=='5'">已退款</div>
            <!-- <div v-if="props.content=='6'">待支付确认</div> -->
            <div v-if="props.content=='7'">已完成</div>
            <div v-if="props.content=='8'">已失效</div>
          </div>
          <div v-else-if="props.column.field=='operation'">
            <v-button
              v-if="props.item.orderType==1"
              type="primary"
              size="small"
              @click="showNormaldetail(props.item)"
            >详情</v-button>
            <v-button v-if="props.item.orderType==2" type="primary" size="small" disabled>详情</v-button>
            <v-button v-if="props.item.orderType==3" type="primary" size="small" disabled>详情</v-button>
            <v-button
              v-if="props.item.orderType==4"
              type="primary"
              size="small"
              @click="showGiftdetail(props.item)"
            >详情</v-button>
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
    <gift-order :detailVisible="detailVisible" :orderId="orderId" @changeBul="bulState"></gift-order>
    <normal-order :narmalVisible="narmalVisible" :orderId="orderId" @changeBul="bulState"></normal-order>
  </v-content>
</template>

<script>
import api from "./api.js";
import transform from "@/util/transform.js";
import giftOrder from "./giftorder/giftorder";
import normalOrder from "./normalorder/normalorder";
export default {
  name: "user-orders",
  data() {
    return {
      orderId: "",
      currentPage: 1, //当前页
      numsPerPage: 10, //限制条数
      dataTotal: 0, //总数据条数
      ruleForm: {
        orderCode: "",
        parentOrderCode: "",
        userId: "",
        orderType: "",
        orderStatus: "",
        autoOrderStatus: "",
        startTime: "",
        endTime: "",
        storeId:"",//店铺id
        storeNickname:'',//店铺昵称
        nickName:'',//购买用户昵称
        skuErp:'',//sku
        payType:'',//支付方式
      },
      gridHeight: "500px",
      gridWidth:"800px",
      columns: [],
      detailVisible: false,
      narmalVisible: false,
      listData: [],
      options: [
        {
          value: "1",
          label: "普通订单"
        },
        // {
        //     value:"2",
        //     label:'团购订单',
        //     disabled: true
        // },
        {
          value: "3",
          label: "店铺申请订单"
        },
        {
          value: "4",
          label: "店铺礼品订单"
        }
      ],
      statusOptions: [
        {
          value: "0",
          label: "未支付"
        },
        {
          value: "1",
          label: "已支付"
        },
        {
          value: "2",
          label: "已配货"
        },
        {
          value: "3",
          label: "已发货"
        },
        {
          value: "4",
          label: "退款中"
        },
        {
          value: "5",
          label: "已退款"
        },
        // {
        //   value: "6",
        //   label: "待支付确认"
        // },
        {
          value: "7",
          label: "已完成"
        },
        {
          value: "8",
          label: "已失效"
        }
      ],
      payTypeOptions: [
          {
            value: "",
            label: "全部"
          },
          // {
          //   value: 'null',
          //   label: "未支付"
          // },
          {
            value: "0",
            label: "微信支付"
          },
          {
            value: "1",
            label: "paypal支付"
          },
          {
            value: "2",
            label: "worldpay支付"
          },
          {
            value: "3",
            label: "stripe"
          },
          {
            value: "4",
            label: "Hantepay"
          },
      ],
      autoOptions: [
        {
          value: "0",
          label: "未导单"
        },
        {
          value: "1",
          label: "导单成功"
        },
        {
          value: "2",
          label: "导单异常"
        }
      ]
    };
  },
  created() {
    this.columns = [
      { title: "下单时间", field: "createTime" },
      { title: "订单ID", field: "id" },
      { title: "子订单号", field: "orderCode" },
      { title: "父订单号", field: "parentOrderCode" },
      { title: "订单金额", field: "orderTotal" },
      { title: "订单类型", field: "orderType" },
      { title: "店铺ID", field: "storeId" },
      { title: "店主昵称", field: "storerNickName" },
      { title: "用户ID", field: "userId" },
      { title: "购买用户昵称", field: "nickName" },      
      // { title: "SKU", field: "skuErp" },
      { title: "支付方式", field: "payType" },
      { title: "订单状态", field: "orderStatus" },
      { title: "操作", field: "operation" }
    ];
    this.gridWidth = document.body.clientWidth - 230 + "px";
  },
  mounted() {},
  methods: {
    showTotal() {
      return `总共` + this.dataTotal + `条数据`;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getData(i) {
      //console.log("i", i);
      this.currentPage = i.pageNo;
      var _this = this;
      return _this.$http
        .get(api.get_orders, {
          params: {
            currentPage: i.pageNo, //当前页
            numsPerPage: _this.numsPerPage
          }
        })
        .then(res => {
          // console.log(res.data)
          let ary = res.data;
          console.log("ary", ary);
          _this.dataTotal = ary.count;
          let result = transform.getDataTable({
            items: ary.items
            // totalCount : ary.count,
            // pageNo : ary.totalPages
          });
          return result;
          //console.log(result)
        });
    },
    onFetchSearch() {
      //console.log('i',i)
      var _this = this;
      let orderCode = _this.ruleForm.orderCode;
      let parentOrderCode = _this.ruleForm.parentOrderCode;
      let userId = _this.ruleForm.userId;
      let orderType = _this.ruleForm.orderType;
      if (orderType && orderType.length > 0) {
        orderType = orderType.join(",");
      }
      let orderStatus = _this.ruleForm.orderStatus;
      if (orderStatus && orderStatus.length > 0) {
        orderStatus = orderStatus.join(",");
      }
      let autoOrderStatus = _this.ruleForm.autoOrderStatus;
      let startTime = _this.ruleForm.startTime;
      let endTime = _this.ruleForm.endTime;
      let currentPage = _this.currentPage;
      let numsPerPage = _this.numsPerPage;
      let storeId =_this.ruleForm.storeId;
      let storeNickname =_this.ruleForm.storeNickname;//店铺昵称
      let nickName = _this.ruleForm.nickName;//购买用户昵称
      let skuErp = _this.ruleForm.skuErp;//sku
      let payType = _this.ruleForm.payType;
      let option = {
        orderCode,
        parentOrderCode,
        userId,
        orderType,
        orderStatus,
        autoOrderStatus,
        currentPage,
        numsPerPage,
        startTime,
        endTime,
        storeId,
        storeNickname,//店铺昵称
        nickName,//购买用户昵称
        skuErp,//sku
        payType,//支付方式
      };
      return _this.$http
        .get(api.get_orders, {
          params: option
        })
        .then(res => {
          console.log("res.data.items", res.data.items);
          _this.dataTotal = res.data.count;
          let result = transform.getDataTable({
            items: res.data.items
            // totalCount : res.data.count,
            // pageNo : res.data.totalPages
          });
          _this.listData = result.result;
        });
    },
    showGiftdetail(item) {
      // console.log(item.id)
      this.orderId = item.id;
      this.detailVisible = true;
    },
    showNormaldetail(item) {
      //console.log(item.id)
      this.orderId = item.id;
      this.narmalVisible = true;
    },
    bulState(data) {
      this.detailVisible = data;
      this.narmalVisible = data;
    },
    onSearch() {
      this.pageChange(1);
    },
    pageChange(page) {
      this.currentPage = page;
      this.onFetchSearch();
    }
  },
  components: {
    giftOrder,
    normalOrder
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./orders.less" lang="less"></style>

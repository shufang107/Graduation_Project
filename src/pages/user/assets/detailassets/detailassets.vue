<template>
  <v-modal
    class="modal-whole"
    :width="1000"
    title="收支明细"
    :visible="detailVisible"
    @ok="handleOK"
    @cancel="handleCancel"
    style="position:relative"
  >
    <v-content>
      <v-row>
        <v-col span="4">用户昵称：{{userInfo.userName}}</v-col>
        <v-col span="4">店主ID：{{userInfo.userId}}</v-col>
        <v-col span="4">累计收益：{{userInfo.earning}}</v-col>
        <v-col span="4">累计支出：{{userInfo.expend}}</v-col>
        <v-col span="4">账户余额：{{userInfo.balance}}</v-col>
        <v-col span="4">获取佣金笔数：{{userInfo.commissionTotal}}</v-col>
      </v-row>
      <v-row>
        <v-form class="search-form" :model="ruleForm" ref="ruleForm">
          <v-form-item label="创建时间" prop="createTimeStart">
            <v-date-picker
              placeholder="选择开始时间"
              clearable
              show-time
              v-model="ruleForm.createTimeStart"
            ></v-date-picker>
          </v-form-item>
          <v-form-item label="到" prop="createTimeEnd">
            <v-date-picker
              placeholder="选择结束时间"
              clearable
              show-time
              v-model="ruleForm.createTimeEnd"
            ></v-date-picker>
          </v-form-item>
          <v-form-item label="对应用户" prop="userName">
            <v-input placeholder="请输入" style="width:120px;" v-model="ruleForm.userName"></v-input>
          </v-form-item>
          <v-form-item label="业务编号" prop="settlementId">
            <v-input placeholder="请输入" style="width:120px;" v-model="ruleForm.settlementId"></v-input>
          </v-form-item>
          <v-form-item label="收支类型" prop="payment">
            <v-select
              placeholder="请选择账单类型"
              v-model="ruleForm.payment"
              style="width:100px"
              :data="options"
            ></v-select>
          </v-form-item>
          <v-form-item>
            <v-button type="primary" html-type="button" @click="onSearch">查询</v-button>
            <v-button type="ghost" @click.prevent="resetForm('ruleForm')">清空条件</v-button>
          </v-form-item>
        </v-form>
      </v-row>
      <div class="data-gird" :style="`height:${gridHeight};text-align:left`">
        <v-data-table :columns="columns" :data="getData" :currentData="cartlistData">
          <template slot="td" slot-scope="props">
            <div v-if="props.column.field=='operate'"></div>
            <div v-else-if="props.column.field=='payment'">
              <div v-if="props.content=='1'">收入</div>
              <div v-if="props.content=='2'">支出</div>
            </div>
            <div v-else-if="props.column.field=='source'">
              <div v-if="props.content=='1'">销售佣金奖励</div>
              <div v-if="props.content=='2'">佣金额外收益</div>
              <div v-if="props.content=='3'">活动奖励</div>
              <div v-if="props.content=='4'">赠送佣金</div>
              <div v-if="props.content=='5'">订单失效</div>
              <div v-if="props.content=='6'">购物支出</div>
              <div v-if="props.content=='7'">自购返佣</div>
              <div v-if="props.content=='8'">订单退款扣除</div>
              <div v-if="props.content=='9'">提现支出</div>
              <div v-if="props.content=='10'">好友销售奖励</div>
              <div v-if="props.content=='11'">好友销售奖励扣除</div>
              <div v-if="props.content=='12'">好友邀请奖励</div>
              <div v-if="props.content=='13'">好友邀请奖励失效</div>
              <div v-if="props.content=='14'">好友开单奖励</div>
              <div v-if="props.content=='15'">好友开单奖励失效</div>
              <div v-if="props.content=='16'">活动奖励扣除</div>
              <div v-if="props.content=='17'">订单退款退回</div>
              <div v-if="props.content=='18'">提现失败退回</div>
            </div>
            <div v-else-if="props.column.field=='commission'">
              <div v-if="props.item.payment=='1'" style="color:green">{{props.content}}</div>
              <div v-if="props.item.payment=='2'" style="color:red">{{props.content}}</div>
            </div>
            <span v-else v-html="props.content"></span>
          </template>
        </v-data-table>
      </div>
      <template>
        <v-pagination
          style="text-align:right;"
          show-quick-jumper
          :total="dataTotal"
          @change="pageChange"
          :value="currentPage"
        ></v-pagination>
      </template>
    </v-content>
  </v-modal>
</template>

<script>
import api from "./../api.js";
import transform from "@/util/transform.js";
export default {
  props: ["detailVisible", "detailItem"],
  data() {
    return {
      showable: true,
      dataTotal: 0, //页总数
      currentPage: 1,
      numsPerPage: 10,
      cartlistData: [],
      ruleForm: {
        userName: "",
        settlementId: "",
        payment: "",
        createTimeStart: "",
        createTimeEnd: ""
      },
      userInfo: {
        account: "",
        userName: "",
        userId: "",
        storeId: "",
        balance: "",
        earning: "",
        commissionTotal: "",
        expend: "",
        settlement: ""
      },
      columns: [],
      gridHeight: "400px",
      options: [
        {
          value: '',
          label: "全部"
        },
        {
          value: '1',
          label: "收入"
        },
        {
          value: '2',
          label: "支出"
        }
      ]
    };
  },
  created() {
    this.showable = this.detailVisible;
    this.columns = [
      { title: "创建时间", field: "createTime" },
      { title: "业务编号", field: "orderCode" },
      { title: "结算编号", field: "saleSettlementId" },
      { title: "订单金额", field: "price" },
      { title: "对应用户", field: "customerName" },
      { title: "收支金额", field: "commission" },
      { title: "收支类型", field: "payment" },
      { title: "账单类型", field: "source" },
      { title: "备注", field: "remarks" }
    ];
  },
  watch: {
    detailVisible: function(val, oldVal) {
      if (val) {
        //获取用户详情数据信息
        let _this = this;
        _this.$http
          .get(api.user_detail_head, {
            params: {
              userId: _this.detailItem.userId,
              storeId: _this.detailItem.storeId
            }
          })
          .then(res => {
            //console.log(res.code);
            if (parseInt(res.code) == 0) {
              _this.userInfo.account = res.data[0].account;
              _this.userInfo.userName = res.data[0].userName;
              _this.userInfo.userId = res.data[0].userId;
              _this.userInfo.storeId = res.data[0].storeId;
              _this.userInfo.balance = res.data[0].balance;
              _this.userInfo.earning = res.data[0].earning;
              _this.userInfo.commissionTotal = res.data[0].commissionTotal;
              _this.userInfo.expend = res.data[0].expend;
              _this.userInfo.settlement = res.data[0].settlement;
            }
          });

        //获取用户列表
        _this.onSearch();
      }
    }
  },
  mounted() {},
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getData() {
      let result = {
        result: []
      };
      return new Promise((resolve, reject) => {
        resolve(result);
      });
    },
    handleOK() {
      this.showable = false;
      this.ruleForm ={
          userName: "",
          settlementId: "",
          payment: "",
          createTimeStart: "",
          createTimeEnd: ""
        };
      this.$emit("changeBul", false);
    },
    handleCancel() {
      this.showable = false;
      this.ruleForm ={
          userName: "",
          settlementId: "",
          payment: "",
          createTimeStart: "",
          createTimeEnd: ""
        };
      this.$emit("changeBul", false);
    },
    pageChange(page) {
      let _this = this;
      _this.currentPage = page;
      _this.onFetchSearch();
    },
    onFetchSearch() {
      var _this = this;
      return _this.$http
        .get(api.user_detail, {
          params: {
            currentPage: _this.currentPage,
            numsPerPage: _this.numsPerPage,
            userId: _this.detailItem.userId,
            storeId: _this.detailItem.storeId,
            userName: _this.ruleForm.userName,
            settlementId: _this.ruleForm.settlementId,
            payment: _this.ruleForm.payment,
            createTimeStart: _this.ruleForm.createTimeStart,
            createTimeEnd: _this.ruleForm.createTimeEnd
          }
        })
        .then(res => {
          _this.dataTotal = res.data.count;
          let ary = res.data.items;
          _this.dataTotal = res.data.count;
          let result = transform.getDataTable({
            items: res.data.items
          });
          _this.cartlistData = result.result;
          return result;
        });
    },
    onSearch() {
      this.pageChange(1);
    }
  },
  components: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./detailassets.less" lang="less"></style>

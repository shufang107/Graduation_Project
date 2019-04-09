<template>
  <v-content class="operate-teamdetail-wrap">
    <v-modal
      :width="1120"
      title="团队详情"
      :visible="detailVisible"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div class="detail-content">
        <!-- <v-row>
          <v-col>
            <v-form class="search-form">
              <v-form-item label="加入时间" prop="startTime">
                <v-date-picker style="width: 100px;" placeholder clearable show-time></v-date-picker>
              </v-form-item>
              <v-form-item label="到" prop="endTime">
                <v-date-picker style="width: 100px;" placeholder="到" clearable show-time></v-date-picker>
              </v-form-item>
              <v-form-item label="用户昵称" prop="nickname">
                <v-date-picker style="width: 100px;" placeholder="到" clearable show-time></v-date-picker>
              </v-form-item>
              <v-form-item label="用户身份" prop="useridentity">
                <v-select style="width: 120px;" :data="options"></v-select>
              </v-form-item>
              <v-form-item>
                <v-button type="primary" html-type="button">查询</v-button>
                <v-button type="ghost" @click.prevent="resetForm('ruleForm')">清空条件</v-button>
              </v-form-item>
            </v-form>
          </v-col>
        </v-row>-->
        <v-row>
          <v-col span="18">
            <div
              class="data-gird"
              :style="`width:${gridWidth};height:${gridHeight};text-align:left;margin-top:20px`"
            >
              <v-data-table :columns="columns" :data="getData" :currentData="cartlistData">
                <template slot="td" slot-scope="props">
                  <div v-if="props.column.field=='headImgUrl'">
                    <img :src="props.content" style="width:50px">
                  </div>
                  <div v-else-if="props.column.field=='isLeader'">
                    <div v-if="props.content==true" style="color:green">已开团</div>
                    <div v-if="props.content==false" style="color:red">未开团</div>
                  </div>
                  <div v-else-if="props.column.field=='teamMemberStatus'">
                    <div v-if="props.content==1" style="color:green">有效</div>
                    <div v-if="props.content==0" style="color:red">失效</div>
                  </div>
                  <span v-else v-html="props.content"></span>
                </template>
              </v-data-table>
            </div>
          </v-col>
          <v-col span="6">
            <div class="leftList">
              <div class="listConten">
                <v-row>
                  <img style="width:50px" :src="`${leader.headImgUrl}`" alt>
                </v-row>
                <v-row>用户昵称: {{leader.nickName}}</v-row>
                <v-row>用户ID: {{leader.userId}}</v-row>
                <v-row>店主ID {{leader.storeId}}</v-row>
                <v-row>佣金余额 ${{leader.commission}}</v-row>
                <v-row>自购订单量 {{leader.selfOrderCount}}</v-row>
                <v-row>自购订单金额 ${{leader.selfOrderTotal}}</v-row>
                <v-row>团队人数 {{leader.memberCount}}</v-row>
                <v-row>团队订单量 {{leader.teamOrderCount}}</v-row>
                <v-row>团队销售额 ${{leader.teamSale}}</v-row>
                <v-row>团队总收益 ${{leader.teamCommission}}</v-row>
                <v-row>注册时间 {{leader.registerTime}}</v-row>
                <v-row>成为店主时间 {{leader.storeTime}}</v-row>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-modal>
  </v-content>
</template>

<script>
import api from "./../api.js";
import transform from "@/util/transform.js";

export default {
  props: ["detailVisible", "detailItem"],
  data() {
    return {
      dataTotal: 0, //页总数
      currentPage: 1,
      numsPerPage: 10,
      showable: true,
      gridHeight: "500px",
      gridWidth: "800px",
      cartlistData: [],
      leader: {
        nickName: "",
        userId: "",
        headImgUrl: "",
        storeId: "",
        commission: "",
        selfOrderCount: "",
        selfOrderTotal: "",
        memberCount: "",
        teamOrderCount: "",
        teamSale: "",
        teamCommission: "",
        registerTime: "",
        storeTime: ""
      },
      listform: {
        startTime: "",
        endTime: "",
        nickname: "",
        useridentity: ""
      },
      options: [
        {
          value: "0",
          label: "全部"
        },
        {
          value: "1",
          label: "店主"
        },
        {
          value: "2",
          label: "队长"
        }
      ]
    };
  },
  created() {
    this.showable = this.detailVisible;
    this.columns = [
      { title: "用户ID", field: "userId" },
      { title: "用户昵称", field: "nickName" },
      { title: "用户头像", field: "headImgUrl" },
      { title: "店铺ID", field: "storeId" },
      { title: "佣金余额", field: "commission" },
      { title: "自购订单量", field: "selfOrderCount" },
      { title: "自购订单金额", field: "selfOrderTotal" },
      { title: "团队销售额", field: "teamSale" },
      { title: "团队总收益", field: "teamCommission" },
      { title: "注册时间", field: "registerTime" },
      { title: "成为店主时间", field: "storeTime" },
      { title: "是否开团", field: "isLeader" },
      { title: "是否失效", field: "teamMemberStatus" }
    ];
  },
  watch: {
    detailVisible: function(val, oldVal) {
      if (val) {
        let _this = this;
        _this.$http
          .get(api.get_team_detail, {
            params: {
              teamId: _this.detailItem.teamId,
              leaderId: _this.detailItem.userId
            }
          })
          .then(res => {
            _this.leader = res.data.leader;
            _this.dataTotal = res.data.count;
            let ary = res.data.items;
            let result = transform.getDataTable({
              items: ary
            });
            console.log(result.result);
            _this.cartlistData = result.result;
          });
      }
    }
  },
  mounted() {},

  methods: {
    getData() {
      let result = {
        result: []
      };
      return new Promise((resolve, reject) => {
        resolve(result);
      });
    },
    handleOk() {
      this.showable = false;
      this.$emit("changeBul", this.showable);
    },
    handleCancel() {
      this.showable = false;
      this.$emit("changeBul", this.showable);
    },
    pageChange(page) {
      let _this = this;
      _this.currentPage = page;
      _this.onFetchSearch();
    },
    onFetchSearch() {
      var _this = this;
      return _this.$http
        .get(api.get_team_detail, {
          params: {
            //  currentPage: _this.currentPage,
            // numsPerPage: _this.numsPerPage
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
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./teamDetail.less" lang="less"></style>

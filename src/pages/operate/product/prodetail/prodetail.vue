<template>
  <div class="operate-product-prodetail-wrap">
    <v-modal
      class="modal-whole"
      :width="1200"
      title="单品推荐专场详情"
      :visible="detailVisible"
      @ok="handleClose"
      @cancel="handleClose"
    >
      <v-content>
        <v-form
          class="search-form"
          :model="specialSGForm"
          ref="specialrefSGForm"
          style="margin-bottom:10px"
        >
          <v-form-item label="专场名称">
              <v-input  placeholder="" :value="specialSGForm.spTitleCn"></v-input>
            </v-form-item>
          <v-form-item label="开始时间">
            <v-date-picker disabled show-time :value="specialSGForm.startTime"></v-date-picker>
          </v-form-item>
          <v-form-item label="结束时间">
            <v-date-picker disabled show-time :value="specialSGForm.endTime"></v-date-picker>
          </v-form-item>
        </v-form>
      </v-content>
      <div>
        <div class="data-gird" :style="`height:${gridHeight};margin-bottom:10px`">
          <v-data-table
            :data="getData"
            :columns="suColumns"
            :currentData="cartlistData"
            ref="successList"
          >
            <template slot="td" slot-scope="props">
              <div v-if="props.column.field=='sellableNum'">
                <span v-if="props.content==0">--</span>
                <span v-else>{{props.content}}</span>
              </div>
              <div v-else-if="props.column.field =='photo'">
                <img :src="props.content" style="width : 50px" alt>
              </div>
              <!--状态为4?-->
              <div v-else-if="props.column.field =='status'">
                <span v-if="props.content=='0'" style="color:green">在售</span>
                <span v-if="props.content=='1'">下线</span>
                <span v-if="props.content=='2'" style="color:red">下架</span>
              </div>
              <div v-else-if="props.column.field =='marketPrice'">
                {{props.item.unit}}{{props.content}}
              </div>
              <div v-else-if="props.column.field =='spgActivityPrice'">
                {{props.item.unit}}{{props.content}}
              </div>
              <div v-else-if="props.column.field =='spgActivityCommission'">
                {{props.item.unit}}{{props.content}}
              </div>
               <div v-else-if="props.column.field =='actRestStock'">   <!--可售库存-支付的库存-->
                {{props.item.spgSellStock - props.item.spgPayStock}}
              </div>
              <div v-else-if="props.column.field=='limitedNum'">
                <span v-if="props.content==0">--</span>
                <span v-else>{{props.content}}</span>
              </div>
              <div v-else-if="props.column.field=='availableStock'">
                <span v-if="props.content==0" style="color:red">0</span>
                <span v-else>{{props.content}}</span>
              </div>
              <span v-else v-html="props.content"></span>
            </template>
          </v-data-table>
        </div>
        <v-pagination
          style="text-align:right;"
          show-quick-jumper
          :total="dataTotal"
          @change="pageChange"
        ></v-pagination>
      </div>
    </v-modal>
  </div>
</template>
<script>
import api from "../api.js";
import transform from "@/util/transform.js";
import moment from "moment";
export default {
  props: {
    detailVisible: Boolean,
    specialId: String
  },
  data() {
    return {
      currentPage: 1,
      numsPerPage: 10,
      dataTotal: 0,
      showable: true,
      suColumns: [],
      cartlistData: [],
      gridHeight: "350px",
      specialSGForm: {
        spTitleCn:"",
        startTime: "",
        endTime: ""
      }
    };
  },
  created() {
    this.showable = this.detailVisible;
    this.suColumns = [
      { title: "SPU", field: "spu"},
      { title: "SKU", field: "spgSkuId" },
      { title: "图片", field: "photo" },
      { title: "商品中文名", field: "skuName" },
      { title: "在线状态",field: "status"},
      { title: "商品市场价", field: "marketPrice" },
      { title: "商品活动价", field: "spgActivityPrice" },
      { title: "活动佣金", field: "spgActivityCommission" },
      { title: "起购数量", field: "spgMinimum" },
      { title: "限购数量", field: "spgMaximum" },
      { title: "实际库存", field: "availableQuantity" },
      { title: "可售库存", field: "spgSellStock" },
      { title: "剩余库存", field: "spgRestStock" },
      { title: "实际剩余库存", field: "actRestStock" },
      { title: "支付锁定", field: "spgPayStock" },
      { title: "购物车锁定", field: "spgCartStock" }
    ];
  },
  watch: {
    detailVisible: function(val, oldVal) {
      let _this = this;
      if (val) {
        _this.fetchData();
      }
    }
  },
  methods: {
    handleClose() {
      this.resetPage();
      this.$emit("changeBul", this.showable);
    },
    resetPage() {
      this.cartlistData = [];
      this.dataTotal = 0;
      this.currentPage = 1;
      this.numsPerPage = 10;
      this.dataTotal = 0;
      this.specialSGForm.startTime = "";
      this.specialSGForm.endTime = "";
      this.specialSGForm.spTitleCn = "";
    },
    getData() {
      let result = {
        result: []
      };
      return new Promise((resolve, reject) => {
        resolve(result);
      });
    },
    //请求列表数据
    fetchData() {
      let _this = this;
      _this.$http
        .get(api.get_special_goods, {
          params: {
            currentPage: _this.currentPage,
            numsPerPage: _this.numsPerPage,
            spId: _this.specialId
          }
        })
        .then(res => {
          if (res && res.data && res.data.goods && res.data.goods.items) {
            let ary = res.data.goods.items;
            _this.dataTotal = res.data.goods.count;
            let result = transform.getDataTable({
              items: res.data.goods.items
            });
            _this.cartlistData = result.result;
            // console.log(result.result);
          }
          if (
            res &&
            res.data &&
            res.data.goods &&
            res.data &&
            res.data.special
          ) {
            _this.specialSGForm.startTime = res.data.special.spStartTime;
            _this.specialSGForm.endTime = res.data.special.spEndTime;
            _this.specialSGForm.spTitleCn = res.data.special.spTitleCn;
            // _this.specialSGForm.startTime = moment(res.data.special.spStartTime)
            //   .utcOffset(-8)
            //   .format("YYYY-MM-DD HH:mm:ss");
            // _this.specialSGForm.endTime = moment(res.data.special.spEndTime)
            //   .utcOffset(-8)
            //   .format("YYYY-MM-DD HH:mm:ss");
          }
        });
    },
    pageChange(page) {
      let _this = this;
      _this.currentPage = page;
      _this.fetchData();
    }
  }
};
</script>
<style src="./prodetail.less" lang="less"></style>



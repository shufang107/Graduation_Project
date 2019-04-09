<template>
  <div class="operate-flashsale-fsdetail-wrap">
    <v-modal
      class="modal-whole"
      :width="1200"
      title="主题专场详情"
      :visible="detailVisible"
      @ok="handleClose"
      @cancel="handleClose"
    >
      <v-content>
        <v-form
          class="search-form"
          :model="specialFSForm"
          ref="specialrefFSForm"
          style="margin-bottom:10px"
        >
          <v-form-item label="专场中文名">
            <v-input placeholder="请输入专场中文名" disabled :value="specialFSForm.spTitleCn"></v-input>
          </v-form-item>
          <v-form-item label="专场英文名">
            <v-input placeholder="请输入专场英文名" disabled :value="specialFSForm.spTitleEn"></v-input>
          </v-form-item>
          <v-form-item label="专场权重">
            <v-input placeholder="请输入专场权重值" disabled :value="specialFSForm.spWeight"></v-input>
          </v-form-item>
          <v-form-item label="开始时间">
            <v-date-picker show-time disabled :value="specialFSForm.startTime"></v-date-picker>
          </v-form-item>
          <v-form-item label="结束时间">
            <v-date-picker show-time disabled :value="specialFSForm.endTime"></v-date-picker>
          </v-form-item>
          <v-form-item label="副标题中文名">
            <v-input placeholder="请输入副标题中文名" disabled :value="specialFSForm.spSubTitleCn"></v-input>
          </v-form-item>
          <v-form-item label="副标题英文名">
            <v-input placeholder="请输入副标题英文名" disabled :value="specialFSForm.spSubTitleEn"></v-input>
          </v-form-item>
          <v-form-item label="主题背景颜色值">
            <v-input placeholder="请输入颜色值" disabled :value="specialFSForm.spColor"></v-input>
          </v-form-item>
          <br>
          <v-form-item label="Banner图URL(CN)(600px*320px)">
            <v-input
              style="width:380px"
              disabled
              placeholder="请输入Banner中文图片地址"
              :value="specialFSForm.spBannerImgCn"
            ></v-input>
          </v-form-item>
          <v-form-item label="Banner图URL(EN)(600px*320px)">
            <v-input
              style="width:380px"
              disabled
              placeholder="请输入Banner英文图片地址"
              :value="specialFSForm.spBannerImgEn"
            ></v-input>
          </v-form-item>
          <v-form-item label="背景图URL(CN)(750px*N)">
            <v-input
              style="width:380px"
              disabled
              placeholder="请输入背景中文图片地址"
              :value="specialFSForm.spBgImgCn"
            ></v-input>
          </v-form-item>
          <v-form-item label="背景图URL(EN)(750px*N)">
            <v-input
              style="width:380px"
              disabled
              placeholder="请输入背景英文图片地址"
              :value="specialFSForm.spBgImgEn"
            ></v-input>
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
              <div v-else-if="props.column.field =='status'">
                <span v-if="props.content=='0'" style="color:green">在售</span>
                <span v-if="props.content=='1'">下线</span>
                <span v-if="props.content=='2'" style="color:red">下架</span>
              </div>
              <div
                v-else-if="props.column.field =='marketPrice'"
              >{{props.item.unit}}{{props.content}}</div>
              <div
                v-else-if="props.column.field =='spgActivityPrice'"
              >{{props.item.unit}}{{props.content}}</div>
              <div
                v-else-if="props.column.field =='spgActivityCommission'"
              >{{props.item.unit}}{{props.content}}</div>
              <div v-else-if="props.column.field=='limitedNum'">
                <span v-if="props.content==0">--</span>
                <span v-else>{{props.content}}</span>
              </div>
              <div v-else-if="props.column.field=='availableStock'">
                <span v-if="props.content==0" style="color:red">0</span>
                <span v-else>{{props.content}}</span>
              </div>
              <div v-else-if="props.column.field =='actRestStock'">
                <!--可售库存-支付的库存-->
                {{props.item.spgSellStock - props.item.spgPayStock}}
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
      specialFSForm: {
        spTitleCn: "",
        spTitleEn: "",
        spWeight: 0,
        spSubTitleCn: "",
        spSubTitleEn: "",
        spColor: "",
        spBannerImgCn: "",
        spBannerImgEn: "",
        spBgImgCn: "",
        spBgImgEn: "",
        startTime: "",
        endTime: ""
      }
    };
  },
  created() {
    this.showable = this.detailVisible;
    this.suColumns = [
      { title: "SPU", field: "spu" },
      { title: "SKU", field: "spgSkuId" },
      { title: "图片", field: "photo" },
      { title: "商品中文名", field: "skuName" },
      { title: "在线状态", field: "status" },
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
      this.showable = false;
      this.$emit("changeBul", this.showable);
    },
    resetPage() {
      this.currentPage = 1;
      this.numsPerPage = 10;
      this.dataTotal = 0;
      this.cartlistData = [];
      this.specialFSForm.spTitleCn = "";
      this.specialFSForm.spTitleEn = "";
      this.specialFSForm.spWeight = 0;
      this.specialFSForm.spSubTitleCn = "";
      this.specialFSForm.spSubTitleEn = "";
      this.specialFSForm.spColor = "";
      this.specialFSForm.spBannerImgCn = "";
      this.specialFSForm.spBannerImgEn = "";
      this.specialFSForm.spBgImgCn = "";
      this.specialFSForm.spBgImgEn = "";
      this.specialFSForm.startTime = "";
      this.specialFSForm.endTime = "";
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
          }
          if (
            res &&
            res.data &&
            res.data.goods &&
            res.data &&
            res.data.special
          ) {
            _this.specialFSForm.spTitleCn = res.data.special.spTitleCn;
            _this.specialFSForm.spTitleEn = res.data.special.spTitleEn;
            _this.specialFSForm.spWeight = res.data.special.spWeight;
            _this.specialFSForm.spSubTitleCn = res.data.special.spSubTitleCn;
            _this.specialFSForm.spSubTitleEn = res.data.special.spSubTitleEn;
            _this.specialFSForm.spColor = res.data.special.spColor;
            _this.specialFSForm.spBannerImgCn = res.data.special.spBannerImgCn;
            _this.specialFSForm.spBannerImgEn = res.data.special.spBannerImgEn;
            _this.specialFSForm.spBgImgCn = res.data.special.spBgImgCn;
            _this.specialFSForm.spBgImgEn = res.data.special.spBgImgEn;
            _this.specialFSForm.startTime = res.data.special.spStartTime;
            _this.specialFSForm.endTime = res.data.special.spEndTime;
            // console.log(_this.specialFSForm.startTime);
            // console.log(_this.specialFSForm.endTime);
            // _this.specialFSForm.startTime = moment(res.data.special.spStartTime)
            //   .utcOffset(-8)
            //   .format("YYYY-MM-DD HH:mm:ss");
            // _this.specialFSForm.endTime = moment(res.data.special.spEndTime)
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
<style src="./fsdetail.less" lang="less"></style>



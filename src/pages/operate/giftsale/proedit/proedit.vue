<template>
  <div class="operate-product-proedit-wrap">
    <v-modal
      class="modal-whole"
      :width="1200"
      title="编辑单品推荐专场"
      :visible="editVisible"
      @ok="handleOK"
      @cancel="handleCancel"
      style="position:relative"
    >
      <v-spin :spinning="spinning" tip="加载中">
        <v-content>
          <v-form class="search-form" :model="specialSGForm" ref="specialrefSGForm">
            <!--添加-->
            <v-form-item label="专场名称">
              <v-input v-model="specialSGForm.spTitleCn" :value="specialSGForm.spTitleCn" placeholder=""></v-input>
            </v-form-item>

            <v-form-item label="开始时间">
              <v-date-picker
                clearable
                show-time
                v-model="specialSGForm.startTime"
                :value="specialSGForm.startTime"
              ></v-date-picker>
            </v-form-item>
            <v-form-item label="结束时间">
              <v-date-picker
                clearable
                show-time
                v-model="specialSGForm.endTime"
                :value="specialSGForm.endTime"
              ></v-date-picker>
            </v-form-item>
            <v-form-item>
              <v-button type="primary" html-type="button" @click="downloadtemp">下载导入模板</v-button>
            </v-form-item>
            <v-form-item>
              <v-upload :name="name" :action="action" @change="onChange" :header="header">
                <v-button type="ghost">
                  <v-icon type="upload"></v-icon>点击上传
                </v-button>
              </v-upload>
            </v-form-item>
          </v-form>
        </v-content>
        <div class="data-gird">
          <v-tabs class="proedit-tab" active-tab-key="key1">
            <v-tab-pane tab-key="key1" tab="成功商品">
              <v-pagination
                style="text-align:right;margin-bottom:10px"
                show-quick-jumper
                :total="sudataTotal"
                @change="supageChange"
              ></v-pagination>
              <div class="data-gird" :style="`height:${gridHeight}`">
                <v-data-table :data="getData" :columns="suColumns" :currentData="successlist">
                  <template slot="td" slot-scope="props">
                    <div v-if="props.column.field=='quantity'">
                      <span v-if="props.content==0" style="color:red">0</span>
                      <span v-else>{{props.content}}</span>
                    </div>
                    <div v-else-if="props.column.field =='photo'">
                      <img :src="props.content" style="width : 50px" alt>
                    </div>
                    <!-- <div v-else-if="props.column.field =='spGoodsStatus'">
                      <span v-if="props.content=='0'" style="color:green">在售</span>
                      <span v-if="props.content=='1'">下线</span>
                      <span v-if="props.content=='2'" style="color:red">下架</span>
                    </div>-->
                    <div
                      v-else-if="props.column.field =='marketPrice'"
                    >{{props.item.unit}}{{props.content}}</div>
                    <div
                      v-else-if="props.column.field =='spgActivityPrice'"
                    >{{props.item.unit}}{{props.content}}</div>
                    <div
                      v-else-if="props.column.field =='spgActivityCommission'"
                    >{{props.item.unit}}{{props.content}}</div>
                    <div v-else-if="props.column.field =='actRestStock'">
                      <!--可售库存-支付的库存-->
                      {{props.item.spgSellStock - props.item.spgPayStock}}
                    </div>
                    <span v-else v-html="props.content"></span>
                  </template>
                </v-data-table>
              </div>
            </v-tab-pane>
            <v-tab-pane tab-key="key2" tab="失效商品">
              <v-pagination
                style="text-align:right;margin-bottom:10px"
                show-quick-jumper
                :total="fadataTotal"
                @change="fapageChange"
              ></v-pagination>
              <div class="data-gird" :style="`height:${gridHeight}`">
                <v-data-table :data="getData" :columns="faColumns" :currentData="faillist">
                  <template slot="td" slot-scope="props">
                    <div v-if="props.column.field=='quantity'">
                      <span v-if="props.content==0" style="color:red">0</span>
                      <span v-else>{{props.content}}</span>
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

                    <span v-else v-html="props.content"></span>
                  </template>
                </v-data-table>
              </div>
            </v-tab-pane>
          </v-tabs>
        </div>
      </v-spin>
    </v-modal>
  </div>
</template>
<script>
import api from "../api.js";
import setting from "@/setting/index.js";
import transform from "@/util/transform.js";
import moment from "moment";
export default {
  props: {
    editVisible: Boolean,
    specialId: String
  },
  data() {
    return {
      isDetail: true, //属于详情页的列表
      spinning: false, //loading
      showable: true,
      startTime: "",
      endTime: "",
      deColumns: [],
      suColumns: [],
      faColumns: [],
      faillist: [],
      successlist: [],
      gridHeight: "400px",
      name: "file",
      header: {},
      action: setting.uploadUrl,
      tempId: "",
      spId: "",
      sucurrentPage: 1,
      sunumsPerPage: 10,
      facurrentPage: 1,
      fanumsPerPage: 10,
      sudataTotal: 0,
      fadataTotal: 0,
      specialSGForm: {
        startTime: "",
        endTime: "",
        spTitleCn:''
      }
    };
  },
  watch: {
    editVisible: function(val, oldVal) {
      let _this = this;
      if (val) {
        console.log("specialId:" + this.specialId);
        _this.spId = this.specialId;
        _this.fetchData();
      }
    }
  },
  created() {
    this.showable = this.editVisible;
    console.log("this.showable", this.showable);
    (this.suColumns = [
      { title: "SKU", field: "spgSkuId" },
      // { title: "SPU", field: "" },
      { title: "商品图", field: "photo" },
      { title: "商品名称", field: "skuName" },
      // { title: "在线状态", field: "spGoodsStatus"},
      { title: "市场价", field: "marketPrice" },
      { title: "活动价", field: "spgActivityPrice" },
      { title: "活动佣金", field: "spgActivityCommission" },
      { title: "起购数量", field: "spgMinimum" },
      { title: "限购数量", field: "spgMaximum" },
      { title: "实际库存", field: "quantity" },
      { title: "可售库存", field: "spgSellStock" },
      { title: "剩余库存", field: "spgRestStock" },
      { title: "实际剩余库存", field: "actRestStock" },
      { title: "支付锁定", field: "spgPayStock" },
      { title: "购物车锁定", field: "spgCartStock" }
    ]),
      (this.faColumns = [
        { title: "SKU", field: "spgSkuId" },
        // { title: "SPU", field: "" },
        { title: "图片", field: "photo" },
        { title: "商品名称", field: "skuName" },
        { title: "市场价", field: "marketPrice" },
        { title: "活动价", field: "spgActivityPrice" },
        { title: "活动佣金", field: "spgActivityCommission" },
        { title: "起购数量", field: "spgMinimum" },
        { title: "限购数量", field: "spgMaximum" },
        { title: "实际库存", field: "quantity" },
        { title: "可售库存", field: "spgSellStock" },
        { title: "失效原因", field: "reason" }
      ]);
  },
  methods: {
    //请求列表数据
    fetchData() {
      let _this = this;
      _this.$http
        .get(api.get_special_goods, {
          params: {
            currentPage: _this.sucurrentPage,
            numsPerPage: _this.sunumsPerPage,
            spId: _this.specialId
          }
        })
        .then(res => {
          if (res && res.data && res.data.goods && res.data.goods.items) {
            let ary = res.data.goods.items;
            _this.sudataTotal = res.data.goods.count;
            let result = transform.getDataTable({
              items: res.data.goods.items,
              totalCount: res.data.goods.count
            });
            _this.successlist = result.result;
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
            _this.spinning = false;
          }
        });
    },
    pageChange(page) {
      let _this = this;
      _this.sucurrentPage = page;
      _this.fetchData();
    },
    supageChange(page) {
      let _this = this;
      _this.sucurrentPage = page;
      _this.spinning = true;
      if (_this.isDetail) {
        _this.fetchData();
      } else {
        _this.fetchTempData();
      }
    },
    fapageChange(page) {
      let _this = this;
      _this.spinning = true;
      _this.facurrentPage = page;
      _this.fetchTempData();
    },
    downloadtemp() {
      location.href = setting.downLoadExcel + new Date().getTime();
    },
    fetchTempData() {
      let _this = this;
      //分开请求
      _this.$http
        .get(api.load_temp_goods, {
          params: {
            tempId: _this.tempId,
            sucurrentPage: _this.sucurrentPage,
            sunumsPerPage: _this.sunumsPerPage,
            facurrentPage: _this.facurrentPage,
            fanumsPerPage: _this.fanumsPerPage
          }
        })
        .then(res => {
          if (res.code === 0) {
            _this.faillist = res.data.failList;
            _this.successlist = res.data.successList;
            _this.sudataTotal = res.data.sutotal;
            _this.fadataTotal = res.data.fatotal;
            console.log(_this.faillist.length);
            console.log(_this.successlist.length);
          }
        });
      _this.spinning = false;
    },
    onChange(info) {
      let _this = this;
      if (info.file.status !== "uploading") {
      }
      if (info.file.status === "done") {
        _this.isDetail = false;
        _this.$message.success("上传成功!", 0.5);
        _this.tempId = info.file.response.data.tempId;
        console.log(_this.sucurrentPage + "-" + _this.facurrentPage);
        _this.fetchTempData();
        // _this.tempId = info.file.response.data.tempId;
      } else if (info.file.status === "error") {
        _this.$message.error("上传失败!", 0.5);
      }
    },
    handleOK() {
      this.showable = false;
      let params = {
        spId: this.spId,
        tempId: this.tempId,
        startTime: this.specialSGForm.startTime,
        endTime: this.specialSGForm.endTime,
        spTitleCn: this.specialSGForm.spTitleCn,
        specialType: 2
      };
      let _this = this;
      _this.$http.post(api.submit_singlesale, params).then(res => {
        if (res.code === 0) {
          _this.$message.success("提交成功!", 0.5);
          let resParam = {
            add: false,
            edit: false,
            detail: false,
            iscancle: false,
            isconform: true
          };
          _this.$emit("changeBul", resParam);
        }
      });
    },
    handleCancel() {
      this.showable = false;
      let _this = this;
      _this.$http
        .post(api.del_temp_special_goods, {
          tempId: _this.tempId
        })
        .then(res => {
          // console.log(res);
          let resParam = {
            add: false,
            edit: false,
            detail: false,
            iscancle: true,
            isconform: false
          };
          _this.$emit("changeBul", resParam);
        });
    },
    getData() {
      let result = {
        result: []
      };
      return new Promise((resolve, reject) => {
        resolve(result);
      });
    }
  }
};
</script>
<style src="./proedit.less" lang="less"></style>

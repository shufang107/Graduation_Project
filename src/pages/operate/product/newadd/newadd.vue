<template>
  <div class="operate-product-newadd-wrap">
    <v-modal
      class="modal-whole"
      :width="1250"
      title="添加单品推荐专场"
      :visible="addVisible"
      @ok="handleOK"
      @cancel="handleCancel"
      style="position:relative"
    >
      <v-spin :spinning="spinning" tip="加载中" :model="specialSGForm" ref="specialrefSGForm">
        <v-content>
          <v-form class="search-form">
            <!--添加-->
            <v-form-item label="专场名称">
              <v-input v-model="specialSGForm.spTitleCn" :value="specialSGForm.spTitleCn" placeholder="请输入专场名称"></v-input>
            </v-form-item>

            <v-form-item label="开始时间">
              <v-date-picker clearable show-time v-model="specialSGForm.startTime"></v-date-picker>
            </v-form-item>
            <v-form-item label="结束时间">
              <v-date-picker clearable show-time v-model="specialSGForm.endTime"></v-date-picker>
            </v-form-item>
            <v-form-item>
              <v-button type="primary" html-type="button" @click="downloadtemp">下载导入模板</v-button>
            </v-form-item>
            <v-form-item>
              <v-upload :name="name" :action="action" @change="onChange">
                <v-button type="ghost">
                  <v-icon type="upload"></v-icon>点击上传
                </v-button>
              </v-upload>
            </v-form-item>
          </v-form>
        </v-content>
        <div class="data-gird">
          <v-tabs class="newadd-tab" active-tab-key="key1">
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
import api from ".././api.js";
import setting from "@/setting/index.js";
export default {
  props: ["addVisible"],
  data() {
    return {
      spinning: false, //loading
      showable: true,
      spTitleCn:"",
      startTime: "",
      endTime: "",
      suColumns: [],
      faColumns: [],
      faillist: [],
      successlist: [],
      gridHeight: "400px",
      name: "file",
      header: {},
      action: setting.uploadUrl,
      tempId: "",
      sucurrentPage: 1,
      sunumsPerPage: 10,
      facurrentPage: 1,
      fanumsPerPage: 10,
      sudataTotal: 0,
      fadataTotal: 0,
      specialSGForm: {
        spTitleCn: "",
        startTime: "",
        endTime: ""
      }
    };
  },
  created() {
    this.showable = this.addVisible;
    //console.log(this.showable)
    (this.suColumns = [
      { title: "SKU", field: "spgSkuId" },
      // { title: "SPU", field: "spu" },
      { title: "商品图", field: "photo" },
      { title: "商品名称", field: "skuName" },
      { title: "市场价", field: "marketPrice" },
      { title: "活动价", field: "spgActivityPrice" },
      { title: "活动佣金", field: "spgActivityCommission" },
      { title: "起购数量", field: "spgMinimum" },
      { title: "限购数量", field: "spgMaximum" },
      { title: "实际库存", field: "availableQuantity" },
      { title: "可售库存", field: "spgSellStock" }
    ]),
      (this.faColumns = [
        { title: "SKU", field: "spgSkuId" },
        // { title: "SPU", field: "spu" },
        { title: "图片", field: "photo" },
        { title: "商品名称", field: "skuName" },
        { title: "市场价", field: "marketPrice" },
        { title: "活动价", field: "spgActivityPrice" },
        { title: "活动佣金", field: "spgActivityCommission" },
        { title: "起购数量", field: "spgMinimum" },
        { title: "限购数量", field: "spgMaximum" },
        { title: "实际库存", field: "availableQuantity" },
        { title: "可售库存", field: "spgSellStock" },
        { title: "失效原因", field: "reason" }
      ]);
  },
  methods: {
    supageChange(page) {
      let _this = this;
      _this.sucurrentPage = page;
      _this.spinning = true;
      _this.fetchTempData();
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
        _this.$message.success("上传成功!", 0.5);
        _this.tempId = info.file.response.data.tempId;
        console.log(info.file.response.data.tempId);
        console.log(_this.sucurrentPage + "-" + _this.facurrentPage);
        _this.fetchTempData();
        // _this.tempId = info.file.response.data.tempId;
      } else if (info.file.status === "error") {
        _this.$message.error("上传失败!", 0.5);
      }
    },
    handleOK() {
      console.log("ok!");
      this.showable = false;
      //
      let params = {
        tempId: this.tempId,
        startTime: this.specialSGForm.startTime,
        endTime: this.specialSGForm.endTime,
        spTitleCn: this.specialSGForm.spTitleCn,
        specialType:0
      };
      let _this = this;
      _this.$http.post(api.submit_singlesale, params).then(res => {
        if (res.code === 0) {
          _this.$message.success("添加成功!", 0.5);
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
<style src="./newadd.less" lang="less"></style>



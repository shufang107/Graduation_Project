<template>
  <v-content class="operate-goods-wrap">
    <!-- <count-form
      :ruleForm='ruleForm'
      @updaydata='updaydata'
      @updayalldata='updayalldata'
      @downloadFile='downloadFile'
      @onSearch='onSearch'>
    </count-form> -->
    <br>

    <div
      class="data-gird"
      :style="`height:${gridHeight};width:${gridWidth};text-align:left;margin-bottom:10px`"
    >
      <v-data-table :data="getData" :currentData="cartlistData" :columns="columns">
        <template slot="td" slot-scope="props">
          <div v-if="props.column.field=='photo'">
            <img :src="props.content" style="width:50px;height:50px" :key="props.content" alt>
          </div>
          <div v-else-if="props.column.field=='status'">
            <div v-if="props.content=='0'" style="color:green">在售</div>
            <div v-if="props.content=='1'">下线</div>
            <div v-if="props.content=='2'" style="color:red">下架</div>
          </div>
          <div v-else-if="props.column.field=='skuOperation'">
            <div v-if="props.item.status=='0'">
              <v-button type="primary" size="small" @click="online(props.item)" disabled>上线</v-button>
              <v-button type="primary" size="small" @click="offline(props.item)">下线</v-button>
              <v-button type="primary" size="small" @click="deleteproduct(props.item)">下架</v-button>
              <v-button type="primary" size="small" @click="showEditmodel(props.item)" >编辑</v-button>

            </div>
            <div v-if="props.item.status=='1'">
              <v-button type="primary" size="small" @click="online(props.item)">上线</v-button>
              <v-button type="primary" size="small" @click="offline(props.item)" disabled>下线</v-button>
              <v-button type="primary" size="small" @click="deleteproduct(props.item)">下架</v-button>
              <v-button type="primary" size="small"  @click="showEditmodel(props.item)">编辑</v-button>

            </div>
            <div v-if="props.item.status=='2'">
              <v-button type="primary" size="small" @click="online(props.item)">上线</v-button>
              <v-button type="primary" size="small" @click="offline(props.item)">下线</v-button>
              <v-button type="primary" size="small" @click="deleteproduct(props.item)" disabled>下架</v-button>
              <v-button type="primary" size="small" @click="showEditmodel(props.item)">编辑</v-button>
            </div>
          </div>
          <span v-else v-html="props.content"></span>
        </template>
      </v-data-table>
    </div>
    <br>
    <v-row class="demo-row">
      <v-col span="3">
        <v-button
          type="primary"
          html-type="button"
          @click="downloadSkuFile"
          ref="downloadbtn"
        >下载查询结果</v-button>
      </v-col>

      <v-col span="21">
        <v-pagination
          style="text-align:right;"
          show-quick-jumper
          :total="dataTotal"
          @change="pageChange"
          :value="currentPage"
          :show-total="showTotal"
        ></v-pagination>
      <edit-sku :editVisible="editVisible" :listData="listData" v-on:changeBul="bulState"></edit-sku>
      </v-col>
    </v-row>
  </v-content>
</template>

<script>
import api from "./api.js";
import transform from "@/util/transform.js";
import editSku from "./editsku/editsku";
import request from "@/util/ajax.js";
import setting from "@/setting/index.js";
import CountForm from '@/components/count_form/countform'

export default {
  name: "operate-goods",
  data() {
    return {
      dataTotal: 0, //页总数
      currentPage: 1,
      numsPerPage: 10,
      editVisible: false,
      name: "file",
      action: setting.uploadSkuExcel,
      header: {},
      gridHeight: "500px",
      gridWidth: "800px",
      ruleForm: {
        skuErpList: "",
        status: "",
        skuName: "", //商品名称
        spuList: "" //商品spuList
      },
      columns: [],
      listData: {},
      cartlistData: [] //更新的数组
    };
  },
  mounted() {
    // this.getData();
  },
  created() {
    //console.log(api.getSkuBySpuStatus)
    this.gridHeight = document.body.clientHeight - 260 + "px";
    this.gridWidth = document.body.clientWidth - 230 + "px";
    this.columns = [
      { title: "SPUID", field: "spu", width: "5%" },
      { title: "SKUID", field: "skuErp", width: "5%" },
      { title: "商品图", field: "photo", width: "10%" },
      { title: "商品中文名", field: "skuName", width: "20%" },
      { title: "商品成本价", field: "costPrice", width: "5%" },
      { title: "商品市场价", field: "marketPrice", width: "5%" },
      { title: "商品销售价", field: "sellPrice", width: "5%" },
      { title: "商品佣金", field: "commission", width: "5%" },
      { title: "TaxCode", field: "taxCode", width: "5%" },
      { title: "商品推荐语", field: "recommend", width: "20%" },
      { title: "商品库存", field: "quantity", width: "5%" },
      { title: "安全库存比例", field: "safeRateShow", width: "5%" },
      { title: "可用活动库存", field: "availableQuantity", width: "5%" },
      { title: "商品状态", field: "status", width: "10%" },
      { title: "更新时间", field: "lastUpdateTime", width: "20%" },
      { title: "操作", field: "skuOperation", width: "15%" }
    ];
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getData() {
      var _this = this;
      return _this.$http
        .get(api.getSkuBySpuStatus, {
          params: {
            currentPage: _this.currentPage,
            numsPerPage: _this.numsPerPage
          }
        })
        .then(res => {
          //console.log(res.data) ;
          _this.dataTotal = res.data.count;
          let result = transform.getDataTable({
            items: res.data.items,
            pageSize: res.data.numsPerPage,
            pageNo: res.data.count
          });
          return result;
        });
    },
    onFetchSearch() {
      //console.log(item.sku)
      var _this = this;
      //console.log(_this.ruleForm.sku)
      return _this.$http
        .get(api.getSkuBySkuStatus, {
          params: {
            skuErpList: _this.ruleForm.skuErpList,
            skuName: _this.ruleForm.skuName,
            status: _this.ruleForm.status,
            spuList: _this.ruleForm.spuList,
            currentPage: _this.currentPage,
            numsPerPage: _this.numsPerPage
          }
        })
        .then(res => {
          // console.log(res.data) ;
          _this.dataTotal = res.data.count;
          let result = transform.getDataTable({
            items: res.data.items
          });
          //console.log(result)
          this.cartlistData = result.result;
          return result;
        });
    },
    online(item) {
      //console.log(obj)
      var _this = this;
      //console.log(onlineText)
      this.$modal.confirm({
        title: "您确认要上线" + item.sku + "？",
        content: "",
        onOk: function() {
          _this.$http
            .post(api.updateSkuStatus, 
              {
                sku: item.sku,
                spu: item.spu,
                spuList: item.spu,
                status: "0"
              },
              {
                headers: {
                  "Content-Type": "application/json"
                }
              }
              )
            .then(res => {
              if (res.code == 0) {
                _this.$message.success("上线成功!", 0.5);
                //_this.$refs.ruleForm.reload();
              } else {
                _this.$message.error("上线失败!", 0.5);
              }
              _this.onSearch(); //重新查询
            });
        },
        onCancel: function() {
          _this.onSearch(); //重新查询
        }
      });
    },
    offline(item) {
      //console.log(obj)
      var _this = this;
      //console.log(onlineText)
      this.$modal.confirm({
        title: "您确认要下线" + item.sku + "？",
        content: "",
        onOk: function() {
          _this.$http
            .post(api.updateSkuStatus, 
            {
              sku: item.sku,
              spu: item.spu,
              spuList: item.spuList,
              status: "1"
            },
            {
                headers: {
                  "Content-Type": "application/json"
                }
            }
            )
            .then(res => {
              if (res.code == 0) {
                _this.$message.success("下线成功!", 0.5);
                //_this.$refs.ruleForm.reload();
              } else {
                _this.$message.error("下线失败!", 0.5);
              }
              _this.onSearch(); //重新查询
            });
        },
        onCancel: function() {}
      });
    },
    deleteproduct(item) {
      //console.log(obj)
      var _this = this;
      //console.log(onlineText)
      this.$modal.confirm({
        title: "您确认要下架" + item.sku + "？",
        content: "",
        onOk: function() {
          _this.$http
            .post(api.updateSkuStatus, {
              sku: item.sku,
              spu: item.spu,
              spuList: item.spuList,
              status: "2"
            })
            .then(res => {
              if (res.code == 0) {
                _this.$message.success("下架成功!", 0.5);
                //_this.$refs.ruleForm.reload();
              } else {
                _this.$message.error("下架失败!", 0.5);
              }
              _this.onSearch(); //重新查询
            });
        },
        onCancel: function() {}
      });
    },
    onSearch() {
      // console.log(this.currentPage)
      this.currentPage = this.currentPage;
      // this.pageChange(1);
      this.cartlistData = null;
      this.onFetchSearch();
    },
    inputonSearch(){
      this.currentPage = 1;
      this.onFetchSearch();
      this.dataTotal = this.searchLength;
      this.cartlistData=null;
    },
    pageChange(page) {
      this.currentPage = page;
      this.onFetchSearch();
    },
    showTotal() {
      return `总共` + this.dataTotal + `条数据`;
    },
    downloadSkuFile() {
      //console.log(item.sku)
      var _this = this;
      let url =
        setting.downLoadSkuexcel +
        api.getSkuFile +
        `?skuErpList=${_this.ruleForm.skuErpList}&skuName=${
          _this.ruleForm.skuName
        }&status=${_this.ruleForm.status}&spuList=${_this.ruleForm.spuList}&currentPage=${
          _this.currentPage
        }&numsPerPage=${_this.numsPerPage}`;
      // console.log(url);
      // console.log(_this.ruleForm.skuErp);
        location.href=url;
    },
    //新添加1
    //模板下载
    downloadtemp() {
      location.href = setting.downLoadSkuTemp + new Date().getTime();
    },
    //新添加上传2
    //上传
    onChange(info) {
      let _this = this;
      if (info.file.status !== "uploading") {
      }
      if (info.file.status === "done") {
        //console.log('info',info.file.response.data.fails[0].spu)
        // console.log('info',info.file.response.data.success)
        _this.updataFails = info.file.response.data.fails;
        _this.updataSuccess =  info.file.response.data.success;
        this.uploadAlert();
        _this.$message.success("上传成功!", 0.5);
        //_this.tempId = info.file.response.data.tempId;
        //console.log(_this.sucurrentPage + "-" + _this.facurrentPage);
        // _this.$refs.ruleForm.reload();
        // _this.tempId = info.file.response.data.tempId;
      } else if (info.file.status === "error") {
        _this.$message.error("上传失败!", 0.5);
      }
    },
     uploadAlert(){
        this.visible=true;
    },
    //新加方法3
    //编辑
    showEditmodel(obj) {
      this.editVisible = true;
      this.listData = obj;
      //console.log('obj',obj)
      this.onSearch();//重新查询
    },
     bulState(data) {
      this.editVisible = data;
      // this.detailVisible = data;
      // this.$refs["ruleForm"].resetFields();//重新加载表
      // this.$refs.ruleForm.refresh();
      this.onSearch();
    }
  },
  //注册组件（弹框）
  components: {
    editSku,
    CountForm:CountForm
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./skugoods.less" lang="less"></style>

<template>
  <v-content class="operate-skugoogs-editsku-wrap">
    <v-modal
      :width="700"
      title="编辑SPU商品"
      :visible="editVisible"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div class="spu-content">
        <v-form :model="listData" ref="listData">
          <v-row>
            <v-col span="8">
              <div class="img-space" prop="photo">
                <img style="height: 200px; width: 200px" :src="listData.photo" alt>
              </div>
            </v-col>
            <v-col span="16">
              <div class="text-space">
                <v-form :v-model="spuForm" ref="spuForm">
                  <v-form-item label="商 品 SKU" prop="skuErp">{{listData.skuErp}}</v-form-item>
                  <br>
                  <v-form-item label="商 品 名 称" prop="skuName">{{listData.skuName}}</v-form-item>
                  <br>
                  <v-form-item label="商品成本价" prop="costPrice">{{listData.costPrice}}</v-form-item>
                  <br>
                  <v-form-item label="商品市场价" prop="marketPrice" has-feedback>
                    <v-input-number v-model="spuForm.marketPrice" :value="spuForm.marketPrice"></v-input-number>
                  </v-form-item>
                  <br>
                  <v-form-item label="商品销售价" prop="sellPrice">
                    <v-input-number v-model="spuForm.sellPrice" :value="spuForm.sellPrice"></v-input-number>
                  </v-form-item>
                  <br>
                  <v-form-item label="商 品 佣 金" prop="commission">
                    <v-input-number v-model="spuForm.commission" :value="spuForm.commission"></v-input-number>
                  </v-form-item>
                  <br>
                   <v-form-item label=" TaxCode " prop="taxCode">
                    <v-input v-model="spuForm.taxCode" :value="spuForm.taxCode"></v-input>
                  </v-form-item>
                  <br>
                   <v-form-item label=" 安全库存比例 " prop="safeRate">
                    <v-input v-model="spuForm.safeRate" :value="spuForm.safeRate" style="width:60%"></v-input> <strong>%</strong>
                  </v-form-item>
                  <br>
                  <v-form-item label="商品推荐语" prop="recommend">
                    <v-input
                      placeholder="请输入商品推荐语"
                      v-model="spuForm.recommend"
                      :value="spuForm.recommend"
                    ></v-input>
                  </v-form-item>
                </v-form>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </div>
    </v-modal>
  </v-content>
</template>

<script>
import api from ".././api.js";
export default {
  name: "operate-advertisement-editad",
  props: ["editVisible", "listData"],
  data() {
    return {
      showable: true,
      spuForm: {
        marketPrice: 0,
        sellPrice: 1,
        commission: 0,
        recommend: "",
        sku:"",
        skuName:"",
        taxCode:0,
        safeRate:0,
      }
    };
  },
  created() {
    this.showable = this.editVisible;
  },
  watch: {
    listData: function(val, oldVal) {
      let _this = this;
      if (val) {
        _this.spuForm.marketPrice = val.marketPrice;
        _this.spuForm.sellPrice = val.sellPrice;
        _this.spuForm.commission = val.commission;
        _this.spuForm.recommend = val.recommend;
        _this.spuForm.skuName = val.skuName;
        _this.spuForm.skuErp =  val.skuErp;
        _this.spuForm.taxCode =  val.taxCode;
        _this.spuForm.safeRate = Math.round(val.safeRate*100);
      }
    }
  },
  mounted() {},
  methods: {
    handleOk() {
      this.showable = false;
      this.showConfirm();
    },
    handleCancel() {
      this.showable = false;
      this.$emit("changeBul", this.showable);
    },
    showConfirm() {
      var _this = this;
      _this.$modal.confirm({
        title: "您是否确认要编辑内容",
        content: "",
        onOk: function() {
          console.log(_this.spuForm.recommend.length);
          if (_this.spuForm.recommend.length > 50) {
            _this.$message.error("推荐语字符长度超过50", 5);
            return;
          }
          console.log('...',_this.spuForm.recommend+'...');
          if (_this.spuForm.recommend == "") {
            _this.$message.error("商品推荐语未填写，提交失败", 5);
            return;
          }
          if (_this.spuForm.sellPrice < 1) {
            _this.$message.error("销售价格不小于1", 5);
            return;
          }
          
          let commission = _this.spuForm.commission;
          let marketPrice = _this.spuForm.marketPrice;
          let recommend = _this.spuForm.recommend;
          let sellPrice = _this.spuForm.sellPrice;
          let sku = _this.spuForm.skuErp;
          let taxCode = _this.spuForm.taxCode;
          let safeRate = _this.spuForm.safeRate;
          let options = {
            commission,
            marketPrice,
            recommend,
            safeRate,
            sellPrice,
            sku,
            taxCode
          };
          _this.$http.post(api.updateSkuInfo, options).then(res => {
            // console.log(res)
            if (res.code == 0) {
              _this.$message.success("操作成功!", 0.5);
             _this.$emit("changeBul", _this.showable);
            //  console.log("11");
            } else {
              _this.$message.error("操作失败!", 0.5);
              _this.$emit("changeBul", _this.showable);
            }
          });
          
        },
        onCancel: function() {
          _this.$emit("changeBul", _this.showable);
        }
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./editsku.less" lang="less"></style>

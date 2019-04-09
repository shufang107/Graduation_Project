<template>
    <v-content class="operate-gift-wrap">
        <v-form class="search-form">
            <v-form-item label="SKU ID">
                <v-input style="width:300px" v-model="skuData.sku" placeholder="请输入SKU ID"></v-input>
            </v-form-item>
            <v-form-item>
                <v-button type="primary" @click="getData">查询</v-button>
            </v-form-item>
            <v-form-item>
                <v-button type="primary" @click="giftChoose">选择</v-button>
            </v-form-item> 
        </v-form>
        <div class="gfit-query">
            <v-form>
                <v-row>
                <v-col span="6"  >
                    <v-col>
                        <v-form-item >
                            <div class="img-space">
                                <!-- <span v-if="skuData.photo == 'undefinde'">商品图</span> -->
                                <img style="height: 147px; width: 147px;" :src="skuData.photo" alt="">
                            </div>
                        </v-form-item>
                        
                    </v-col>
                    
                </v-col>
                <v-col span="18" >
                    <div class="text-space">
                        <v-col span="24">
                            商品中文名称：{{skuData.skuName}}
                        </v-col>
                        <v-col span="24">
                            商品英文名称：{{skuData.skuNameEN}}
                        </v-col>
                        <v-col span="24">
                            商品市场价：{{skuData.unit}}{{skuData.marketPrice}}
                        </v-col>
                        <v-col span="24">
                            商品销售价：{{skuData.unit}}{{skuData.sellPrice}}
                        </v-col>
                        <v-col span="24">
                            商品库存：{{skuData.quantity}}
                        </v-col>
                        <v-col span="24">
                            商品供应商：{{skuData.manufacture}}
                        </v-col>
                        <v-col span="24">
                            商品品牌：{{skuData.brand}}
                        </v-col>
                    </div>
                </v-col>
            </v-row>
            </v-form>
            
        </div>
        <div class="gift-choose">
            <v-form class="choose-form">
                <v-row>
                    <v-col span="6"  >
                        <v-form-item label="已选礼品">
                            <div class="choose-img">
                                <!-- 商品图 -->
                                <img style="height: 90px; width: 90px;" :src="giftPhoto" alt="">
                            </div>
                        </v-form-item>
                    </v-col>
                    <v-col span="12" >
                        <v-form direction="horizontal" :model="giftSelected" :rules="ruleRules" ref="ruleRuleForm">
                            <v-form-item label="合伙人服务销售价" prop="salePrice">
                                <v-input-number v-model="giftSelected.salePrice" style="margin:10px 0;width:300px"></v-input-number>
                            </v-form-item>
                            
                            <v-form-item label="合伙人服务市场价" prop="marketPrice">
                                <v-input-number v-model="giftSelected.marketPrice" style="margin:10px 0;width:300px"></v-input-number>
                            </v-form-item>
                        </v-form>
                    </v-col>
                   
                </v-row>
            </v-form>
            
        </div>
        <v-form>
            <v-button type="primary" @click="giftSave">保存</v-button>
        </v-form>
    </v-content>
</template>

<script>
import api from "./api.js";
import { error } from 'util';
export default {
    name: "operate-gift",   
    data() {
        var validateMarket = (rule, value, callback) => {
            var value = parseFloat(value);
            //console.log('value',value)
            if (isNaN(value)) {
                callback(new Error('请输入正确的价格'));
            } else {
                if (value < 0.5) {
                    callback(new Error('价格不可小于0.5'));
                } else {
                    callback();
                }
            }
        };
        var validatSale = (rule, value, callback) => {
            var value = parseFloat(value);
            //console.log('value',value)
            if (isNaN(value)) {
                callback(new Error('请输入正确的件数'));
            } else {
                console.log('value < 0.5',value < 0.5)
                if (value < 0.5) {
                    callback(new Error('价格不可小于0.5'));
                } else {
                    callback()
                }
            }
        };
        return {
            //sku:'',//skuId
            giftPhoto:'',//图片
            skuData:{
                sku:'',
                photo:'',//图片
                skuName:'', // 商品中文名称：
                skuNameEN:'',   // 商品英文名称：
                marketPrice:'', // 商品市场价：
                sellPrice:'',  // 商品销售价：
                quantity:'', // 商品库存：
                manufacture:'', // 商品供应商：
                brand:'',    // 商品品牌：
                unit:''
            },
            giftSelected:{//选择的礼品
                photo:'',
                // id:'',
                marketPrice:'',
                salePrice:''
            },
            ruleRules:{
                marketPrice: [
                    {
                        required: true,
                        message: "请输入销售价"
                    },
                    {
                        validator: validateMarket
                    }
                ],
                salePrice: [
                    {
                        required: true,
                        message: "请输入市场价"
                    },
                    {
                        validator: validatSale
                    }
                ]
            }
        }
    },
    mounted() {
        this.upData();
        // this.giftChoose();
    },
    methods:{
        //查询
        getData(item){
            var _this = this;
            return _this.$http.get(api.getSkuInfo,{
                params:{
                    skuErpList:_this.skuData.sku
                }
            }).then( res => {
                //console.log(res.data) ;
                _this.skuData.sku = res.data[0].skuErp;
                _this.skuData.photo = res.data[0].photo;
                 //console.log('_this.skuData.photo',_this.skuData.photo)
                _this.skuData.skuName = res.data[0].skuName;
                _this.skuData.skuNameEN = res.data[0].skuNameEN;
                _this.skuData.marketPrice = res.data[0].marketPrice;
                _this.skuData.sellPrice = res.data[0].sellPrice;
                _this.skuData.quantity = res.data[0].quantity;
                _this.skuData.manufacture = res.data[0].manufacture;
                _this.skuData.brand = res.data[0].brand;
                _this.skuData.unit = res.data[0].unit;
                // console.log('item',item)
                if(item == true){
                    //console.log('_this.skuData.photo2',_this.skuData.photo);
                    _this.giftPhoto = res.data[0].photo;
                }
            })
        },
        //选择
        giftChoose(){
            //console.log('1')
            this.giftPhoto = this.skuData.photo;
        },
        //保存
        giftSave(){
            var _this = this;
            //console.log(api.updateapply_config);
            let storeConfig = JSON.stringify({
                list:[
                    {
                        "dictType": "store_gift_skuId",
                        "dictValue": _this.skuData.sku
                    },
                    {
                        "dictType": "store_market_price",
                        "dictValue": _this.giftSelected.marketPrice
                    },
                    {
                        "dictType": "store_sale_price",
                        "dictValue": _this.giftSelected.salePrice
                    }
                ]
            });
            _this.$refs["ruleRuleForm"].validate(valid => {
                //console.log(valid)
                if (valid) {
                    return _this.$http.post(api.updateapply_config,{
                        storeConfig,
                    }).then( res => {
                        //console.log(res.data.items) ;
                        if(res.code == '0'){
                            _this.$message['success']("保存成功");
                        }else {
                            _this.$message['error']("保存失败");
                        }
                    })
                } else {
                     console.log("submit error !!!");
                    return false;
                }
            })
            
        },
        // upSku(){
        //     var _this = this;
        //     return _this.$http.get(api.getSkuInfo,{
        //         params:{
        //             skuList:_this.skuData.sku
        //         }
        //     }).then( res => {
        //         //console.log(res.data) ;
        //         _this.skuData.sku = res.data[0].skuErp;
        //         _this.skuData.photo = res.data[0].photo;
        //         _this.skuData.skuName = res.data[0].skuName;
        //         _this.skuData.skuNameEN = res.data[0].skuNameEN;
        //         _this.skuData.marketPrice = res.data[0].marketPrice;
        //         _this.skuData.sellPrice = res.data[0].sellPrice;
        //         _this.skuData.quantity = res.data[0].quantity;
        //         _this.skuData.manufacture = res.data[0].manufacture;
        //         _this.skuData.brand = res.data[0].brand;
                
        //     })
        // },

        //页面刷新
        upData(){
            var _this = this;
             var item = true;
            return _this.$http.get(api.get_apply_store_config).then( res =>{
                //console.log("加载",res.data)
                _this.skuData.sku = res.data[0].dictValue; 
                _this.giftSelected.marketPrice = res.data[1].dictValue;
                _this.giftSelected.salePrice = res.data[2].dictValue; 
                _this.getData(item);
                // console.log('_this.skuData.photo2',_this.skuData.photo);
                // _this.giftPhoto = _this.skuData.photo;
            })  

        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./gift.less" lang="less"></style>

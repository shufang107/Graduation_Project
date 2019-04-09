<template>
    <v-content class="operate-normalorder-wrap">
        
        <v-modal :width="1300" title="普通订单详情" :visible="narmalVisible" @ok="handleOk" @cancel="handleCancel"> 
           <div class="detail-content">
               
               <v-row>
                    <v-col class="detail-side" span="6" >
                        <div class="text-space">
                            <v-form >
                                <h3>订单信息</h3>
                                <v-form-item label="订单ID" prop="">
                                   {{orderMsg.orderDetailId}}
                                </v-form-item>
                                <v-form-item label="支付时间" prop="">
                                   {{orderMsg.payTime}}
                                </v-form-item>
                                <v-form-item label="子订单号" prop="">
                                   {{orderMsg.orderCode}}
                                </v-form-item>
                                <v-form-item label="父订单号" prop="">
                                   {{orderMsg.parentOrderCode}}
                                </v-form-item>
                                <v-form-item label="店主店铺ID" prop="">
                                   {{orderMsg.store.storeId}}
                                </v-form-item>
                                <v-form-item label="店主昵称" prop="">
                                   {{orderMsg.store.storeName}}
                                </v-form-item>
                                <v-form-item label="购买用户ID" prop="">
                                   {{orderMsg.userId}}
                                </v-form-item>
                                <v-form-item label="用户昵称" prop="">
                                   {{orderMsg.nickName}}
                                </v-form-item>
                                <v-form-item label="购买商品数量" prop="">
                                   {{orderMsg.productCount}}
                                </v-form-item>
                                <v-form-item label="商品金额" prop="">
                                   {{orderMsg.unit}}{{orderMsg.price}}
                                </v-form-item>
                                <v-form-item label="邮费" prop="">
                                   {{orderMsg.unit}}{{orderMsg.shippingCost}}
                                </v-form-item>
                                <v-form-item label="消费税" prop="">
                                   {{orderMsg.unit}}{{orderMsg.totalTax}}
                                </v-form-item>
                                <v-form-item label="订单总额" prop="">
                                   {{orderMsg.unit}}{{orderMsg.orderTotal}}
                                </v-form-item>
                                <v-form-item label="佣金抵扣金额" prop="">
                                   {{orderMsg.unit}}{{orderMsg.commissionPrice}}
                                </v-form-item>
                                <v-form-item label="实付金额" prop="">
                                    {{orderMsg.unit}}{{orderMsg.orderTotal}}
                                </v-form-item>
                                <v-form-item label="获取佣金" prop="">
                                    {{orderMsg.unit}}{{orderMsg.commission}}
                                </v-form-item>
                                <v-form-item label="订单类型" prop="">
                                    <span v-if="orderMsg.orderType == 1">普通订单</span>
                                    <span v-if="orderMsg.orderType == 2">团购订单</span>
                                    <span v-if="orderMsg.orderType == 3">店铺申请订单</span>
                                    <span v-if="orderMsg.orderType == 4">店铺礼品订单</span>
                                </v-form-item>
                                <v-form-item label="订单状态" prop="">
                                    <span v-if="orderMsg.orderStatus == 0">unPaid,未支付</span>
                                    <span v-if="orderMsg.orderStatus == 1">Paid,已支付</span>
                                    <span v-if="orderMsg.orderStatus == 2">Processing,已配货</span>
                                    <span v-if="orderMsg.orderStatus == 3">Shipped,已发货</span>
                                    <span v-if="orderMsg.orderStatus == 4">Refunding,退款中</span>
                                    <span v-if="orderMsg.orderStatus == 5">Refunded 已退款</span>
                                    <span v-if="orderMsg.orderStatus == 6">待支付确认</span>
                                    <span v-if="orderMsg.orderStatus == 7">已完成</span>
                                    <span v-if="orderMsg.orderStatus == 8">已失效</span>
                                </v-form-item>   
                                <v-form-item label="地址" prop="">
                                    {{ orderMsg.address.address1 }}
                                    {{ orderMsg.address.address2 }}
                                    {{ orderMsg.address.city }}
                                    {{ orderMsg.address.state }}
                                    {{ orderMsg.address.postcode }}
                                    {{ orderMsg.address.countryName }}
                                </v-form-item>
                                <v-form-item label="支付方式" prop="">
                                    <span v-if="orderMsg.payType == null">未支付</span>
                                    <span v-if="orderMsg.payType == 0">微信支付</span>
                                    <span v-if="orderMsg.payType == 1">paypal支付</span>
                                    <span v-if="orderMsg.payType == 2">worldpay支付</span>
                                    <span v-if="orderMsg.payType == 3">stripe</span>
                                    <span v-if="orderMsg.payType  == 4">HantePay</span>
                                </v-form-item>
                                 <v-form-item label="支付交易号" prop="">
                                    {{orderMsg.transcationOrderId}}
                                </v-form-item>
                                <v-form-item label="下单平台" prop="">
                                    {{orderMsg.platform}}
                                </v-form-item>
                                <v-form-item label="是否自购" prop="">
                                    <span v-if="orderMsg.shopKeeperBuy == 1">是</span>
                                    <span v-if="orderMsg.shopKeeperBuy == 0">否</span>
                                    <span v-if="orderMsg.shopKeeperBuy == 10">是</span>
                                </v-form-item>
                                <br> 
                                <v-form-item label="物流单号">
                                    <div style="marginRight:5px;float:left" :key="logistic.id"  v-for="logistic in orderMsg.logistics">
                                        {{ logistic.orderTrackId }}
                                    </div>
                                </v-form-item>
                            </v-form>
                        </div>
                    </v-col>
                    <v-col span="18">
                        <div class="data-gird" :style="`height:${gridHeight}`">
                            <v-data-table :data='getData' :columns='columns'>
                                <template slot="td" slot-scope="props">
                                    <div v-if="props.column.field=='imgUrl'">
                                        <img :src="props.content" style="width:50px">
                                    </div>
                                    <span v-else v-html="props.content"></span>
                                </template>
                            </v-data-table>
                        </div>
                    </v-col>
                </v-row>
           </div>
           
        </v-modal>
    </v-content>
</template>

<script>
import api from '.././api.js'
import transform from "@/util/transform.js";
export default {
    name: "operate-normalorder-detail",
    props:['narmalVisible','orderId'],
    data() {
        return {
           showable:true,
            gridHeight:"500px",
            columns:[],
            ruleForm:{},
            orderMsg:{
                unit:'',
                orderCode:'' ,   //订单编号
                orderDetailId:'',   //订单ID
                transcationOrderId:'', //订单交易号
                orderType:'' ,   //订单类型
                orderCode:'',   //子订单号
                parentOrderCode:'', //父订单号
                userId:'',  //用户ID
                createdata:'',  //创建日期
                createTime:'',  //创建时间
                payType:'',       //付款方式
                shippingCost:'', //运费
                price:'',       //商品金额
                nickName:'',    //用户昵称
                productCount:'',    //商品数量
                shippingCost:'',    //邮费
                address:{},    //配送地址
                orderStatus:'',  //订单状态
                logistics: [],   //运单号
                shopKeeperBuy:'',   //是否自购
                platform:'',    //支付平台
                totalTax:'',    //消费税
                orderTotal:'',  //实付金额
                commissionPrice:'', //佣金抵扣金额
                commission:'',  //获取佣金
                productInfo:{
                    commission:'',  //佣金
                },
                store:{            //店铺
                    storeId:'', //店铺id
                    storeName:'',//店主昵称
                }
            }

        }
    },
    created() {
        this.showable = this.narmalVisible;
        this.columns = [
            { title: "商品sku", field: "skuIdErp" },
            { title: "商品图", field: "imgUrl" },
            { title: "销售价", field: "sellPrice" },
            { title: "数量", field: "productCount" },
            { title: "商品名称", field: "productName" },
            { title: "小计", field: "total" }, 
            // { title: "配送状态",field: "sendStatus"}
        ]
    },
    mounted() {
        
    },
    methods:{
        getData() {
            var _this = this;
            //console.log(_this.orderId)
            return _this.$http.get(api.get_detail_by_order,{
                params:{
                     id: _this.orderId
                }
            })
            .then( res => {
                //console.log('详情',res.data.)
                let result = transform.getDataTable({
                    items: res.data.productInfo
                });
                //console.log('result',result)
                _this.orderMsg.orderDetailId = res.data.orderDetailId;//订单ID
                _this.orderMsg.orderCode =  res.data.orderCode;//订单编号
                _this.orderMsg.transcationOrderId =  res.data.transcationOrderId;//订单交易号
                _this.orderMsg.parentOrderCode = res.data.parentOrderCode;//父订单号
                _this.orderMsg.userId = res.data.userId;//用户ID
                _this.orderMsg.payTime = res.data.payTime; //支付时间
                _this.orderMsg.price = res.data.price;//商品金额
                _this.orderMsg.shippingCost = res.data.shippingCost;    //运费
                _this.orderMsg.payType = res.data.payType;  //付款方式
                _this.orderMsg.platform = res.data.platform;
                _this.orderMsg.nickName = res.data.nickName;    //用户昵称
                _this.orderMsg.address = res.data.address;      //地址
                _this.orderMsg.productCount = res.data.productCount;  //商品数量
                _this.orderMsg.shopKeeperBuy = res.data.shopKeeperBuy;  //是否自购
                _this.orderMsg.orderTotal = res.data.orderTotal; //实付
                _this.orderMsg.totalTax = res.data.totalTax;    //消费税
                _this.orderMsg.unit = res.data.unit;    //美元符号
                _this.orderMsg.orderStatus = res.data.orderStatus;  //订单状态
                _this.orderMsg.commissionPrice = res.data.commissionPrice;  //佣金抵扣金额
                _this.orderMsg.commission = res.data.commission;  //获取佣金
                _this.orderMsg.store.storeId = res.data.store.storeId;
                _this.orderMsg.store.storeName = res.data.store.storeName;
                _this.orderMsg.orderType = res.data.orderType;//订单类型
                _this.orderMsg.logistics = res.data.logistics;
                return result;
            })
        },
        handleOk() {
           this.showable = false;
            this.$emit('changeBul',this.showable)
            console.log(1)
       },
       handleCancel() {
           this.showable = false;
           this.$emit('changeBul',this.showable)
       }
       
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./normalorder.less" lang="less"></style>

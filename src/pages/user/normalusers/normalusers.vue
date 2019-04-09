<template>
    <v-content class="user-normalusers-wrap">
        <v-form class="search-form" :model="ruleForm" ref="ruleForm">
            <v-row class="demo-row">
                <v-col span="24">
                    <v-form-item label="用户ID" prop="userId">
                        <v-input style="width: 150px;" v-model="ruleForm.userId" placeholder="请输入，以‘，’分隔"></v-input>
                    </v-form-item>
                     <v-form-item label="用户昵称" prop="nickname">
                        <v-input style="width: 100px;" v-model="ruleForm.nickname" placeholder="请输入"></v-input>
                    </v-form-item>
                     <v-form-item label="注册时间" prop="startTime">
                        <v-date-picker style="width: 100px;" placeholder="选择开始时间"  clearable show-time v-model="ruleForm.startTime"></v-date-picker>
                    </v-form-item>
                      <v-form-item label="到" prop="endTime">
                        <v-date-picker style="width: 100px;" placeholder="选择结束时间" clearable show-time v-model="ruleForm.endTime"></v-date-picker>
                    </v-form-item>
                      <v-form-item>
                        <v-button type="primary" html-type="button" @click="onSearch">查询</v-button>
                        <v-button type="ghost" @click.prevent="resetForm('ruleForm')">清空条件</v-button>
                    </v-form-item>
                </v-col>
            </v-row>  
        </v-form>
        <div class="data-gird" :style="`height:${gridHeight};text-align:left`">
             <v-data-table :data='getData' :currentData="cartlistData" :columns='columns'>
                <template slot="td" slot-scope="props">
                    <div v-if="props.column.field=='operation'">
                        <v-button type="primary" size="small" @click="showDetailmodel(props.item)">详情</v-button>
                    </div>
                    <div v-else-if="props.column.field=='headImgUrl'">
                        <img :src="props.content" style="width:50px" :key="props.content" >
                    </div>
                    <div v-else-if="props.column.field=='sex'">
                        <div v-if="props.content=='0'">未知</div>
                        <div v-if="props.content=='1'">男</div>
                        <div v-if="props.content=='2'">女</div>
                    </div>
                    <div v-else-if="props.column.field=='totalCommission'">
                        {{props.item.unit}}{{props.content}}   
                    </div>
                    <div v-else-if="props.column.field=='source'">
                        <div v-if="props.content=='1'">微信</div>
                        <div v-if="props.content=='2'">注册登陆</div>
                        <div v-if="props.content=='3'">Instagram</div>
                    </div>
                     <div v-else-if="props.column.field=='userType'">
                        <div v-if="props.content=='0'">普通用户</div>
                        <div v-if="props.content=='1'">店主</div>
                    </div>
                    <span v-else v-html="props.content"></span>
                </template>
            </v-data-table>
            <br>
            <v-col span="21">
                <v-pagination
                style="text-align:right;"
                size="small"
                show-quick-jumper
                :total="dataTotal"
                @change="pageChange"
                :value="currentPage"
                :show-total="showTotal"
                ></v-pagination>
            </v-col>
            <!-- <template   style="text-align:right;margin-top:10px" >
                <v-col span="20"></v-col>
                <v-col span="4">
                    <v-button style="text-align:right;" v-if="currentPage>1" @click="pageDec"><v-icon type="left"></v-icon></v-button>
                    <v-button style="text-align:right;" @click="pageAdd"><v-icon type="right"></v-icon></v-button>
                </v-col>
            </template> -->
        </div>
        <detail-user :detailVisible=detailVisible :listData=listData @changeBul="bulState"></detail-user>
    </v-content>
</template>

<script>
import api from "./api.js";
import transform from '@/util/transform.js'
import detailUser from "./detailUser/detailUser"  
export default {
    name: "user-normalusers",
    data() {
        return {
            currentPage:1,//当前页
            numsPerPage:10,//每页限制条数
            dataTotal:0,//总条数
            ruleForm:{
                userId:'',
                nickname:'',
                sex:'',
                userType:'',
                source:'',
                platform:'',
                startTime:'',
                endTime:''  
            },
            gridHeight:"500px",
            columns:[],
            detailVisible:false,
            listData:{},
            cartlistData:[],
            sex:[
                {
                    value:"0",
                    label:"全部"
                },
                {
                    value:"1",
                    label:"男"
                },
                {
                    value:"2",
                    label:"女"
                }
                ],
            regType:[
                {
                    value:"0",
                    label:"全部"
                },
                {
                    value:"1",
                    label:'微信'
                },
                {
                    value:"2",
                    label:'登陆注册'
                },
                    {
                    value:"3",
                    label:'Instagram'
                }
            ],
            regPlatform:[
                {
                    value:"0",
                    label:'全部'
                },
                {
                    value:"1",
                    label:'WAP'
                },
                {
                    value:"2",
                    label:'pc'
                }
            ],
             role:[
                    {
                        value:"0",
                        label:'普通用户'
                    },
                    {
                        value:"1",
                        label:'超级店主'
                    },
                ],
        }
    },
    created() {
        this.columns = [
            { title: "用户ID", field: "userId" },
            { title: "用户头像", field: "headImgUrl" },
            { title: "用户昵称", field: "nickname" },
            { title: "用户性别", field: "sex" },
            { title: "注册类型", field: "source" },
            { title: "注册平台", field: "platform" },
            { title: "注册时间",field: "createTime"},
            { title: "操作",field: "operation"}
        ]
    },
    mounted() {},
    methods:{
        resetForm(formName){
            this.$refs[formName].resetFields();
        },
        getData() {
            var _this = this;
            let userType = '0';
            return _this.$http.get(api.get_user_list,{
                params:{
                    userType:userType,
                    numsPerPage:_this.numsPerPage
                }
            }).then(res => {
                // console.log("res.data",res.data)//对象
                 _this.dataTotal = res.data.items.count;
                let result = transform.getDataTable({
                    items : res.data.items.data
                })
                //console.log(result)
                return result;
            })
        },
        //查询
        onFetchSearch(){
            let userType = '0';//普通用户
            let userId = this.ruleForm.userId;
            let nickname = this.ruleForm.nickname;
            let startTime = this.ruleForm.startTime;
            let endTime = this.ruleForm.endTime;
            let currentPage = this.currentPage;//当前页
            let numsPerPage = this.numsPerPage;//每页限制条数
            console.log(currentPage,numsPerPage)
            this.$http.get(api.get_user_list,{
                params: {
                    userId,
                    userType,
                    nickname,
                    startTime,
                    endTime,
                    currentPage,
                    numsPerPage,
                    // sex,
                    // source,
                    // platform,
                }
            })
            .then( res => {
                console.log('注册列表',res.data);
                this.cartlistData = res.data.items.data;
                this.dataTotal = res.data.items.count;
            })
        },
        showDetailmodel(obj) {
            this.detailVisible = true;
            this.listData = obj ;
        },
        bulState(data) {
            this.detailVisible = data;
        },
         onSearch(){
            this.currentPage = 1;
            this.onFetchSearch();
        },
        pageAdd(page){
            this.currentPage += 1;
            this.onFetchSearch();
        },
        pageDec(page){
            this.currentPage -= 1;
            this.onFetchSearch();
        },
        showTotal() {
            return `总共` + this.dataTotal + `条数据`;
        },
        pageChange(page) {
            this.currentPage = page;
            this.onFetchSearch();
            this.cartlistData=null;
        },
    },
    components: {
            detailUser
        }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./normalusers.less" lang="less"></style>

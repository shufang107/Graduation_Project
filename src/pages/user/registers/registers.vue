<template>
    <v-content class="user-registers-wrap">
        <div class="data-gird" :style="`height:${gridHeight};text-align:left`">
            <v-data-table :data='getData' :currentData="cartlistData" :columns='columns' ref="ruleData">
                <template slot="td" slot-scope="props">
                    <div v-if="props.column.field=='sex'">
                        <div v-if="props.content=='0'">未知</div>
                        <div v-if="props.content=='1'">男</div>
                        <div v-if="props.content=='2'">女</div>
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
        </div>
    </v-content>
</template>

<script>
import api from "./api.js";
import transform from '@/util/transform.js'
export default {
    name: "user-registers",
    data() {
        return {
            currentPage:1,//当前页
            numsPerPage:10,//每页限制条数
            dataTotal:0,//总条数
            detailVisible:false,
            listData:{},//用来props传给子组件
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
            sex:[
                {
                    value:"0",
                    label:"未知"
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
            gridHeight:"500px",
            columns:[],
            cartlistData:[]
        }
    },
    mounted() {},
    created(){
        this.columns = [
            { title: "时间", field: "userId" },
            { title: "数值", field: "nickname" },
            { title: "标准值", field: "sex" },
            { title: "差值", field: "userType" },
        ]
    },
    methods:{
        resetForm(formName){
            this.$refs[formName].resetFields();
        },
        getData() {
            // console.log('ziduan',Math.ceil(this.dataTotal/this.numsPerPage)) 
            var _this = this;
            return _this.$http.get(api.get_user_list,{
                params:{
                    currentPage:_this.currentPage,//当前页
                    numsPerPage:_this.numsPerPage,//每页限制条数
                }
            }).then(res => {
                //  console.log("res",res)//对象
                 _this.dataTotal = res.data.items.count;
                //  console.log( _this.dataTotal)
                let result = transform.getDataTable({
                    items : res.data.items.data
                });
                return result;
            });
        },
        onFetchSearch(){
            let userId = this.ruleForm.userId;
            let nickname = this.ruleForm.nickname;
            let sex = this.ruleForm.sex;
            let userType = this.ruleForm.userType;
            let source = this.ruleForm.source;
            let platform = this.ruleForm.platform;
            let startTime= this.ruleForm.startTime;
            let endTime= this.ruleForm.endTime; 
            let currentPage = this.currentPage;//当前页
            let numsPerPage = this.numsPerPage;//每页限制条数
            this.$http.get(api.get_user_list,{
                params: {
                    userId,
                    nickname,
                    sex,
                    userType,
                    source,
                    platform,
                    startTime,
                    endTime,
                    currentPage,
                    numsPerPage
                }
            })
            .then( res => {
                //console.log('注册列表',res.data);
                this.cartlistData = res.data.items.data;
                this.dataTotal = res.data.items.count;
            })
        },
        applyStore(item){
            //console.log('item',item.userId)
            var _this = this;
            _this.$modal.confirm({
                title: "您确认要设置" + item.userId + "为店主？",
                content: "",
                onOk: function() {
                    _this.$http.post(api.set_store,
                    {
                        userId:item.userId,
                    }
                    ).then( res => {
                        //console.log('res',res);
                        if (res.code == 0) {
                            _this.$message.success("设置成功!", 0.5);
                            _this.$refs.ruleData.reload();
                        } else {
                            _this.$message.error("设置失败!", 0.5);
                        }
                    })
                },
                onCancel: function() {}
            });
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
        // pageAdd(page){
        //     this.currentPage += 1;
        //     this.onFetchSearch();
        // },
        // pageDec(page){
        //     this.currentPage -= 1;
        //     this.onFetchSearch();
        // },
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
            // detailUser
        }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./registers.less" lang="less"></style>

<template>
    <v-content class="user-partners-wrap">
        <count-form
            :ruleForm='ruleForm'
            @updaydata='updaydata'
            @updayalldata='updayalldata'
            @downloadFile='downloadFile'
            @onSearch='onSearch'>
        </count-form>
        <br>
        <div class="data-gird" :style="`height:${gridHeight};text-align:left`">
            <v-data-table :data='getData' :currentData="cartlistData" :columns='columns'>
                <template slot="td" slot-scope="props">
                    <div v-if="props.column.field=='sex'">
                        <div v-if="props.content=='0'">未知</div>
                        <div v-if="props.content=='1'">男</div>
                        <div v-if="props.content=='2'">女</div>
                    </div>
                    <span v-else v-html="props.content"></span>
                </template>
            </v-data-table>
                <br>
            <v-col span="21">
                <v-pagination
                style="text-align:right;"
                show-quick-jumper
                size="small"
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
import CountForm from '@/components/count_form/countform'
export default {
    name: "user-partners",
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
                endTime:'',
                typeId:'',//店铺id
            },
            gridHeight:"500px",
            columns:[],
            detailVisible:false,
            listData:{},
            cartlistData:[],
        }
    },
    created() {
        this.columns = [
            { title: "时间", field: "userId" },
            { title: "数值", field: "typeId" },
            { title: "标准值", field: "nickname" },
            { title: "差值", field: "sex" },
        ]
    },
    mounted() {},
    methods:{
        updaydata(){

        },
        updayalldata(){

        },
        downloadFile(){

        },
        resetForm(formName){
            this.$refs[formName].resetFields();
        },
        getData() {
            var _this = this;
            let userType = '1';//合伙人
            return _this.$http.get(api.get_user_list,{
                params:{
                    userType:userType,
                    numsPerPage:_this.numsPerPage
                }
            }).then(res => {
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
            let userType = '1';//合伙人
            let userId = this.ruleForm.userId;
            let nickname = this.ruleForm.nickname;
            let typeId = this.ruleForm.typeId;
            let startTime = this.ruleForm.startTime;
            let endTime = this.ruleForm.endTime;
            let currentPage = this.currentPage;//当前页
            let numsPerPage = this.numsPerPage;//每页限制条数
            this.$http.get(api.get_user_list,{
                params: {
                    userId,
                    userType,
                    nickname,
                    startTime,
                    endTime,
                    typeId,
                    currentPage,
                    numsPerPage
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
            //console.log('obj',obj)
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
        CountForm:CountForm
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./partners.less" lang="less"></style>

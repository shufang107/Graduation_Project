<template>
    <v-content class="operate-detailUser-wrap">
        <v-modal :width="600" :title="listData.userType == '0'? '普通用户详情':'合伙人详情'" :visible="detailVisible" @ok="handleOk" @cancel="handleCancel">
            <div class="detail-content">
                <v-form >
                     <v-row>
                        <v-col span="8"  >
                            <div class="img-space">
                                <img style="height: 150px;" :src="listData.headImgUrl" alt="">
                            </div>
                        </v-col>
                        <v-col span="12" >
                            <div class="text-space">
                                <v-form-item label="用户ID" prop="">
                                    {{listData.userId}}
                                </v-form-item>
                                <br>  
                                <v-form-item label="用户昵称" prop="">
                                    {{listData.nickname}}
                                </v-form-item>
                                <br>   
                                <v-form-item label="用户性别" prop="">
                                    <span v-if="listData.sex == 0">未知</span>
                                    <span v-if="listData.sex == 1">男</span>
                                    <span v-if="listData.sex == 2">女</span>
                                </v-form-item>
                                <br>   
                                <v-form-item label="注册类型" prop="">
                                    <span v-if="listData.source == 1">微信</span>
                                    <span v-if="listData.source == 2">注册登陆</span>
                                    <span v-if="listData.source == 2">Instagram</span>
                                </v-form-item>
                                <br> 
                                <v-form-item label="注册平台" prop="">
                                    {{listData.platform}}
                                </v-form-item>
                                <br> 
                                <v-form-item label="注册时间" prop="">
                                    {{listData.createTime}}
                                </v-form-item>
                                <br> 
                                <v-form-item label="用户资产" prop="">
                                    {{listData.unit}}{{listData.totalCommission}}
                                </v-form-item>
                                <br> 
                            </div>
                        </v-col>
                    </v-row>
                </v-form> 
            </div>
        </v-modal>
    </v-content>
</template>

<script>
export default {
    name: "operate-detailUser-editad",
    props:['detailVisible','listData'],
    data() {
        return {
           showable:true,

        }
    },
    created() {
        this.showable = this.detailVisible;
        //console.log(this.detailVisible)
        
    },
    mounted() {
        
    },
    methods:{
        handleOk() {
           this.showable = false;
           //console.log('listData',this.listData.userType) 
            this.$emit('changeBul',this.showable)
       },
       handleCancel() {
           this.showable = false;
           this.$emit('changeBul',this.showable)
       }
       
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./detailUser.less" lang="less"></style>

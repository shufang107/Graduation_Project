<template>
    <v-form class="search-from" :model="ruleForm" ref="ruleForm">
        <v-row class="demo-row">
            <v-col span="18">
                <v-form-item label="开始时间"  prop="startTime">
                    <v-date-picker style="width: 100px;" placeholder="选择开始时间"  clearable v-model="ruleForm.startTime"></v-date-picker>
                </v-form-item>
                <v-form-item label="至" prop="endTime">
                    <v-date-picker style="width: 100px;" placeholder="选择结束时间" clearable v-model="ruleForm.endTime"></v-date-picker>
                </v-form-item>
                <v-form-item>
                    <v-button type="primary" @click="onSearch">查询</v-button>&nbsp;&nbsp;
                    <v-button type="ghost" @click.prevent="resetForm('ruleForm')">清空条件</v-button>&nbsp;&nbsp;
                    <v-button type="primary" @click="downloadFile">下载结果</v-button>&nbsp;&nbsp;
                    <v-button type="primary" @click="updaydata">更新当天数据</v-button>&nbsp;&nbsp;
                    <v-button type="primary" @click="updayalldata">更新全部数据</v-button>
                </v-form-item>
            </v-col>
        </v-row>
    </v-form>   
</template>

<script>
import request from "@/util/ajax.js";
import setting from "@/setting/index.js";
import transform from "@/util/transform.js";
import api from "./api.js";
export default {
    data(){
        return{
            ruleForm:{
                startTime:'',
                endTime:''
            } 
        }
    },
    props:{
        
    },
    methods:{
        //更新当天数据
        updaydata(){
            this.$emit('updaydata');
        },
        //更新所有数据
        updayalldata(){
            this.$emit('updayalldata');
        },
        //下载文件
        downloadFile(){
            this.$emit('downloadFile');
        },
        onSearch(){
            console.log(this.ruleForm);
            this.$emit('onSearch',this.ruleForm);
        },
        // //清空列表
        resetForm(formName){
            this.$refs[formName].resetFields();
        },
    }
}
</script>

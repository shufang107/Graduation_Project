<template>
    <v-content class="user-protrait-wrap">
        我是客户头像审批页面
        <br>
        <h1>{{testData}}</h1>
        
    </v-content>
</template>

<script>
export default {
    name: "user-protrait",
    data() {
        return {
            testData:''
        }
    },
    mounted() {
        this.getTest();
    },
    methods:{
        getTest(){
            var _this = this
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./portrait.less" lang="less"></style>

<template>
  <div class="operate-product-newadd-wrap">
    <v-modal
      class="modal-whole"
      title="活动添加"
      :width="1000"
      :visible="uploadVisible"
      @ok="handleOK"
      @cancel="handleCancel"
      style="position:relative"
    >
    <v-form-item>
        <v-upload :name="name" :action="action" @change="onChange">
            <v-button type="ghost">
                <v-icon type="upload"></v-icon>点击上传
            </v-button>
        </v-upload>
    </v-form-item>
    <div class="data-gird">
          <v-tabs class="newadd-tab" active-tab-key="key1">
            <v-tab-pane tab-key="key1" tab="成功商品">
              <div class="data-gird">
                <v-data-table :data="getData" :columns="suColumns" :currentData="sucurrentData">
                  <template slot="td" slot-scope="props">
                    <span  v-html="props.content"></span>
                  </template>
                </v-data-table>
              </div>
              <v-pagination
                style="text-align:right;margin-bottom:10px"
                show-quick-jumper
                :total="sudataTotal"
                :pageSize = 10
                :value = currentPage
                @change="pageChange"
                :show-total="showsuTotal"
              ></v-pagination>
            </v-tab-pane>
            <v-tab-pane tab-key="key2" tab="失效商品">
              <div class="data-gird">
                <v-data-table :data="getData" :columns="faColumns" :currentData="facurrentData">
                  <template slot="td" slot-scope="props">
                    <span  v-html="props.content"></span>
                  </template>
                </v-data-table>
              </div>
              <v-pagination
                style="text-align:right;margin-bottom:10px"
                show-quick-jumper
                :total="fadataTotal"
                :pageSize = 10
                :value = currentPage
                @change="pageChange"
                :show-total="showfaTotal"
              ></v-pagination> 
            </v-tab-pane>
          </v-tabs>
        </div>
 
    </v-modal>
  </div>
</template>


<script>
import api from ".././api.js";
import setting from "@/setting/index.js";
export default {
  props: ["uploadVisible"],
  data() {
    return {
        name: "file",
        action:setting.uploadactive,
        tempId:'',
        orderCode:'',
        commission:'',
        orderId: '',
        remark: '',
        message:'',
        source:'',
        status: '',
        storeId:'',
        userId:'',
        successlist:[],
        suColumns: [],
        faillist: [],
        faColumns:[],
        sudataTotal:0,
        fadataTotal:0,
        currentPage:1,
        sucurrentData:[],
        facurrentData:[]
    }
  },
  created() {
    (this.suColumns = [
      { title: "用户ID", field: "userId" },
      { title: "用户头像", field: "source" },
      { title: "店铺ID", field: "storeId" },
      { title: "奖励金额", field: "commission" },
      { title: "店铺ID", field: "storeId" },
      { title: "奖励金额", field: "commission" },
      { title: "status", field: "status" },
      { title: "备注", field: "remark" },
    ]),
    (this.faColumns = [
      { title: "用户ID", field: "userId" },
      { title: "用户头像", field: "source" },
      { title: "店铺ID", field: "storeId" },
      { title: "orderCode", field: "orderCode" },
      { title: "commission", field: "commission" },
      { title: "奖励金额", field: "commission" },
      { title: "status", field: "status" },
      { title: "备注", field: "remark" },
      { title: "失效信息", field: "message" },
    ]);
  },
  methods:{
      pageChange(page){
        this.currentPage = page;
        let pagenumend = page * 10;
        let pagenumsta = (page-1) * 10;
        this.sucurrentData = this.successlist.slice(pagenumsta,pagenumend);
      },
      handleOK () {
        this.$emit('close');
        let params = {
            tempId: this.tempId,
        };
        let _this = this;
        _this.$http.post(api.confirmupload, params)
        .then(res => {
          this.sudataTotal=0;
          this.fadataTotal=0;
            if (res.code === 0) {
                _this.$message.success("添加成功!", 0.5);
            }
        });
      },
      handleCancel () {
         this.$emit('close');
      },
      onChange(info) {
      let _this = this;
      if (info.file.status !== "uploading") {
      }
      if (info.file.status === "done") {
        _this.$message.success("上传成功!", 0.5);
        _this.msg = info.file.response.msg;
        console.log(_this.msg);
        if(_this.msg == "导入的 excel 的 sheet 名有误"){
          this.$message.error("导入的 excel 的 sheet 名有误", 0.5);
        }else if(_this.msg == "小鹿开小差了，请再试一次."){
          this.$message.error("小鹿开小差了，请再试一次.", 0.5);
        }else{
          _this.tempId = info.file.response.data.tempId;
          _this.successlist = info.file.response.data.successlist;
          _this.faillist = info.file.response.data.faillist;
          _this.sudataTotal = info.file.response.data.successlist.length;
          _this.fadataTotal = info.file.response.data.faillist.length;
          _this.sucurrentData = info.file.response.data.successlist.slice(0,9);
          _this.facurrentData = info.file.response.data.faillist.slice(0,9);
          console.log(_this.sudataTotal);
        }
      } else if (info.file.status === "error") {
        _this.$message.error("上传失败!", 0.5);
      }
    },
    showsuTotal() {
      return `总共` + this.sudataTotal + `条数据`;
    },
    showfaTotal() {
      return `总共` + this.fadataTotal + `条数据`;
    },
    getData() {
      let result = {
        result: []
        };
     return new Promise((resolve, reject) => {
        resolve(result);
      });
    }
}
}
</script>
<style src="./uploadactine.less" lang="less" scoped></style>
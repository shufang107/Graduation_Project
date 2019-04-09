<template>
  <div class="edit-account-wrap">
    <v-modal
      :title="title"
      :visible="addVisible"
      @ok="handleOk"
      @cancel="handleCancel"
      :style="'text-align:left'"
    >
      <v-form direction="horizontal" :model="ruleForm" :rules="ruleRules" ref="ruleRuleForm">
        <v-form-item
          label="规则中文名"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          prop="roleNameCn"
          has-feedback
        >
          <v-input type="input" size="large" v-model="ruleForm.roleNameCn"></v-input>
        </v-form-item>
        <v-form-item
          label="规则英文名"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          prop="roleNameEn"
          has-feedback
        >
          <v-input type="input" size="large" v-model="ruleForm.roleNameEn"></v-input>
        </v-form-item>
        <v-form-item
          label="专场ID"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          prop="collectionId"
          has-feedback
        >
          <v-input type="input" size="large" v-model="ruleForm.collectionId"></v-input>
        </v-form-item>
        <v-form-item
          label="满多少件"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          prop="minPiece"
          has-feedback
        >
          <v-input type="input" size="large" v-model="ruleForm.minPiece"></v-input>
        </v-form-item>
        <v-form-item
          label="价格"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          prop="minPrice"
          has-feedback
        >
          <v-input type="input" size="large" v-model="ruleForm.minPrice"></v-input>
        </v-form-item>
      </v-form>
    </v-modal>
  </div>
</template>



<script>
import api from "./../api.js";
export default {
  name: "add-rule",
  props: {
    addVisible: Boolean,
    ruledata: Object,
    // collectId: Array
  },
  watch: {
    ruledata: function(newRule, oldRule) {
      this.ruleForm.roleNameCn = newRule.roleNameCn;
      this.ruleForm.roleNameEn = newRule.roleNameEn;
      this.ruleForm.collectionId = newRule.collectionId;
      this.ruleForm.minPiece = newRule.minPiece;
      this.ruleForm.minPrice = newRule.minPrice;
      this.ruleForm.id = newRule.id;
      //console.log(this.ruleForm);
    }
  },
  data() {
    var validatePrice = (rule, value, callback) => {
      var value = parseFloat(value);
      //console.log('value',value)
      if (isNaN(value)) {
          callback(new Error('请输入正确的价格'));
      } else {
          if (value <= 0) {
              callback(new Error('请输入价格'));
          } else {
              callback();
          }
      }
    };
    var validatePiece = (rule, value, callback) => {
      var value = parseFloat(value);
      //console.log('value',value)
      if (isNaN(value)) {
          callback(new Error('请输入正确的件数'));
      } else {
          if (value < 2) {
              callback(new Error('件数不能小于2'));
          } else {
              callback()
          }
      }
    };
    return {
      allId:undefined,//
      itemId:undefined,
      title: "编辑规则",
      ruleForm: {
        id: "",
        roleNameCn: "",
        roleNameEn: "",
        collectionId: "",
        minPiece: "",
        minPrice: ""
      },
      ruleRules: {
        roleNameCn: [
          {
            required: true,
            message: "请输入规则中文名"
          }
        ],
        roleNameEn: [
          {
            required: true,
            message: "请输入规则英文名"
          }
        ],
        collectionId: [
          {
            required: true,
            message: "请输入专场ID"
          }
          // {
          //     validator: validateCollectId
          // }
        ],
        minPiece: [
          {
            required: true,
            message: "请输入件数"
          },
          {
              validator: validatePiece
          }
        ],
        minPrice: [
          {
            required: true,
            message: "请输入价格"
          },
          {
              validator: validatePrice
          }
        ]
      },
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      }
    };
  },
  created() {},
  methods: {
    handleOk() {
      if(this.ruleForm.collectionId == this.ruledata.collectionId){
          this.postData()
      }else{
          this.getAllId();//
      }
      
    },
    handleCancel() {
      // this.getCollectionId();
      
      this.$emit("cancleStat", false);
    },
    postData(){
        let _this = this;
        console.log('i')
        _this.$refs["ruleRuleForm"].validate(valid => {
        if (valid) {
          let roleNameCn = _this.ruleForm.roleNameCn;
          let roleNameEn = _this.ruleForm.roleNameEn;
          let collectionId = _this.ruleForm.collectionId;
          let minPiece = _this.ruleForm.minPiece;
          let minPrice = _this.ruleForm.minPrice;
          let id = _this.ruleForm.id;
          let options = {
            roleNameCn,
            roleNameEn,
            collectionId,
            minPiece,
            minPrice,
            id
          };
          let url = api.freepost_update;
          // console.log(options);
          _this.$http.post(url, options).then(res => {
            console.log('post',res)
            if (res.code == 0) {
              _this.$message.success("操作成功!", 0.5);
              _this.$refs["ruleRuleForm"].resetFields();
              _this.$emit("conformstat", false);
            } else {
              _this.$message.error("操作失败!", 0.5);
            }
          });
        } else {
          console.log("submit error !!!");
          return false;
        }
      });
    },
    //查询是否存在该ID
    getAllId(){
        var _this = this;
        //console.log(api.get_special)
        return _this.$http.get(api.get_special).then(res => {
            console.log(res.data.items)//数组
            for(let i = 0; i<res.data.items.length; i++){
              //如果存在该id
              //console.log(res.data.items[i].spId)
              if(res.data.items[i].spId == _this.ruleForm.collectionId){
                _this.allId = _this.ruleForm.collectionId;
              }
            }
            //console.log('id1',_this.allId)
            if(_this.allId != undefined){
                _this.allId = undefined;
                _this.getCollectionId();
            }else{
                _this.$message.error("该专场ID无效!", 1);
            }
        })
    },
    //查询列表是否已创建了ID
    getCollectionId() {
        var _this = this;
        return _this.$http.get(api.freepost_query).then(res => {
          for(let i = 0; i<res.data.length; i++){
              if(res.data[i].collectionId == _this.ruleForm.collectionId){
                _this.itemId = _this.ruleForm.collectionId;
              }
            }
            console.log('id2',_this.itemId)
            if(_this.itemId != undefined){
              _this.$message.error("该专场ID已存在!", 1);
              _this.itemId = undefined;
            } else {
              _this.postData();
            }
        });
    }
  }
};
</script>


<style scoped lang="less" src="./editrule.less">
</style>
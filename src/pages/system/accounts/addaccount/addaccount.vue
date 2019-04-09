<template>
  <div class="add-account-wrap">
    <v-modal
      title="添加账号"
      :visible="addVisible"
      @ok="handleOk"
      @cancel="handleCancel"
      :style="'text-align:left'"
    >
      <v-form direction="horizontal" :model="customForm" :rules="customRules" ref="customRuleForm">
        <v-form-item
          label="账号名称"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          prop="username"
          has-feedback
        >
          <v-input type="input" size="large" v-model="customForm.username"></v-input>
        </v-form-item>
        <v-form-item
          label="密码"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          prop="pass"
          has-feedback
        >
          <v-input type="password" size="large" v-model="customForm.pass"></v-input>
        </v-form-item>
        <v-form-item
          label="确认密码"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          prop="checkPass"
          has-feedback
        >
          <v-input type="password" size="large" v-model="customForm.checkPass"></v-input>
        </v-form-item>
        <v-form-item label="选择账号角色" :label-col="labelCol" :wrapper-col="wrapperCol">
          <v-select
            placeholder="请选择角色"
            v-model="customForm.selectRole"
            value="普通用户"
            style="width: 120px;"
            :data="options"
            @change="change"
          ></v-select>
        </v-form-item>
      </v-form>
    </v-modal>
  </div>
</template>



<script>
import api from "./../api.js";
import MD5 from '@/util/mdtools.js'
import formvalid from '@/util/formvalid.js'
//import MD5 from "md5.js";
export default {
  name: "add-account",
  props: ["addVisible"],
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.customForm.checkPass !== "") {
          this.$refs.customRuleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.customForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validateUserName = (rule, value, callback) =>{
      if(value === ""){
        callback(new Error("请输入账号名"));
      }else{
         if (formvalid.antiSqlValid(value)){
            callback(new Error("请您不要在参数中输入特殊字符和SQL关键字！"));
         }else{
           callback();
         }
      }

    }
    return {
      options: [
        {
          value: "普通用户",
          label: "普通用户"
        },
        {
          value: "管理员",
          label: "管理员"
        }
      ],
      customForm: {
        pass: "",
        checkPass: "",
        username: "",
        selectRole: ""
      },
      customRules: {
        username: [
          {
            required: true,
            message: "请输入账号名"
          },
          {
            validator: validateUserName
          }
        ],
        pass: [
          {
            required: true,
            message: "请输入密码"
          },
          {
            validator: validatePass
          }
        ],
        checkPass: [
          {
            required: true,
            message: "请再次输入密码"
          },
          {
            validator: validatePass2
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
      this.$refs["customRuleForm"].validate(valid => {
        let _this = this;
        if (valid) {
          let username = this.customForm.username; //用户名
          let pass = this.customForm.pass;
          let role = this.customForm.selectRole;
          if(role === ''){
             _this.$message.error("请选择角色", 0.5);
             return;
          }
           let passstr = MD5.getMD5(MD5.compileStr(pass));
          //let passstr = MD5.getMD5(pass);
          _this.$http
            .post(api.add_account, {
              name: username,
              password: passstr,
              accountRole: role
            })
            .then(res => {
               //console.log('回调',res);
              if (res.code == 0) {
                _this.$message.success("添加成功!", 0.5);
                this.$refs["customRuleForm"].resetFields();
                this.$emit("successBul", false);
              }else{
                 _this.$message.error(res.msg, 0.5);
              }
            });
        } else {
            _this.$message.error("submit error !!!", 0.5);
          console.log("submit error !!!");
          return false;
        }
      });
    },
    handleCancel() {
      console.log("handle cancle");
      this.$emit("changeBul", false);
    },
    change() {}
  }
};
</script>


<style scoped lang="less" src="./addaccount.less">
</style>
<template>
  <v-content class="login">
    <v-card title="欢迎登陆" class="login-con" :bordered="false">
      <div class="login-form">
        <v-form class="sub-form" direction="vertical">
          <v-form-item label>
            <v-input type="text" v-model="username" placeholder="用户名" size="large">
              <v-icon type="user" slot="before"></v-icon>
            </v-input>
          </v-form-item>
          <v-form-item label required>
            <v-input type="password" v-model="password" placeholder="密码" size="large">
              <v-icon type="lock" slot="before"></v-icon>
            </v-input>
          </v-form-item>
          <v-form-item style="margin-top:24px">
            <v-button class="login-button" @click="onLogin" type="primary">登陆</v-button>
          </v-form-item>
        </v-form>
      </div>
    </v-card>
  </v-content>
</template>

<script>
import MD5 from "@/util/mdtools.js";
import Cookie from "cookie.js";
import api from "./api.js";
export default {
  name: "page-login",
  data() {
    return {
      username: "",
      password: "",
      testData: "",
      pageHeight: "600px"
    };
  },
  created() {
    this.pageHeight = document.body.clientHeight + "px";
  },
  mounted() {
    this.getTest();
  },
  methods: {
    getTest() {
      var _this = this;
    },
    onLogin() {
      let _this = this;
      let username = this.username;
      let password = this.password;
      let passstr = MD5.getMD5(MD5.compileStr(password));
      //let passstr = MD5.getMD5(password);

      _this.$http
        .get(api.login, {
          params: {
            name: username,
            password: passstr
          }
        })
        .then(res => {
          console.log(res);
          let role = "";
          if (res.code === 0) {
            role = res.data.roleName;
            Cookie.set("username", username, {
              expires: new Date(
                Date.now() + 60 * 60 * 24 * 1000 * 30
              ).toLocaleString()
            });
            Cookie.set("password", MD5.strToHexCharCode(passstr), {
              expires: new Date(
                Date.now() + 60 * 60 * 24 * 1000 * 30
              ).toLocaleString()
            });
            Cookie.set("role", role, {
              expires: new Date(
                Date.now() + 60 * 60 * 24 * 1000 * 30
              ).toLocaleString()
            });
            _this.$message.success("登录成功!", 0.5);
            setTimeout(() => {
              _this.$router.push("/index");
            }, 1000);
          } else {
            _this.$message.error("登录失败:" + res.msg, 1);
          }
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./login.less" lang="less"></style>

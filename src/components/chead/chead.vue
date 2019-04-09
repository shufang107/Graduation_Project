<template>
  <div class="chead-wrap">
    <div class="chead-content">
      <div class="octopus-logo">
        <img src="/static/img/logo@2x.png" style="height:60px;width:100px;">
      </div>
      <div class="chead-top-menus">
        <v-menu mode="horizontal" :data="horizontalMnueData" theme="dark" @item-click="itemclick"></v-menu>
      </div>
      <div class="chead-text">
        <v-dropdown :data="dropdata" @item-click="dropClick" trigger="click">
          <a href="javascript:void(0)" class="ant-dropdown-link ant-dropdown-trigger">
            {{username}}
            <v-icon type="down"></v-icon>
          </a>
        </v-dropdown>
        <!-- <span>{{username}}</span> &nbsp; / &nbsp;
        <span @click="onLogout">登出</span>-->
      </div>
    </div>
  </div>
</template>

<script>
import menus from "@/data/topmenus";
import Cookie from "cookie.js";

export default {
  name: "chead",
  props: ["selected"],
  data() {
    return {
      username: "",
      defaultMenu: "home",
      horizontalMnueData: [],
      dropdata: [{ content: "登出" }]
    };
  },
  created() {
    let username = Cookie.get("username") || "";
    if(username == ""){
      this.$router.push('/login');
    }
    this.username = username;
    this.horizontalMnueData = menus.getMenu(this.selected);
  },
  methods: {
    //下拉菜单事件
    dropClick(item) {
      if (item.content === "登出") {
        Cookie.set("username", "");
        Cookie.set("password", "");
        Cookie.set("role", "");
        this.$router.push("/login");
      }
    },
    itemclick(index) {
      //console.log('head',index)
      this.$router.push(index[0].target);
    }
  }
};
</script>

<style scoped lang="less" src="./chead.less">
</style>

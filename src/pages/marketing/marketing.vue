<template>
  <div id="page-marketing">
    <com-head type="normal" selected="marketing"></com-head>
    <div id="components-layout-demo-side">
      <v-layout>
        <com-menu :menu="{menu}"></com-menu>
        <v-layout>
          <v-content :style="{ padding: '0 50px'}">
            <fade-transition :duration="500">
              <router-view keep-alive v-show="true"></router-view>
            </fade-transition>
          </v-content>
        </v-layout>
      </v-layout>
    </div>
  </div>
</template>

<script>
import comHead from "@/components/chead/chead";
import comMenu from "@/components/cmenu/cmenu";
import request from "@/util/ajax.js";
import { FadeTransition } from "vue2-transitions";
import transform from "@/util/transform.js";

export default {
  name: "user",
  data() {
    return {
      menu: {
        collapsed: false,
        menuData: [
          {
            name: "促销管理",
            // icon: "pay-circle-o",
            children: [
              {
                name: "营销配置",
                target: "/marketing/marketing-emailtask",
                selected: true
              }
            ]
          },
          {
            name: "活动管理",
            // icon: "pay-circle-o",
            children: [
              {
                name: "",
                target: "/marketing/marketing-activitymanagement",
                selected: false
              }
            ]
          }
        ]
      }
    };
  },
  created() {
    this.pageHeight = document.body.clientHeight - 85 + "px";
    this.menu.menuData = transform.menuTransStatus(this);
  },
  components: {
    comHead,
    comMenu,
    FadeTransition
  },
  methods: {},
  mounted() {}
};
</script>

<style src="./marketing.less" lang="less" scoped></style>

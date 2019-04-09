<template>
  <div id="page-count">
    <com-head type="normal" selected="count"></com-head>
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
  name: "count",
  data() {
    return {
      menu: {
        collapsed: false,
        menuData: [
          {
            name: "温度",
            icon: "pay-circle-o",
            children: [
              {
                name: "实时数据",
                target: "/count/count-shopownerenroll",
                selected: true
              },
              {
                name: "历史数据",
                target: "/count/count-orderdata",
                selected: false
              },
              {
                name: "数据曲线",
                target: "/count/count-salesdata",
                selected: false
              },
            ]
          },
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

<style src="./count.less" lang="less" scoped></style>

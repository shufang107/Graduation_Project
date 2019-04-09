<template>
  <div id="app">
    <fade-transition :duration="0">
      <router-view v-show="true" keep-alive></router-view>
    </fade-transition>
  </div>
</template>

<script>
import { FadeTransition } from "vue2-transitions";
export default {
  name: "app",
  components: {
    FadeTransition
  }
};
</script>

<style>
#app, body, html {
    width: 100%;
    height: 100%;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body {
  margin: 0;
}
html,
body {
  font-size: 14px;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}
a {
  text-decoration: none;
}
a:link {
  text-decoration: none;
}
a:visited {
  text-decoration: none;
}
a:hover {
  text-decoration: none;
}
a:active {
  text-decoration: none;
}
#app .ant-menu.ant-menu-dark .ant-menu-item-selected {
  background-color: #61b3e6;
  border-radius: 20px;
}
.ant-layout-content {
  padding: 0px 20px !important;
}
</style>

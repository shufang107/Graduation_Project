<template>
  <div class="cmenu-wrap">
    <v-sider v-model="collapsed" :style="`height:${pageHeight};width:150px;`">
      <v-menu theme="light" :expand="true" :mode="collapsed?'vertical':'inline'" :data="menuData" @item-click="itemClick">
        <template slot-scope="{data}">
          <i v-if="data.icon" :class="'anticon anticon-' + data.icon"></i>
          <span :class="{'nav-text':data.icon}">{{data.name}}</span>
        </template>
        <template slot-scope="{data}" slot="sub">
          <i v-if="data.icon" :class="'anticon anticon-' + data.icon"></i>
          <span class="nav-text">{{data.name}}</span>
        </template>
      </v-menu>
    </v-sider> 
  </div>
</template>



<script>
export default {
  name: "cmenu",
  props: {
    menu: Object
  },
  data() {
    return {
      pageHeight: "600px",
      menuData: [],
      collapsed: true
    };
  },
  created() {
    let menu = this.menu.menu;
    this.menuData =menu.menuData;
    this.collapsed = menu.collapsed;
    this.pageHeight = document.body.clientHeight - 85 + "px";
  },
  methods: {
      itemClick(item){
          //console.log('item',item);
          let itemobj = item[item.length - 1];
          //console.log('itemobj',itemobj);
          this.$router.push(itemobj.target);
      }
  }
};
</script>


<style scoped lang="less" src="./cmenu.less">
</style>
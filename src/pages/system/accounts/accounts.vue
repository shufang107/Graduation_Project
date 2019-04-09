<template>
  <v-content class="system-accounts-wrap">
    <v-form class="search-form">
      <v-form-item label="账号名称">
        <v-input placeholder="请输入账号名称" v-model="searchName"></v-input>
      </v-form-item>
      <v-form-item>
        <v-button type="primary" html-type="button" @click="searchData">查询</v-button>
      </v-form-item>
      <v-form-item>
        <v-button v-if="isAdmin === true" type="primary" html-type="button" @click="addAccount">添加</v-button>
      </v-form-item>
    </v-form>

    <div class="data-gird" :style="`height:${gridHeight};width:${gridWidth};text-align:left`">
      <v-data-table
        ref="accountTable"
        :data="getData"
        :currentData="listData"
        :columns="columns"
        :emptyText="'没有找到您想要的信息......'"
      >
        <template v-if="isAdmin === true" slot="th" slot-scope="props">
          <strong v-if="props.column.field=='album'">操作</strong>
          <strong v-else v-html="props.title"></strong>
        </template>
        <template v-if="isAdmin === true" slot="td" slot-scope="props">
          <div v-if="props.column.field=='album'">
            <v-button type="primary" size="small" @click="deleteaccount(props.item)">删除</v-button>
          </div>
          <span v-else v-html="props.content"></span>
        </template>
      </v-data-table>
    </div>
       <v-pagination
        style="text-align:right;"
        show-quick-jumper
        :total="dataTotal"
        @change="pageChange"
        :value="currentPage"
      ></v-pagination>
    <add-account :addVisible="addVisible" @changeBul="bulState" @successBul="suState"></add-account>
  </v-content>
</template>
<script>
import api from "./api.js";
import transform from "@/util/transform.js";
import addAccount from "./addaccount/addaccount";
import Cookie from "cookie.js";
export default {
  name: "system-accounts",
  data() {
    return {
      isAdmin: false,
      testData: "",
      searchName: "",
      addVisible: false,
      gridHeight: "500px",
      gridWidth: "900px",
      listData: [],
      columns: [],
      dataTotal: 0, //数据总数
      currentPage: 1,
      numsPerPage: 10
    };
  },
  components: {
    addAccount
  },

  created() {
    this.gridHeight = document.body.clientHeight - 250 + "px";
    this.gridWidth = document.body.clientwidth - 230 + "px";
    this.columns = [
      { title: "账号ID", field: "id" },
      { title: "账号名称", field: "name" },
      { title: "账号角色", field: "roleName" },
      { title: "操作", field: "album" }
    ];
    let role = Cookie.get("role") || "";
    if (role === "超级管理员") {
      this.isAdmin = true;
    } else if (role === "管理员") {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  },
  mounted() {},
  methods: {
    suState(data) {
      //弹窗确定
      console.log("data2", data);
      this.addVisible = data;
      this.$refs.accountTable.reload();
    },
    bulState(data) {
      //弹窗取消
      this.addVisible = data;
    },
    //分页点击触发方法
    pageChange(page) {
      let _this = this;
      _this.currentPage = page;
      _this.getData();
    },
    searchData() {
      //搜索账号数据
      this.pageChange(1);
    },
    addAccount() {
      //添加账号数据
      this.addVisible = true;
    },
    getData() {
      //获取列表数据
      var _this = this;
      let name = _this.searchName;
        //根据账号名称，查询数据表
        return _this.$http
          .get(api.account_queryList, {
            params: {
              name,
              currentPage: _this.currentPage,
              numsPerPage: _this.numsPerPage
            }
          })
          .then(res => {
            //console.log('res.data',res.data)//返回数组
            if (res.code === 0) {
              let items = res.data.items;
              console.log(items);
              _this.dataTotal = res.data.count || 1;
               let result = transform.getDataTable({
               items:items
              });
              //console.log("result",result)
              _this.listData = result.result; //查询到后，赋值给listData，然后再重新渲染列表
            }
          });
  
    },
    deleteaccount(obj) {
      //删除账号数据
      //console.log('obj',obj);
      let _this = this;
      _this.$modal.confirm({
        title: "账号删除确认",
        content: "确认要删除当前账号么？",
        onOk: function() {
          console.log("确定");
          _this.$http
            .post(api.del_account, {
              id: obj.id,
              name: obj.name
            })
            .then(res => {
              if (res.code == 0) {
                _this.$message.success("删除成功!", 0.5);
                _this.$refs.accountTable.reload();
              }
            });
        },
        onCancel: function() {}
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./accounts.less" lang="less"></style>

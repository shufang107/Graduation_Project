<template>
  <v-content class="operate-advertisement-wrap">
    <div style="text-align:left">
      <v-button
        v-if="adLength==5"
        type="primary"
        style="margin-bottom:10px;"
        @click="showModel"
        disabled
      >添加广告</v-button>
      <v-button v-else type="primary" style="margin-bottom:10px;" @click="showModel">添加广告</v-button>
    </div>
    <div class="data-table" :style="`height:${gridHeight};width:${gridWidth}`">
      <v-data-table :data="loadData" :columns="columns" ref="cartBottomTable">
        <template slot="td" slot-scope="props">
          <div v-if="props.column.field=='adImageCn'">
            <div style="width:137.2px;height:64px;overflow:hidden; text-align:center;">
              <img :src="props.content" width="137.2px" height="64px" :key="props.content" alt>
            </div>
          </div>
          <div v-else-if="props.column.field=='adImageEn'">
            <div style="width:137.2px;height:64px;overflow:hidden; text-align:center;">
              <img :src="props.content" width="137.2px" height="64px" :key="props.content" alt>
            </div>
          </div>
          <div v-else-if="props.column.field=='adOperat'">
            <div v-if="props.item.adStatus=='0'">
              <v-button type="primary" size="small" @click="online(props.item)">上线</v-button>
              <v-button type="primary" size="small" @click="offline(props.item)" disabled>下线</v-button>
              <v-button type="primary" size="small" @click="showEditmodel(props.item)">编辑</v-button>
            </div>
            <div v-if="props.item.adStatus=='1'">
              <v-button type="primary" size="small" @click="online(props.item)" disabled>上线</v-button>
              <v-button type="primary" size="small" @click="offline(props.item)">下线</v-button>
              <v-button type="primary" size="small" @click="showEditmodel(props.item)" disabled>编辑</v-button>
            </div>
            <div v-if="props.item.adStatus=='2'">
              <v-button type="primary" size="small" @click="online(props.item)">上线</v-button>
              <v-button type="primary" size="small" @click="offline(props.item)" disabled>下线</v-button>
              <v-button type="primary" size="small" @click="showEditmodel(props.item)">编辑</v-button>
            </div>
          </div>
          <div v-else-if="props.column.field=='adStatus'">
            <div v-if="props.content=='0'">待发布</div>
            <div v-if="props.content=='1'">上线</div>
            <div v-if="props.content=='2'">下线</div>
          </div>
          <div v-else-if="props.column.field=='adCollectionScope'">
            <div v-if="props.content=='0'">全部</div>
            <div v-if="props.content=='1'">B端</div>
            <div v-if="props.content=='2'">C端</div>
          </div>
          <div v-else-if="props.column.field=='adCollectionHref'">
            <a :href="props.content" target="#">链接</a>
          </div>
          <div v-else-if="props.column.field=='adTime'">
            {{props.item.advertisement_start_time}}
            <br>
            <span>-</span>
            <br>
            {{props.item.advertisement_end_time}}
          </div>
          <span v-else v-html="props.content"></span>
        </template>
      </v-data-table>
    </div>
    <add-ad :addVisible="addVisible" @changeBul="bulState"></add-ad>
    <edit-ad :editVisible="editVisible" :ruleForm="ruleForm" @changeBul="bulState"></edit-ad>
  </v-content>
</template>

<script>
import api from "./api.js";
import transform from "@/util/transform.js";
import addAd from "./addad/addad";
import editAd from "./editad/editad";
import moment from "moment";
export default {
  name: "operate-advertisement",
  data() {
    return {
      addVisible: false,
      editVisible: false,
      gridHeight: "500px",
      gridWidth: "800px",
      adLength: "",
      columns: [],
      ruleForm: {
        advertisementImageCn: "",
        advertisementImageEn: "",
        advertisementTitleCn: "",
        advertisementTitleEn: "",
        advertisementCollectionHref: "",
        advertisementStartTime: "",
        advertisementEndTime: "",
        advertisementScope: "",
        advertisementWeight: ""
      }
    };
  },
  created() {
    this.gridHeight = document.body.clientHeight - 160 + "px";
    this.gridWidth = document.body.clientWidth - 230 + "px";
  },
  mounted() {
    this.columns = [
      { title: "广告ID", field: "adId" },
      { title: "广告中文图片", field: "adImageCn" },
      { title: "广告英文图片", field: "adImageEn" },
      { title: "广告中文名称", field: "adTitleCn" },
      { title: "广告英文名称", field: "adTitleEn" },
      { title: "状态", field: "adStatus" },
      { title: "范围", field: "adCollectionScope" },
      { title: "广告跳转地址", field: "adCollectionHref" },
      { title: "广告时间", field: "adTime" },
      { title: "广告权重", field: "adCollectionWeight" },
      { title: "操作", field: "adOperat" }
    ];
  },
  methods: {
    loadData() {
      var _this = this;
      return _this.$http.get(api.query_all_advertisement).then(res => {
        let ary = res.data.items;
        _this.adLength = ary.length;
        console.log(ary);
        //时间格式转化
        let newarr = [];
        for (let i = 0; i < ary.length; i++) {
          ary[i]["advertisement_start_time"] = moment(
            ary[i].adStartTime
          ).format("YYYY-MM-DD HH:mm:ss");
          ary[i]["advertisement_end_time"] = moment(ary[i].adEndTime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        }
        let result = transform.getDataTable({
          items: ary
        });
        //console.log(result)
        //_this.startTime = result.result.advertisement_start_time
        return result;
      });
    },
    dateForm(time) {
      //时间格式转化
      var dateee = new Date(time).toJSON();
      var date = new Date(+new Date(dateee) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
      return date;
    },
    showModel() {
      this.addVisible = true;
    },
    showEditmodel(item) {
      this.editVisible = true;
      //console.log('item.adCollectionScope',item.adCollectionScope);
      let advertisementId = item.adId;
      let advertisementImageCn = item.adImageCn;
      let advertisementImageEn = item.adImageEn;
      let advertisementTitleCn = item.adTitleCn;
      let advertisementTitleEn = item.adTitleEn;
      let advertisementCollectionHref = item.adCollectionHref;
      let advertisementStartTime = item.advertisement_start_time;
      let advertisementEndTime = item.advertisement_end_time;
      let advertisementScope = item.adCollectionScope;
      let advertisementWeight = item.adCollectionWeight;
      this.ruleForm = {
        advertisementId,
        advertisementImageCn,
        advertisementImageEn,
        advertisementTitleCn,
        advertisementTitleEn,
        advertisementCollectionHref,
        advertisementStartTime,
        advertisementEndTime,
        advertisementScope,
        advertisementWeight
      };
      //console.log('advertisementScope',advertisementScope)
    },
    bulState(data) {
      this.addVisible = data;
      this.editVisible = data;
      this.$refs.cartBottomTable.reload();
    },
    online(item) {
      //console.log(obj)
      var _this = this;
      let onlineText = item.adId;
      _this.$modal.confirm({
        title: "您确认要上线广告" + onlineText + "？",
        content: "",
        onOk: function() {
          _this.$http
            .post(api.online, {
              advertisementId: item.adId
            })
            .then(res => {
              if (res.code == 0) {
                _this.$message.success("发布成功!", 0.5);
                _this.$refs.cartBottomTable.reload();
              } else {
                _this.$message.error("发布失败!", 0.5);
              }
            });
        },
        onCancel: function() {}
      });
    },
    offline(item) {
      var _this = this;
      let onlineText = item.adId;
      _this.$modal.confirm({
        title: "您确认要下线广告" + onlineText + "？",
        content: "",
        onOk: function() {
          _this.$http
            .post(api.offline, {
              advertisementId: item.adId
            })
            .then(res => {
              if (res.code == 0) {
                _this.$message.success("下线成功!", 0.5);
                _this.$refs.cartBottomTable.reload();
              } else {
                _this.$message.error("下线失败!", 0.5);
              }
            });
        },
        onCancel: function() {}
      });
    }
  },
  components: {
    addAd,
    editAd
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./advertisement.less" lang="less"></style>

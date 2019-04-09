<template>
  <v-content class="operate-advertisement-addad-wrap">
    <v-modal :width="890" title="添加广告" :visible="addVisible" @ok="handleOk" @cancel="handleCancel">
      <v-form class="add-form" :model="ruleForm" :rules="ruleRules" ref="ruleRuleForm">
        <v-row>
          <v-form-item label="广告中文名称" prop="advertisementTitleCn">
            <v-input
              class="add-input"
              v-model="ruleForm.advertisementTitleCn"
              placeholder="请输入广告中文名称"
            ></v-input>
          </v-form-item>
          <v-form-item label="广告英文名称" prop="advertisementTitleEn">
            <v-input
              class="add-input"
              v-model="ruleForm.advertisementTitleEn"
              placeholder="请输入广告英文名称"
            ></v-input>
          </v-form-item>
        </v-row>
        <v-row>
          <v-row>
            <v-col span="12">
              <v-form-item label="广告中文图片地址(686px*320px)" prop="advertisementImageCn">
                <v-input
                  class="add-input"
                  v-model="ruleForm.advertisementImageCn"
                  placeholder="请输入广告中文图片地址"
                ></v-input>
              </v-form-item>
            </v-col>
            <v-col span="12">
              <img style="width : 155px" :src="ruleForm.advertisementImageCn" alt>
            </v-col>
          </v-row>
          <v-row>
            <v-row>
              <v-col span="12">
                <v-form-item label="广告英文图片地址(686px*320px)" prop="advertisementImageEn">
                  <v-input
                    class="add-input"
                    v-model="ruleForm.advertisementImageEn"
                    placeholder="请输入广告英文图片地址"
                  ></v-input>
                </v-form-item>
              </v-col>
              <v-col span="12">
                <img style="width : 155px" :src="ruleForm.advertisementImageEn" alt>
              </v-col>
            </v-row>
          </v-row>
        </v-row>
        <v-row>
          <v-form-item label="广告链接地址" prop="advertisementCollectionHref">
            <v-input
              style="width:700px"
              v-model="ruleForm.advertisementCollectionHref"
              placeholder="请输入广告链接地址"
            ></v-input>
          </v-form-item>
        </v-row>
        <v-row>
          <v-col span="12">
            <v-form-item label="广告开始时间" prop="advertisementStartTime">
              <v-date-picker clearable v-model="ruleForm.advertisementStartTime" show-time></v-date-picker>
            </v-form-item>
          </v-col>
          <v-col span="12">
            <v-form-item label="广告结束时间" prop="advertisementEndTime">
              <v-date-picker
                clearable
                v-model="ruleForm.advertisementEndTime"
                show-time
                :disabled-date="disabledDate"
                :disabled-time="disabledTime()"
              ></v-date-picker>
            </v-form-item>
          </v-col>
        </v-row>
        <v-row>
          <v-col span="12">
            <v-form-item label="广告权重" prop="advertisementWeight">
              <v-input
                class="add-input"
                v-model="ruleForm.advertisementWeight"
                placeholder="请输入广告权重"
              ></v-input>
            </v-form-item>
          </v-col>
          <v-col span="12">
            <v-form-item label="影响范围" prop="advertisementScope">
              <v-select
                placement="top"
                v-model="ruleForm.advertisementScope"
                style="width: 120px;"
                :data="options"
                value="1"
              ></v-select>
            </v-form-item>
          </v-col>
        </v-row>
      </v-form>
    </v-modal>
  </v-content>
</template>

<script>
import api from ".././api.js";
import moment from "moment";
export default {
  name: "operate-advertisement-addad",
  props: ["addVisible"],
  data() {
    return {
      timeStatus: false, //用来判断开始时间状态
      showable: true,
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
      },
      ruleRules: {
        advertisementImageCn: [
          {
            required: true,
            message: "请输入中文图片"
          }
        ],
        advertisementImageEn: [
          {
            required: true,
            message: "请输入英文图片"
          }
        ],
        advertisementTitleCn: [
          {
            required: true,
            message: "请输入中文名称"
          }
        ],
        advertisementTitleEn: [
          {
            required: true,
            message: "请输入英文名称"
          }
        ],
        advertisementStartTime: [
          {
            required: true,
            message: "请输入开始时间"
          }
        ],
        advertisementEndTime: [
          {
            required: true,
            message: "请输入结束时间"
          }
        ],
        advertisementScope: [
          {
            required: true,
            message: "请输入影响范围"
          }
        ],
        advertisementWeight: [
          {
            required: true,
            message: "请输入权重"
          }
        ]
      },
      options: [
        {
          value: 0,
          label: "全部"
        },
        {
          value: 1,
          label: "B端"
        },
        {
          value: 2,
          label: "C端"
        }
      ]
    };
  },
  created() {
    this.showable = this.addVisible;
  },
  mounted() {},
  methods: {
    handleOk() {
      //console.log(this.ruleForm)
      let _this = this;
      _this.$refs["ruleRuleForm"].validate(valid => {
        if (valid) {
          let advertisementImageCn = _this.ruleForm.advertisementImageCn;
          let advertisementImageEn = _this.ruleForm.advertisementImageEn;
          let advertisementTitleCn = _this.ruleForm.advertisementTitleCn;
          let advertisementTitleEn = _this.ruleForm.advertisementTitleEn;
          let advertisementCollectionHref =
            _this.ruleForm.advertisementCollectionHref;
          let advertisementStartTime = _this.ruleForm.advertisementStartTime;
          let advertisementEndTime = _this.ruleForm.advertisementEndTime;
          let advertisementScope = _this.ruleForm.advertisementScope;
          let advertisementWeight = _this.ruleForm.advertisementWeight;
          let options = {
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
          let url = api.add_advertisement;
          // console.log(url)；
          _this.$http.post(url, options).then(res => {
            //console.log(res)
            if (res.code == 0) {
              _this.$message.success("操作成功!", 0.5);
              _this.$refs["ruleRuleForm"].resetFields();
              _this.$emit("changeBul", false);
            } else {
              _this.$message.error("操作失败!", 0.5);
            }
          });
        } else {
          console.log("submit error !!!");
          return false;
        }
      });
      _this.showable = false;
    },
    handleCancel() {
      this.showable = false;
      this.$emit("changeBul", this.showable);
    },
    range(start, end) {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    },
    //日期限制
    disabledDate(current) {
      return current && current.valueOf() < Date.now() - 86400000 * 2;
    },
    //时间限制
    disabledTime() {
      //console.log('1',i)
      var myDate = new Date();
      return [
        {
          disabledHours: h =>
            this.range(0, 24)
              .splice(0, myDate.getHours())
              .includes(h),
          disabledMinutes: m =>
            this.range(0, 60)
              .splice(0, myDate.getMinutes())
              .includes(m)
        }
      ];
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./addad.less" lang="less"></style>

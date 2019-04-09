<template>
  <v-content class="teamRule-wrap">
    <!-- 拉新奖励设置 -->
    <v-card title="拉新奖励设置">
      <v-form>
        <v-row>
          <v-col span="4">开关：</v-col>
          <v-col span="20" style="text-align:left">
            <v-radio-group v-model="peopleReward.radioValue1" :data="peopleReward.radioOptions"></v-radio-group>
          </v-col>
        </v-row>
        <v-row style="margin-top:20px">
          <v-col span="4">阶梯设置:</v-col>
          <v-col span="20" style="text-align:left">
            <div v-for="(item, index) in peopleReward.stepConfigs" :key="index">
              <span>邀请人数</span>&nbsp;&nbsp;
              <v-input-number :min="1" :max="10000" v-model="item.minValue"></v-input-number>
              <span>≤ N＜</span>&nbsp;&nbsp;
              <v-input-number :min="1" :max="10000" v-model="item.maxValue"></v-input-number>
              <span>奖励金额/人：USD</span>&nbsp;&nbsp;
              <v-input-number :min="1" :max="10000" v-model="item.reward"></v-input-number>
              <v-button type="primary" size="small" @click="onDelStep(item)">删除</v-button>
            </div>
          </v-col>
        </v-row>
        <v-row style="margin-top:20px;text-algin:left">
          <v-col span="4">
            <v-button type="default" @click="addStepConfig">新增</v-button>
          </v-col>
          <v-col span="20" style="text-align:left"></v-col>
        </v-row>
        <v-row style="margin-top:20px;text-algin:left">
          <v-col span="4">
            <v-button type="primary" @click="onSavePeopleReward">保存</v-button>
          </v-col>
          <v-col span="20" style="text-align:left"></v-col>
        </v-row>
      </v-form>
    </v-card>

    <!-- 开单奖励设置 -->
    <v-card title="开单奖励设置" style="margin-top:20px">
      <v-row>
        <v-col span="4">开关：</v-col>
        <v-col span="20" style="text-align:left">
          <v-radio-group v-model="orderReward.radioValue1" :data="orderReward.radioOptions"></v-radio-group>
        </v-col>
      </v-row>
      <v-row style="margin-top:20px">
        <v-col span="4">下单店主开单:</v-col>
        <v-col span="20" style="text-align:left">
          <div>
            <v-input-number :min="0" :max="10000" v-model="orderReward.stepConfigs[0].minValue"></v-input-number>
            <span>单</span>&nbsp;&nbsp;
            <span>上级店主获得奖励：USD</span>&nbsp;&nbsp;&nbsp;&nbsp;
            <v-input-number :min="0" :max="10000" v-model="orderReward.stepConfigs[0].reward"></v-input-number>
          </div>
        </v-col>
      </v-row>
      <v-row style="margin-top:20px;text-algin:left">
        <v-col span="4">
          <v-button type="primary" @click="onSaveOrderReward">保存</v-button>
        </v-col>
        <v-col span="20" style="text-align:left"></v-col>
      </v-row>
    </v-card>

    <!-- 裂变设置 -->
    <v-card title="裂变设置" style="margin-top:20px">
      <v-row>
        <v-col span="4">开关：</v-col>
        <v-col span="20" style="text-align:left">
          <v-radio-group v-model="fissionReward.radioValue1" :data="fissionReward.radioOptions"></v-radio-group>
        </v-col>
      </v-row>
      <v-row style="margin-top:20px">
        <v-col span="4">佣金比例:</v-col>
        <v-col span="20" style="text-align:left">
          <div>
            <span>一级佣金比例</span>&nbsp;&nbsp;&nbsp;&nbsp;
            <v-input-number :min="1" :max="1000" v-model="fissionReward.stepConfigs[0].minValue"></v-input-number>
            <span>%</span>
          </div>
        </v-col>
      </v-row>
      <v-row style="margin-top:20px;text-algin:left">
        <v-col span="4">
          <v-button type="primary" @click="onSaveFissionReward">保存</v-button>
        </v-col>
        <v-col span="20" style="text-align:left"></v-col>
      </v-row>
    </v-card>
    
    <!-- 新店主注册奖励规则 -->
    <!-- <v-card title="新店主注册奖励规则" style="margin-top:20px">
      <v-row>
        <v-col span="4">开关:</v-col>
        <v-col span="20" style="text-align:left">

          <v-radio-group v-model="newusersigninreward.radioValue1" :data="newusersigninreward.radioOptions"></v-radio-group>
        </v-col>
      </v-row>
      <v-row style="margin-top:20px">
        <v-col span="3" style="text-align:right">
          <span>奖励金额：USD</span>&nbsp;&nbsp;&nbsp;&nbsp;
        </v-col>
        <v-col span="2" style="text-align:right">
          <v-input v-model="newusersigninreward.stepConfigs[0].reward"></v-input>
        </v-col>
      </v-row>
      <v-row style="margin-top:20px;text-algin:left">
        <v-col span="4">
          <v-button type="primary" @click="onnewusersigninreward">保存</v-button>
        </v-col>
        <v-col span="20" style="text-align:left"></v-col>
      </v-row>
    </v-card>
    <br> -->

  </v-content>
</template>

<script>
import api from "./api.js";
import transform from "@/util/transform.js";
export default {
  data() {
    return {
      peopleReward: {
        radioOptions: [{ value: 0, text: "开" }, { value: 1, text: "关" }],
        radioValue1: 0,
        stepConfigs: []
      },
      orderReward: {
        radioOptions: [{ value: 0, text: "开" }, { value: 1, text: "关" }],
        radioValue1: 0,
        stepConfigs: [
          {
            minValue: 1,
            maxValue: 10,
            reward: 10,
            is_deleted: 0
          }
        ]
      },
      fissionReward: {
        radioOptions: [{ value: 0, text: "开" }, { value: 1, text: "关" }],
        radioValue1: 0,
        stepConfigs: [
          {
            minValue: 1,
            maxValue: 10,
            reward: 10,
            is_deleted: 0
          }
        ]
      },
      newusersigninreward: {
        radioOptions:[{ value: 0,text: "开" },{ value: 1,text: "关"}],
        radioValue1:1,
        stepConfigs: [
          {
            reward: 10,
            is_deleted: 0
          }
        ]
      }
    };
  },
  mounted() {},
  created() {
    let _this = this;
    //获取拉新奖励设置
    _this.$http
      .get(api.query_team_rule, {
        params: {
          ruleName: "new_people_reward"
        }
      })
      .then(res => {
        if (res && res.data && res.data.rule) {
          //let items = JSON.parse(res.data.rule);
          let items = res.data.rule;
          _this.peopleReward.stepConfigs = items;
          _this.peopleReward.radioValue1 = res.data.isOpen;
        }
      });

    //获取开单奖励设置
    _this.$http
      .get(api.query_team_rule, {
        params: {
          ruleName: "new_order_reward"
        }
      })
      .then(res => {
        if (res && res.data && res.data.rule) {
          //_this.orderReward.stepConfigs = JSON.parse(res.data.rule);
           _this.orderReward.stepConfigs = res.data.rule;
           _this.orderReward.radioValue1 = res.data.isOpen;
        }
      });

    //获取开单奖励设置
    _this.$http
      .get(api.query_team_rule, {
        params: {
          ruleName: "fission_reward"
        }
      })
      .then(res => {
         if (res && res.data && res.data.rule) {
         // _this.fission_reward.stepConfigs = JSON.parse(res.data.rule);
          _this.fissionReward.stepConfigs = res.data.rule;
          _this.fissionReward.radioValue1 = res.data.isOpen;
        }
      });
  },
  methods: {
    //保存拉新奖励设置
    onSavePeopleReward() {
      let _this = this;
      console.log('保存',_this.peopleReward.stepConfigs)
      _this.$http
        .post(api.add_team_rule, {
          isOpen: _this.peopleReward.radioValue1,
          ruleName: "new_people_reward",
          configList: JSON.stringify(_this.peopleReward.stepConfigs)
        })
        .then(res => {
          _this.$message.success("操作成功!", 0.5);
        });
    },
    //保存下单奖励设置
    onSaveOrderReward(){
       let _this = this;
      _this.$http
        .post(api.add_team_rule, {
          isOpen: _this.orderReward.radioValue1,
          ruleName: "new_order_reward",
          configList: JSON.stringify(_this.orderReward.stepConfigs)
        })
        .then(res => {
          _this.$message.success("操作成功!", 0.5);
        });
    },
    //保存团队分裂设置
    onSaveFissionReward(){
    let _this = this;
      _this.$http
        .post(api.add_team_rule, {
          isOpen: _this.fissionReward.radioValue1,
          ruleName: "fission_reward",
          configList: JSON.stringify(_this.fissionReward.stepConfigs)
        })
        .then(res => {
          _this.$message.success("操作成功!", 0.5);
        });
    },
    addStepConfig() {
      if (this.peopleReward.stepConfigs.length > 4) {
        this.$message.info("只能添加5个配置!", 1);
        return;
      }
      this.peopleReward.stepConfigs.push({
        tempId: new Date().getTime(),
        minValue: 1,
        maxValue: 10,
        reward: 10,
        is_deleted: 0
      });
    },
    onDelStep(item) {
      let _this = this;
      //console.log('itemId',item.tempId)
      let _stepConfigs = _this.peopleReward.stepConfigs;
      for (let i in _stepConfigs) {
        if (_stepConfigs[i].tempId === item.tempId) {
          _stepConfigs = _stepConfigs.splice(i, 1);
          break;
        }
      }
    },
    //未补充完成
    onnewusersigninreward(){
      let  _this = this;
    }
  },
  components: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="./teamRule.less" lang="less"></style>

<template>
  <div :id="id"></div>
</template>

<script>
import G2 from '@antv/g2'
export default {
  data () {
    return {
      chart: null
    }
  },
  props: {
    charData: {
      type: Array,
      default: function () {
        return {
          data: []
        }
      }
    },
    id: String
  },
  mounted () {
    this.drawChart()
  },
  // 监听API接口传过来的数据  2018-08-21更新
  watch: {
    charData: function (val, oldVal) {    // 监听charData，当放生变化时，触发这个回调函数绘制图表
      // console.log('new: %s, old: %s', val, oldVal);
      this.drawChart(val);
    }
  },
  methods: {
    drawChart: function (val) {
      if (!val) return
      this.chart = new G2.Chart({
        container: this.id,
        height:280,
        padding:[20,50,20,50],
        forceFit:true
      })
      this.chart.source(val)
      this.chart.scale('value', {
        min: 0,
        alias:'订单数'
      })
      this.chart.scale('year', {
        range: [0, 1]
      })
      this.chart.tooltip({
        crosshairs: {
          type: 'line'
        }
      })
      
      this.chart.area().position('year*value').color('#61b3e6');
      this.chart.point().position('year*value').shape('hollowCircle').color('#61b3e6');
      this.chart.render();
    }
  }
}
</script>
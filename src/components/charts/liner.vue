/* 柱状图 */

<template>
  <div style="width: 100%; height:100%">
    <div id="container"></div>
  </div>
</template>

<script>
let echarts = require('echarts/lib/echarts');
import { option } from './options';
export default {
  name: 'liner',
  data() {
    return {
      option,
    };
  },

  mounted() {
    // 初始化加载
    this.mapChart();
  },

  methods: {
    // 配置渲染map
    mapChart() {
      let myChart = echarts.init(document.getElementById('container'));
      let dataList = [
        {
          name: '南海诸岛',
          value: 1000,
        },
        {
          name: '北京',
          value: 5000,
        },
        {
          name: '天津',
          value: 7000,
        },
        {
          name: '上海',
          value: 4000,
        },
      ];
      let nameList = ['南海诸岛', '北京', '天津', '上海'];
      window.addEventListener('resize', () => {
        myChart.resize();
      });
      this.option.series.forEach(item => {
        item.data = dataList;
      });
      this.option.yAxis.data = nameList;
      myChart.setOption(option);
    },
  },

  beforeDestroy() {
    this.option = {};
  },
};
</script>

<style scoped>
#container {
  width: 100%;
  height: 100%;
  margin: 0px auto 0;
}
</style>

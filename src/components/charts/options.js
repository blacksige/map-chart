let echarts = require('echarts/lib/echarts');

export let option = {
  backgroundColor: '#000',
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    formatter: function(objs) {
      let obj = objs[0];
      return `${obj.name}<br/>${obj.marker}${obj.seriesName} : ${obj.value} 个`;
    },
  },
  grid: {
    top: '3%',
    left: '3%',
    right: '2%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'value',
    axisTick: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisLabel: {
      show: false,
    },
    splitLine: {
      show: false,
    },
  },
  yAxis: {
    type: 'category',
    boundaryGap: true,
    inverse: true, //反向
    position: 'right',
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      margin: 0,
      color: '#fff',
      formatter: function(value) {
        return '    ' + value;
      },
    },
    data: [],
  },
  series: [
    {
      name: '销售量',
      barWidth: 45,
      type: 'bar',
      label: {
        normal: {
          show: true,
          position: 'insideLeft',
          formatter: '{c}',
          textStyle: {
            color: '#fff',
          },
        },
      },
      color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        {
          offset: 1,
          color: '#0489f0',
        },
        {
          offset: 0,
          color: '#28d9e8',
        },
      ]),
      data: [],
    },
    {
      // 分隔
      name: '测试',
      type: 'pictorialBar',
      itemStyle: {
        normal: {
          color: 'black',
        },
      },
      symbolRepeat: 'fixed',
      symbolMargin: 30, //图形的两边间隔
      symbol: 'rect',
      symbolClip: true, //是否裁剪图形
      symbolSize: [3, 47],
      symbolPosition: 'start', //图形的定位位置。
      symbolOffset: [-2, 0], //图形相对于原本位置的偏移。
      data: [],
      zlevel: 1,
      width: 2,
      animationEasing: 'elasticOut',
    },
  ],
};

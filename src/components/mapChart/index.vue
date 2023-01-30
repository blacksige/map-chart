<template>
  <div style="width: 100%; height: 100%">
    <button size="mini" type="primary" @click="backMap()" class="btn">
      返回概览
    </button>
    <div id="container"></div>
  </div>
</template>

<script>
let echarts = require('echarts/lib/echarts');
import { provinces, cityMap } from './config/index.js';
// import $ from '../utils/jquery';
require('echarts/lib/chart/map');
require('echarts/map/js/china');

export default {
  name: 'mapChart',
  data() {
    return {
      // 坐标
      geoCoordMap: {
        北京: [116.41667, 39.91667],
        上海: [121.43333, 34.5],
        广州: [113.23333, 23.16667],
        杭州: [120.2, 30.26667],
        重庆: [106.45, 29.56667],
        青岛: [120.33333, 36.06667],
        厦门: [118.1, 24.46667],
        福州: [119.3, 26.08333],
        兰州: [103.73333, 36.03333],
        长沙: [113.0, 28.21667],
        南京: [118.78333, 32.05],
      },
      // 数据
      rawData: [
        ['北京', 5, 20, 30],
        ['上海', 10, 10, 30],
        ['广州', 10, 50, 30],
        ['杭州', 10, 20, 3],
        ['重庆', 10, 20, 8],
        ['青岛', 10, 20, 10],
        ['厦门', 10, 20, 4],
        ['福州', 10, 10, 30],
        ['兰州', 10, 15, 30],
        ['长沙', 10, 25, 30],
        ['南京', 10, 20, 5],
      ],
      legendData: ['在办工单量', '已办工单量', '其他'],

      mapName: 'china',
      myChart: {},
    };
  },
  watch: {
    mapName(val) {
      console.log(val);
    },
  },
  mounted() {
    // 初始化加载
    this.myChart = echarts.init(document.getElementById('container'));
    this.mapChart(true);
  },
  beforeDestroy() {
    this.myChart = {};
  },
  methods: {
    // 返回全国视图
    backMap() {
      this.$nextTick(() => {
        this.mapName = 'china';
        this.mapChart();
      });
    },

    // 配置渲染map
    mapChart(first = false) {
      let that = this;
      first &&
        window.addEventListener('resize', () => {
          that.myChart.resize();
        });

      let option = {
        animation: true,
        // 地图背景颜色
        tooltip: {
          trigger: 'axis',
        },
        geo: {
          map: that.mapName,
          // silent: true,
          roam: false,
          aspectScale: 0.75,
          zoom: 1, // 地图初始大小
          // center: [105.366794, 35.400309], // 初始中心位置
          label: {
            normal: {
              show: true,
              fontSize: '12',
              color: '#D6D6F0',
            },
          },
          // 地区块儿颜色
          itemStyle: {
            normal: {
              areaColor: '#4c91f7',
              borderWidth: 1,
              borderColor: '#1670d3',
              shadowColor: '#004199',
              shadowBlur: 15,
              shadowOffsetX: 3,
              shadowOffsetY: 5,
            },
            emphasis: {
              label: {
                show: true,
              },
            },
          },
        },
        grid: {
          left: '5%',
          top: '5%',
        },
        series: [],
      };

      function renderEachCity() {
        let option = {
          title: [],
          grid: [],
          legend: {
            x: '12%',
            y: '85%',
            orient: 'vertical',
            icon: 'circle',
            data: that.legendData,
          },
          series: [],
        };

        echarts.util.each(that.rawData, function(dataItem, idx) {
          let geoCoord = that.geoCoordMap[dataItem[0]];
          let coord = that.myChart.convertToPixel('geo', geoCoord);
          idx += '';
          let inflationData = that.legendData.map((item, index) => {
            return {
              name: item,
              value: dataItem[index + 1],
            };
          });
          let total = dataItem[1] + dataItem[2] + dataItem[3];
          // let title = {
          //   text: dataItem[0],
          //   textStyle: {
          //     fontSize: 10,
          //     fontWeight: 'bold',
          //   },
          //   x: coord[0] - 15,
          //   y: coord[1] + 15,
          // };
          // option.title.push(title);
          option.grid.push({
            id: idx,
            gridId: idx,
            width: 30,
            height: 40,
            left: coord[0] - 15,
            top: coord[1] - 15,
            z: 100,
          });
          option.series.push({
            id: idx,
            type: 'pie',
            label: {
              normal: {
                show: false,
              },
              emphasis: {
                show: true,
              },
            },
            lableLine: {
              normal: {
                show: false,
              },
              emphasis: {
                show: true,
              },
            },
            radius:
              total > 50 ? '4%' : total > 40 ? '3%' : total > 30 ? '2%' : '1%',
            center: coord,
            data: inflationData,
            z: 100,
            itemStyle: {
              normal: {
                color: function(params) {
                  // 柱状图每根柱子颜色
                  let colorList = ['#FF8A54', '#F3E5A2', '#00EAFF'];
                  return colorList[params.dataIndex];
                },
              },
            },
          });
        });
        that.myChart.setOption(option);
      }
      setTimeout(renderEachCity, 0);

      that.myChart.setOption(option);

      // 点击触发
      first &&
        that.myChart.on('click', param => {
          if (param.name in provinces) {
            // 处理省模块
            let names = param.name;
            for (let key in provinces) {
              if (names == key) {
                that.showProvince(provinces[key], key);
                break;
              }
            }
          } else if (param.name in cityMap) {
            // 处理市模块
            let names = param.name;
            for (let key in cityMap) {
              if (names == key) {
                that.showCitys(cityMap[key], key);
                break;
              }
            }
          }
        });
    },

    //展示对应的省
    showProvince(eName, param) {
      let xmlhttp = new XMLHttpRequest();
      let that = this;
      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
          if (xmlhttp.status == 200) {
            let resData = xmlhttp.responseText;
            that.$echarts.registerMap(param, resData);
            that.mapName = param;
            that.mapChart();
          } else if (xmlhttp.status == 400) {
            alert('There was an error 400');
          } else {
            alert('something else other than 200 was returned');
          }
        }
      };
      xmlhttp.open('GET', `/map/province/${eName}.json`, true);
      xmlhttp.send();
    },

    //展示对应市
    showCitys(cName, param) {
      let xmlhttp = new XMLHttpRequest();
      let that = this;
      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
          if (xmlhttp.status == 200) {
            let resData = xmlhttp.responseText;
            that.$echarts.registerMap(param, resData);
            that.mapName = param;
            that.mapChart();
          } else if (xmlhttp.status == 400) {
            alert('There was an error 400');
          } else {
            alert('something else other than 200 was returned');
          }
        }
      };

      xmlhttp.open('GET', `/map/city/${cName}.json`, true);
      xmlhttp.send();
    },
  },
};
</script>

<style scoped>
#container {
  width: 100%;
  height: 100%;
  margin: 0px auto 0;
}
.btn {
  position: relative;
  z-index: 999;
  color: #0004ea;
}
</style>

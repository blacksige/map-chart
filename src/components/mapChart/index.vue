<template>
  <div style="width: 100%; height: 100%">
    <button size="mini" type="primary" @click="backMap()" class="btn">
      返回概览
    </button>
    <div id="container"></div>
  </div>
</template>

<script>
let echarts = require("echarts/lib/echarts");
import { provinces, cityMap } from "./config/index.js";
// import FileSaver from "file-saver";
import mapDist from "../../utils/dist";
require("echarts/lib/chart/map");
require("echarts/map/js/china");
// echarts.registerMap('china', geoJson)
// import * as L from "leaflet";
import * as turf from "@turf/turf";
export default {
  name: "mapChart",
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
        ["北京", 5, 20, 30],
        ["上海", 10, 10, 30],
        ["广州", 10, 50, 30],
        ["杭州", 10, 20, 3],
        ["重庆", 10, 20, 8],
        ["青岛", 10, 20, 10],
        ["厦门", 10, 20, 4],
        ["福州", 10, 10, 30],
        ["兰州", 10, 15, 30],
        ["长沙", 10, 25, 30],
        ["南京", 10, 20, 5],
      ],
      legendData: ["在办工单量", "已办工单量", "其他"],

      mapName: "china",
      myChart: {},

      resData: {},
    };
  },
  watch: {
    mapName(val) {
      console.log(val);
    },
  },
  mounted() {
    // 初始化加载
    this.myChart = echarts.init(document.getElementById("container"));
    this.mapChart(true);
    console.log(mapDist);
    // Object.keys(provinces).forEach((item) => {
    //   this.getMapInfo(item, provinces[item]);
    // });

    // setTimeout(() => {
    //   console.log(this.resData);
    //   let blob = new Blob([JSON.stringify(this.resData)], {
    //     type: "text/plain;charset=utf-8",
    //   });
    //   FileSaver.saveAs(blob, "a.txt");
    // }, 8000);
  },
  beforeDestroy() {
    this.myChart = {};
  },
  methods: {
    // 返回全国视图
    backMap() {
      this.$nextTick(() => {
        this.mapName = "china";
        this.mapChart();
      });
    },

    // 配置渲染map
    mapChart(first = false) {
      let that = this;
      first &&
        window.addEventListener("resize", () => {
          that.myChart.resize();
        });

      let option = {
        animation: true,
        // 地图背景颜色
        tooltip: {
          trigger: "axis",
        },
        geo: {
          map: that.mapName,
          // silent: true,
          roam: false,
          aspectScale: 0.75,
          zoom: 0.9, // 地图初始大小
          // center: [105.366794, 35.400309], // 初始中心位置
          label: {
            normal: {
              show: true,
              fontSize: "12",
              color: "#D6D6F0",
            },
          },
          // 地区块儿颜色
          itemStyle: {
            normal: {
              areaColor: "#4c91f7",
              borderWidth: 1,
              borderColor: "#1670d3",
              shadowColor: "#004199",
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
          left: "5%",
          top: "5%",
        },
        series: [],
      };

      function renderEachCity() {
        let option = {
          title: [],
          grid: [],
          legend: {
            x: "12%",
            y: "85%",
            orient: "vertical",
            icon: "circle",
            data: that.legendData,
          },
          series: [],
        };

        echarts.util.each(that.rawData, function(dataItem, idx) {
          let geoCoord = that.geoCoordMap[dataItem[0]];
          let coord = that.myChart.convertToPixel("geo", geoCoord);
          idx += "";
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
            type: "pie",
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
              total > 50 ? "4%" : total > 40 ? "3%" : total > 30 ? "2%" : "1%",
            center: coord,
            data: inflationData,
            z: 100,
            itemStyle: {
              normal: {
                color: function(params) {
                  // 柱状图每根柱子颜色
                  let colorList = ["#FF8A54", "#F3E5A2", "#00EAFF"];
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
        that.myChart.on("click", (param) => {
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
            alert("There was an error 400");
          } else {
            alert("something else other than 200 was returned");
          }
        }
      };
      xmlhttp.open("GET", `/map/province/${eName}.geoJson`, true);
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
            alert("There was an error 400");
          } else {
            alert("something else other than 200 was returned");
          }
        }
      };

      xmlhttp.open("GET", `/map/city/${cName}.geoJson`, true);
      xmlhttp.send();
    },

    //读取地理信息
    getMapInfo(fname, key, level = "province") {
      // let xmlhttp = new XMLHttpRequest();
      // let that = this;
      // xmlhttp.onreadystatechange = function() {
      //   if (xmlhttp.readyState == XMLHttpRequest.DONE) {
      //     if (xmlhttp.status == 200) {
      //       const obj = JSON.parse(xmlhttp.responseText);
      //       obj.name = name;
      //       obj.key = key;
      //       that.resData.push(obj);
      //     } else if (xmlhttp.status == 400) {
      //       alert("There was an error 400");
      //     } else {
      //       alert("something else other than 200 was returned");
      //     }
      //   }
      // };
      // xmlhttp.open("GET", `/map/province/${key}.geoJson`, true);
      // xmlhttp.send();
      // 引入GeoJSON库

      // 加载GeoJSON文件
      const url =
        level === "city"
          ? `/map/city/${key}.geoJson`
          : `/map/province/${key}.geoJson`;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          // 转换GeoJSON数据为Javascript对象
          const featureCollection = turf.featureCollection(data.features);

          // 创建一个空对象来存储省份数据
          // const provinces = {};
          if (level !== "city") {
            this.resData[fname] = {
              adcode: provinces[fname],
              center: [],
              children: {},
            };
            // 循环遍历每个Feature
            featureCollection.features.forEach((feature) => {
              // 获取省份名称
              const name = feature.properties.name;
              // 计算Feature的中心点坐标
              const center = turf.center(feature).geometry.coordinates;
              // 获取省份的行政代码（如果有）
              const adcode = feature.properties.adcode.toString() || null;

              // 将数据添加到provinces对象中
              this.resData[fname].children[name] = {
                center,
                adcode,
                children: {},
              };

              // 如果该Feature有子Feature，则将子Feature作为children添加到该省份对象中
              if (feature.features) {
                this.resData[fname].children[name].children = {};
                feature.features.forEach((childFeature) => {
                  const childName = childFeature.properties.name;
                  const childCenter = turf.center(childFeature).geometry
                    .coordinates;
                  const childAdcode = childFeature.properties.adcode.toString() || null;
                  this.resData[fname].children[name].children[childName] = {
                    center: childCenter,
                    adcode: childAdcode,
                  };
                });
              }
            });
          } else {
            // 循环遍历每个Feature
            featureCollection.features.forEach((feature) => {
              // 获取省份名称
              const name = feature.properties.name;
              // 计算Feature的中心点坐标
              const center = turf.center(feature).geometry.coordinates;
              // 获取省份的行政代码（如果有）
              const adcode = feature.properties.adcode?.toString() || null;

              // 将数据添加到provinces对象中
              // this.resData[fname].children[name] = { center, adcode };

              if (level === "city" && key === "710000") {
                this.resData["台湾"].children[name] = {
                  center,
                  adcode,
                };
              } else {
                Object.keys(this.resData).forEach((item) => {
                  // console.log(item, name, center, adcode, fname);
                  Object.keys(this.resData[item].children).forEach((it) => {
                    if (it === fname) {
                      this.resData[item].children[fname].children[name] = {
                        center,
                        adcode : adcode ? adcode.toString() : this.resData[item].children[fname].adcode.toString(),
                      };
                    }
                  });
                });
              }
            });
          }
          if (fname === "澳门") {
            Object.keys(cityMap).forEach((item) => {
              this.getMapInfo(item, cityMap[item], "city");
            });
          }
        });
    },
    mapInfo() {},
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

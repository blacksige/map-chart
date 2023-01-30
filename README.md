> ## vue中使用Echarts map图实现下钻至县级并展示当前地区的数据饼图
>
>
本demo中有三个图例，分别是三层下钻地图、横向柱状图、三层下钻地图的升级版（添加了阴影、数据饼图等等功能）
值得注意的是对于地图json数据的读取，可以采用jquery中的$.getJSON和js原生的XMLHttpRequest()方法。除此之外还要注意json文件的路径问题。
>
步骤如下：
> 一.    首先初始化全国 map。

      initEcharts("china")

      function initEcharts(map) {
        let option = {

          geo: {
            map: map,
            roam: false,
            scaleLimit: {
              min: 1.2,
              max: 3
            },
            zoom: 1.2,
            //图形上的文本标签，可用于说明图形的一些数据信息
            label: {
              normal: {
                show: true,
                fontSize: "10",
                color: "rgba(0,0,0,0.7)"
              }
            },
            //地图区域的多边形 图形样式，有 normal 和 emphasis 两个状态
            itemStyle: {
              //normal 是图形在默认状态下的样式；
              normal: {
                borderColor: "rgba(0, 0, 0, 0.2)"
              },
              //emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
              emphasis: {
                areaColor: "#F3B329",
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 20,
                borderWidth: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          },
          series: [
            {
              name: "信息量",
              type: "map",
              mapType: map,
              geoIndex: 0
              // data: dataList
            }
          ]
        };

        myChart.setOption(option);
      }

> 二.   定义省份及市区数组，由于太长了我就不放了
>
>
> 三.   点击事件
   
      // 点击触发
      myChart.on("click", param => {
        if (param.name in provinces) {
          // 处理省模块
          let names = param.name;
          for (let key in provinces) {
            if (names == key) {
              showProvince(provinces[key], key);
              break;
            }
          }

        } else if (param.name in cityMap) {
          // 处理市模块
          let names = param.name;
          for (let key in cityMap) {
            if (names == key) {
              showCitys(cityMap[key], key);
              break;
            }
          }
        }
      });


> 四. 渲染 map

      //展示对应的省
      function showProvince(eName,param) {
        console.log(eName, param)
        $.getJSON(`/map/province/${eName}.json`, data=>{
          that.$echarts.registerMap(param, data);
          alert("省")
          initEcharts(param);
        })
      }


      //展示对应市
      function showCitys(cName, param) {
        console.log(cName, param)
        // 显示县级地图
        $.getJSON(`/map/city/${cName}.json`, data=>{
          that.$echarts.registerMap(param, data);
          alert("县")
          initEcharts(param);
        })
      }
      
      
//或者使用原生方式
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

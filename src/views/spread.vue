<template>
  <div class="spread specialCursor">
    <div class="left">
      <!-- 柱状图 -->
      <div class="left-top"></div>
      <!-- 时间轴 -->
      <div class="left-bottom">
        <div class="swiper-container spread-time-scale">
          <div class="swiper-wrapper">
            <div class="swiper-slide time-item" v-for="(item, index) in time" :key="index">
              {{ item }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <!-- 地图 -->
      <div class="right-top">
        <div class="spread-container"></div>
        <div class="examine">
          <p>中国地图数据来源：高德软件</p>
          <p>审图号：GS京(2022)1061号</p>
        </div>
      </div>
      <!-- 路径详情 -->
      <div class="right-bottom spread-stage">
        <div class="left">
          <div class="stage-time item">
            <div class="title spreadTextBg">传播时间</div>
            <div class="text"></div>
          </div>
          <div class="stage-stage item">
            <div class="title spreadTextBg">所属时期</div>
            <div class="text"></div>
          </div>
        </div>
        <div class="middle">
          <div class="spread-detail-title title spreadTextBg">传播详情</div>
          <div class="spread-describe-text text"></div>
        </div>
        <div class="right">
          <div class="spread-detail-title title spreadTextBg">传播影响</div>
          <div class="spread-outcome-text text"></div>
        </div>
        <div class="rbottom"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { spread, spreadBarChart } from "@/assets/js/spread";
import Swiper from "swiper";
import "swiper/css/swiper.min.css";
import spreadData from "@/assets/data/spread.json";

export default {
  data() {
    return {
      time: [
        "启蒙时期",
        "奠基时期",
        "形成时期",
        "发展时期",
        "兴盛时期",
        "停滞时期",
        "复兴时期",
        "全新发展阶段",
        "现阶段",
      ],
      type: ["religion", "interact", "book", "medicine"],
      LhasaPoint: [90.02714, 31.10435],
      spreadFeature: [],
      renderPath: [],
      timeFilter: 0,
      typeFilter: 0,
      transform: "",
    };
  },
  created() {
    this.initPathData();
  },
  mounted() {
    let that = this;
    setTimeout(() => {
      spread(that);
      this.initSpreadSwiper();
    }, 0);
    spreadBarChart()
  },
  methods: {
    //初始化时间轴
    initSpreadSwiper() {
      let that = this;
      new Swiper(".spread-time-scale", {
        loop: true, // 循环模式选项
        initialSlide: 4,
        slidesPerView: 3,
        slideToClickedSlide: true,
        centeredSlides: true,
        on: {
          slideChangeTransitionEnd: function () {
            let temp = that.classFilter;
            that.timeFilter = this.realIndex;
          },
        },
      });
    },
    //初始化数据
    initPathData() {
      d3.json("data/spreadFeature.json")
        .then((spreadFeature) => {
          spreadData.forEach((item, index) => {
            item.longlatitude[0] = item.longlatitude[0] - 0.03 * index;
            item.longlatitude[1] = item.longlatitude[1];
            let coordinates = [[], []];
            if (item.inout == "in") {
              coordinates[0] = item.longlatitude;
              coordinates[1] = this.LhasaPoint;
            } else {
              coordinates[0] = this.LhasaPoint;
              coordinates[1] = item.longlatitude;
            }
            spreadFeature.features.push({
              type: "Feature",
              properties: {},
              geometry: {
                coordinates: coordinates,
                type: "LineString",
              },
              ...item,
            });
          });
          this.spreadFeature = spreadFeature;
        })
        .then(() => {
          this.dataFilter(this.timeFilter, this.typeFilter);
          this.updataPath();
        });
    },
    //更新图上路径
    updataPath() {
      d3.selectAll(".spread-path-circle,.spread-path-contain,.spread-position-contain").remove();
      d3.selectAll(".class-circle").attr("fill", "rgb(252,172,99)")
      let that = this;
      let width = document.querySelector(
        ".spread .right .spread-container"
      ).offsetWidth;
      let height = document.querySelector(
        ".spread .right .spread-container"
      ).offsetHeight;
      let svg = d3.select(".spread .right .spread-container .spread-svg");
      let mark = svg
        .append("g")
        .attr("class", "spread-path-circle")
        .attr("transform", that.transform ? that.transform : "");
      let spread = svg
        .append("g")
        .attr("class", "spread-path-contain")
        .attr("transform", that.transform ? that.transform : "");
      let mapScale = 270,
        mapCenter = [0, 0];
      //设置投影
      let projection = d3
        .geoEquirectangular()
        .fitSize([width, height], that.spreadFeature)
        .scale(mapScale)
        .translate([width / 2, height / 2])
        .center(mapCenter);
      //生成path
      let spreadPathData = d3.geoPath().projection(projection);
      let scaleX1 = (width / 8) * 3,
        scaleX2 = (width / 8) * 5;
      this.renderPath.features.forEach((item, index) => {
        let path = spreadPathData(item);
        let s = path.slice(1, path.indexOf("L")).split(",");
        let e = path.slice(path.lastIndexOf("L") + 1).split(",");
        for (let i = 0; i < 2; i++) {
          s[i] = parseFloat(s[i]);
          e[i] = parseFloat(e[i]);
        }
        item.start = s;
        item.end = e;
      });
      //添加传播路径
      spread
        .selectAll("path")
        .data(that.renderPath.features)
        .enter()
        .append("path")
        .attr("class", (d) => `${d.spreadType} ${d.inout} time-${this.time.indexOf(d.stage)} spread-path`)
        .attr("d", (d, i) => `M${d.start[0]},${d.start[1]} Q${d.start[0]},${d.start[1]} ${d.start[0]},${d.start[1]}`)
        .attr("fill", "none")
        .attr("opacity", 0.5)
        .attr("stroke", "rgb(222,225,230)")
        .attr("stroke-width", (d) => 3)
        .attr("stroke-linecap", "round")
        .on("mouseover", function (d, i) {
          d3.select(this)
            .transition()
            .delay(100)
            .duration(300)
            .attr("stroke-width", 5);
        })
        .on("mouseleave", function (d, i) {
          d3.select(this).transition().duration(300).attr("stroke-width", 3);
        })
        .on("click", function (d, i) {
          d3.selectAll(".spread-path")
            .transition()
            .duration(300)
            .attr("stroke-width", 3)
            .attr("stroke", "rgb(222,225,230)")

          d3.select(this)
            .transition()
            .duration(300)
            .attr("stroke-width", 5)
            .attr("stroke", "chocolate");
          //调用变换方法
          that.svgTransform(d)
          //修改下方介绍文字
          let describeText = d3.select(".spread-describe-text")
          describeText.text(d.describe);
          let outcomeText = d3.select(".spread-outcome-text")
          outcomeText.text(d.outcome);
          let time = d3.select(".spread-stage .stage-time .text");
          time.text(d.time);
          let stage = d3.select(".spread-stage .stage-stage .text");
          stage.text(d.stage);
        })
        .transition()
        .duration(2000)
        .delay((d, i) => i * 200)
        .attr("d", (d, i) => `M${d.start[0]},${d.start[1]} Q${(d.start[0] + d.end[0]) / 2},${(d.start[1] + d.end[1]) / 2 - 30} ${d.end[0]},${d.end[1]}`);
      //添加地名
      let position = svg.append("g")
        .attr("class", "spread-position-contain")
        .attr("transform", that.transform ? that.transform : "");
      //去重数组，防止多个地名重叠
      let posArr = []
      for (let i = 0; i < that.renderPath.features.length; i++) {
        position.append("text")
          .datum(that.renderPath.features[i])
          .attr("class", (d) => `${d.spreadType}-text spread-text`)
          .attr("x", (d) => d.start[0])
          .attr("y", (d) => d.start[1])
          .text((d) => {
            if (posArr.includes(d.position)) {
              return ""
            }
            return d.inout == "in" ? d.position : "西藏"
          })
          .attr("fill","#12264f")
        position.append("text")
          .datum(that.renderPath.features[i])
          .attr("class", (d) => `${d.spreadType}-text spread-text`)
          .attr("x", (d) => d.end[0])
          .attr("y", (d) => d.end[1])
          .text((d) => {
            if (posArr.includes(d.position)) {
              return ""
            }
            return d.inout == "in" ? "西藏" : d.position
          })
          .attr("fill","#12264f")
        posArr.push(that.renderPath.features[i].position)
      }
      mark
        .selectAll("circle")
        .data(this.renderPath.features)
        .enter()
        .append("circle")
        .attr("class", (d) => `${d.spreadType}-circle ${d.inout} time-${this.time.indexOf(d.stage)} spread-mark`)
        .attr("r", 0)
        .attr("cx", (d, i) => d.end[0])
        .attr("cy", (d, i) => d.end[1])
        .attr("fill", "rgb(255,112,1)")
        .transition()
        .duration(500)
        .delay((d, i) => i * 200 + 1500)
        .attr("r", 5);

      setTimeout(() => {
        that.svgTransform(this.renderPath.features[0])
        d3.select(".spread-path")
          .transition()
          .delay(1000)
          .duration(500)
          .attr("stroke-width", 5)
          .attr("stroke", "chocolate");
      }, 1000);
    },
    //筛选数据
    dataFilter(timeIndex, typeIndex) {
      let that = this;
      let pathArr = {
        type: "FeatureCollection",
        features: [],
      };
      this.spreadFeature.features.forEach((item) => {
        if (that.time[timeIndex] == item.stage) {
          pathArr.features.push(item);
        } else if (timeIndex == "all") {
          pathArr.features.push(item)
        }
      });
      this.renderPath = pathArr;
      //筛选完数据后进行高亮，设置初始文本
      d3.select(".spread-describe-text").text(this.renderPath.features[0].describe);
      d3.select(".spread-outcome-text").text(this.renderPath.features[0].outcome);
      d3.select(".spread-stage .stage-time .text").text(this.renderPath.features[0].time);
      d3.select(".spread-stage .stage-stage .text").text(this.renderPath.features[0].stage);

      let type = [[], [], [], []]
      this.renderPath.features.forEach((item, index) => {
        type[this.type.indexOf(item.spreadType)].push(item)
      })

      type.forEach((item, index) => {
        let circle = d3.select(`.${this.type[index]}-item`)
          .selectAll("circle")
        let path = d3.select(`.${this.type[index]}-item`)
          .selectAll("path")
        //选中当前类型柱状图上的所有圆和path，改变透明度
        circle.transition()
          .attr("opacity", 0.2)
        path.transition()
          .attr("opacity", 0.2)
        //根据当前时期数据让柱状图上对应数量的圆和path透明度变为1
        circle.nodes().forEach((item1, index1) => {
          if (index1 < item.length) {
            d3.select(item1)
              .transition()
              .duration(500)
              .attr("opacity", 1)
          }
        })
        path.nodes().forEach((item1, index1) => {
          if (index1 < item.length) {
            d3.select(item1)
              .transition()
              .duration(500)
              .attr("opacity", 1)
          }
        })
      })
    },
    svgTransform(d) {
      let that = this;
      let width = document.querySelector(
        ".spread .right .spread-container"
      ).offsetWidth;
      let height = document.querySelector(
        ".spread .right .spread-container"
      ).offsetHeight;
      let svg = d3.select(".spread .right .spread-container .spread-svg");
      svg.selectAll("g")
        .transition()
        .duration(1000)
        .attr("transform", function () {
          let scale = 2
          let center = [(d.start[0] + d.end[0]) / 2, (d.start[1] + d.end[1]) / 2]
          that.transform = `translate(${width / 2 - center[0] * scale},${height / 2 - center[1] * scale}),scale(${scale})`
          return that.transform
        });
    }
  },
  watch: {
    timeFilter(n, o) {
      let that = this;
      that.dataFilter(n);
      that.updataPath();
    },
  },
};
</script>

<style lang="less">
@import url("@/assets/css/spread.less");
</style>
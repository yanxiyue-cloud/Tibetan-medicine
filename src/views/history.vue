<template>
  <div class="test">
    <div class="eventDetails">
      <div class="contain"></div>
    </div>
    <div class="history-chart"></div>
    <book></book>
    <div class="tooltip">
      <div class="content"></div>
      <div class="trangle"></div>
    </div>
    <!-- <div class="headPic"></div> -->
    <!-- 图例 -->
    <div class="peopleLegend">
      <div>南流派</div>
      <div>北流派</div>
      <div>无流派</div>
    </div>
    <div class="legend">
      <div class="title">图例</div>
    </div>
  </div>
</template>

<script>
import { draw } from "@/assets/js/history";
import book from "@/components/book.vue";
import * as d3 from "d3";

export default {
  mounted() {
    draw();
    this.drawLegend();
    this.peopleLegend();
  },
  components: {
    book,
  },
  methods: {
    //主线图例
    drawLegend() {
      let height1 = 20, height2 = 100
      let legendSvg = d3
        .select(".test .legend")
        .append("svg")
        .attr('class', 'legendSvg');
      legendSvg
        .append("image")
        .attr("x", 0)
        .attr("y", height1)
        .attr("width", "41px")
        .attr("height", "41px")
        .attr("xlink:href", "image/history/dynasty.png");
      legendSvg.append("text")
        .attr("x", 50)
        .attr("y", height1 + 28)
        .attr("font-size", 24)
        .text("西藏朝代")
        .attr("fill", "#f0f8ff")
      legendSvg
        .append("image")
        .attr("x", 190.4)
        .attr("y", height1)
        .attr("width", "32px")
        .attr("height", "32px")
        .attr("xlink:href", "image/history/book1.svg");
      legendSvg.append("text")
        .attr("x", 50)
        .attr("y", height2 + 28)
        .attr("font-size", 24)
        .text("中原朝代")
        .attr("fill", "#f0f8ff")
      legendSvg
        .append("image")
        .attr("x", 3)
        .attr("y", height2)
        .attr("width", "40px")
        .attr("height", "40px")
        .attr("xlink:href", "image/history/hdynasty.png");
      legendSvg.append("text")
        .attr("x", 230)
        .attr("y", height1 + 28)
        .attr("font-size", 24)
        .text("藏医典籍")
        .attr("fill", "#f0f8ff")
      legendSvg
        .append("circle")
        .attr("cx", 206)
        .attr("cy", height2 + 20)
        .attr("r", 15)
        .attr("fill", "white")
        .attr("stroke", "grey")
        .attr("stroke-width", 3);
      legendSvg.append("text")
        .attr("x", 230)
        .attr("y", height2 + 28)
        .attr("font-size", 24)
        .text("历史事件")
        .attr("fill", "#f0f8ff")
    },
    //人物图例
    peopleLegend() {
      let legendSvg = d3
        .select(".test .peopleLegend")
        .append("svg")
        .attr("class", "peopleLegend-svg");
      legendSvg
        .append("circle")
        .attr("r", 12)
        .attr("cx", 30)
        .attr("cy", 12)
        .attr("fill", "rgb(201,169,146)")
        .attr("stroke", "rgb(154,190,216)")
        .attr("stroke-width", 5);
      legendSvg
        .append("circle")
        .attr("r", 12)
        .attr("cx", 30)
        .attr("cy", 80)
        .attr("fill", "rgb(201,169,146)")
        .attr("stroke", "rgb(255,244,153)")
        .attr("stroke-width", 3);
      legendSvg
        .append("circle")
        .attr("r", 12)
        .attr("cx", 30)
        .attr("cy", 150)
        .attr("fill", "rgb(201,169,146)")
        .attr("stroke", "rgb(175,156,150)")
        .attr("stroke-width", 3);
    },
  },
};
</script>

<style lang="less">
@import url("@/assets/css/history.less");

* {
  padding: 0;
  margin: 0;
}

.test {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;

  .headPic {
    position: absolute;
    top: 12%;
    left: 24%;
    width: 10%;
    height: 26%;
    background-color: #683925;
    border: rgb(178 162 162) solid 1px;
    border-radius: 100%;
    -o-border-radius: 100%;
    -ms-border-radius: 100%;
    -moz-border-radius: 100%;
    -webkit-border-radius: 100%;

    .headPic-img {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 7%;
      left: 5%;
    }
  }

  .peopleLegend {
    position: absolute;
    top: 21%;
    left: 17%;
    width: 6%;
    height: 16%;
    color: aliceblue;

    // background-color: #ded8d8;
    div {
      margin-bottom: 32%;
      font-size: 23px;
      font-family: kaiti;
      text-align: right;
    }

    .peopleLegend-svg {
      position: absolute;
      top: 0%;
      left: 6%;
      width: 38%;
      height: 100%;
    }
  }

  .legend {
    position: absolute;

    bottom: 6%;
    left: 35%;
    width: 20%;
    height: 20%;
    color: aliceblue;

    //  background-color: #ded8d8;
    .title {
      font-size: 32px;
      font-family: kaiti;
      text-align: left;
      // margin-left: 20%;
    }

    .legendSvg {
      width: 100%;
      height: 100%;
    }
  }

  .legendText {
    position: absolute;
    bottom: 1%;
    left: 37%;
    left: 34%;
    width: 17%;
    height: 14%;
    display: flex;
    font-size: 24px;
    font-family: kaiti;

    .left,
    .right {
      display: flex;
      flex-direction: column;
      margin-left: 17%;

      div {
        margin-bottom: 44%;
      }
    }
  }
}
</style>
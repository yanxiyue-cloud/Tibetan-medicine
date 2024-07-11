<template>
  <div class="book">
    <div class="title">历史典籍</div>
    <div class="swiper-container bookList">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(item, index) in allData" :key="index">
          <div class="bookLine" v-for="(item1, index1) in item" :key="index1">
            <div class="bookItem" v-for="(item2, index2) in item1" :key="index2" @click="bookDetail(item2)">
              <!-- :style="{ 'background-image': 'url(/image/bookImage/' + item2.img + ')' }" -->
              <div class="name">{{ item2.name }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="book-button-prev"></div>
      <div class="book-button-next"></div>
      <div class="bookTip" style="height: 0%; opacity: 0">
        <div class="concel" @click="concelTip">×</div>
        <div class="left">
          <div class="content">{{ showDetail }}</div>
        </div>
        <div class="right">
          <div class="img" :style="{ 'background-image': 'url(/image/bookImage/' + curBook + ')' }"></div>
        </div>
        <!-- <div class="trangle"></div> -->
      </div>
    </div>
  </div>
</template>
<script>
import Swiper from "swiper";
import "swiper/css/swiper.min.css";
import * as d3 from "d3";
import bookData from "@/assets/data/bookData.json";

export default {
  data() {
    return {
      showDetail: "",
      allData: [],
      curBook: ""
    };
  },
  mounted() {
    this.getBookdata();
    this.initSwiper();
  },
  computed: {
    itemImg() {
      return (item) => {
        // console.log(require(`@/../public/image/bookImage/${item}`));
        return require(`@/../public/image/bookImage/${item}`);
      };
    },
  },
  methods: {
    initSwiper() {
      setTimeout(() => {
        new Swiper(".bookList", {
          loop: true, // 循环模式选项
          slidesPerView: 1,
          // // 如果需要分页器
          navigation: {
            nextEl: ".book-button-prev",
            prevEl: ".book-button-next",
          },
        });
      }, 100);
    },
    bookDetail(data) {
      this.showDetail = data.detail;
      this.curBook = data.img
      d3.select(".bookTip")
        .style("opacity", 1)
        .style("z-index", 10)
        .style("height", "70%");
    },
    concelTip() {
      d3.select(".bookTip")
        .style("opacity", 1)
        .style("height", "0%")
        .style("opacity", 0)
    },
    getBookdata() {
      let pagesLen = parseInt(bookData.length / 12) + (bookData.length % 12 ? 1 : 0);
      for (let i = 0; i < pagesLen; i++) {
        this.allData.push([])
        for (let j = 0; j < 2; j++) {
          //两行
          this.allData[i].push([])
          for (let k = 0; k < 6; k++) {
            //每行6
            if (i * 12 + j * 6 + k >= bookData.length) {
              break
            }
            this.allData[i][j].push(bookData[i * 12 + j * 6 + k]);
          }
        }
      }
    },
  },
};
</script>

<style lang="less">
.book {
  position: absolute;
  /* display: inline-block; */
  width: 45%;
  height: 50%;
  right: 3%;
  bottom: 5%;
  overflow: hidden;
  z-index: 100;

  // background-color: #ccc;
  .title {
    text-align: right;
    margin-top: 1%;
    font-size: 37px;
    font-family: kaiTi;
    padding: 20px;
    color: #fff;
    background: url("/public/image/xline.png") no-repeat;
    background-size: 80%;
    background-position: center left;
  }
}

.bookList {
  width: 100%;
  height: 84%;
  box-sizing: border-box;
  display: flex;

  .swiper-slide {
    width: 90%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }

  .book-button-prev {
    z-index: 100;
    position: absolute;
    height: 100%;
    left: 0;
    width: 5%;
    background-image: url(@/assets/image/b_des1.png);
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
  }

  .book-button-next {
    z-index: 100;
    position: absolute;
    right: 0;
    height: 100%;
    width: 5%;
    background-image: url(@/assets/image/b_des2.png);
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
  }
}

.bookLine {
  width: 100%;
  height: 48%;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .bookItem {
    width: calc(90% / 6);
    height: 100%;
    position: relative;
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    .name {
      width: 90%;
      height: 95%;
      font-size: 27px;
      font-family: kaiTi;
      box-sizing:border-box;
      padding: 10px;
      // font-weight: bold;
      
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      color: white;
      z-index: 1;
      transition: 0.5s;
      writing-mode: vertical-lr;
      color: rgb(71, 52, 36);
      // background-image: url(@/assets/image/book_bg.png);
      background-color: #fffbc7;
      // background-color: #fafad8;
      box-shadow: -12px 7px 17px #a19482;
    }

    .autor {
      position: absolute;
      opacity: 0.5;
      opacity: 1;
      top: 14px;
      left: 53px;
      writing-mode: tb-rl;
      font-family: kaiti;
      font-size: 21px;
      transition: 0.5s;
    }

    .detail {
      position: absolute;
      opacity: 0;
      width: 50%;
      top: 5px;
      left: 50%;
      font-family: kaiti;
      font-size: 19px;
      transition: 1s;
    }
  }

  .a:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgb(130, 120, 100);
    transform: scaleX(0);
    transform-origin: top;
    transition: transform 0.5s;
  }

  .a:hover:before {
    transform: scaleX(1);
    transform-origin: bottom;
    transition: transform 0.5s;
  }

  .a:hover .name {
    opacity: 1;
    color: #fff;
    transform: translateX(-10px);
  }

  .a:hover .autor {
    opacity: 1;
    color: #fff;
    transform: translateX(-10px);
  }

  .a:hover .detail {
    opacity: 1;
    color: #fff;
  }
}

.bookTip {
  position: absolute;
  width: 70%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  z-index: 100;
  // background: ;
  z-index: -1;
  transition: height 0.5s, opacity 0.5s;
  display: flex;
  background: url('/public/image/book_frame.png') #dcd6d6 center;
  background-size: 111% 162%;

  .concel {
    font-size: 58px;
    width: 43px;
    height: 60px;
    position: absolute;
    left: 90%;
    top: 3px;
    cursor: pointer;
  }

  .left {
    width: 60%;
    height: 100%;

    .content {
      font-family: KaiTi;
      font-weight: bold;
      font-size: 27px;
      padding: 27px;
      box-sizing: border-box;
      letter-spacing: 5px;
      line-height: 35px;
      text-align: left;
      overflow: auto;
      height: 100%;

    }

    .content::-webkit-scrollbar {
      width: 6px;
    }

    .content::-webkit-scrollbar-thumb {
      background-color: #0003;
      border-radius: 3px;
    }

    .content::-webkit-scrollbar-track {
      border-radius: 10px;
      background-color: #efdcc1;
    }
  }

  .right {
    width: 40%;
    height: 100%;

    // background: #c2afaf;
    .img {
      width: 80%;
      height: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-size: 90%;
    }
  }

  // .trangle {
  //   position: absolute;
  //   top: 88px;
  //   left: -20px;
  //   width: 0;
  //   height: 0;
  //   border-width: 10px;
  //   border-style: dashed dashed solid dashed;
  //   border-color: transparent rgb(239, 237, 237) transparent transparent;
  // }
}
</style>
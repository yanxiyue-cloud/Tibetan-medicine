<template>
  <div class="home">
    <div class="nav">
      <div class="nav-item">
        <img src="@/assets/circle_1.png" alt="tupian" />
        <div class="nav-text" @click="goto('/history')">寻根溯源</div>
      </div>
      <div class="nav-item">
        <img src="@/assets/circle_1.png" alt="tupian" />
        <div class="nav-text" @click="goto('/lifeTree')">三因学说</div>
      </div>
      <div class="nav-item">
        <img src="@/assets/circle_1.png" alt="tupian" />
        <div class="nav-text" @click="goto('surgicalInstrument')">奁中宝玉</div>
      </div>
    </div>

  </div>
</template>

<script>

export default {
  methods: {
    goto(path) {
      // console.log(path);
      this.$router.push(path);
    },
  },
};
</script>

<style lang="less">
.home {
  width: 100%;
  height: 100%;
  background: url("@/assets/home3.png") no-repeat;
  background-size: 100%;
  position: relative;

  .nav {
    position: absolute;
    top: 8%;
    right: 5%;
    width: 15%;
    height: 37%;
    display: flex;
    justify-content: space-around;
    img{
      margin-bottom: 20px;
    }
    .nav-item {
      width: 20%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      .nav-text {
        cursor: pointer;
        height: 78%;
        writing-mode: vertical-lr;
        font-family: "华文新魏";
        letter-spacing: 20px;
        font-size: 60px;
        font-weight: 500px;
        margin-top: 5px;
        color: #1f58d3;
        // margin-right: 20px;
      }
    }
  }
}
</style>
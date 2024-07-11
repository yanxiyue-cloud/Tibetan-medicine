<template>
  <div id="app">
    <NavigationBar></NavigationBar>
    <router-view></router-view>
  </div>
</template>

<script>
import NavigationBar from "./components/navigationBar.vue";
import history from "./views/history.vue";

export default {
  mounted() {
    let scale = window.innerWidth / 2300
    document.body.style.zoom = scale;
  },
  components: {
    history,
    NavigationBar
  },
};
</script>

<style lang="less">
* {
  padding: 0;
  margin: 0;
  // cursor: url(../public/image/mouse.png), auto !important;
}

body {
  background-image: url(../public/image/background1.png);
  background-size: 100%;
  margin: auto 0;
}

html,
body,
#app {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

<template>
  <nav v-if="isShow">
    <router-link to="/CombinedType_1">CombinedType_1</router-link> | <router-link to="/CombinedType_2">CombinedType_2</router-link> |
    <router-link to="/Test3D">Test3D</router-link> | <router-link to="/TestA1">TestA1</router-link>
  </nav>
  <router-view />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

let isShow = ref(false);
const $route = useRoute();

// 根据路由元信息的fullscreen来判断是否显示上方导航栏
watch($route, () => {
  isShow.value = $route.meta.fullscreen === true ? false : true;
});
</script>

<style lang="less">
body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  // margin-top 60px
}
</style>

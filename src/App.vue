<template>
  <nav v-if="!$route.meta.fullScreen">
    <router-link to="/CombinedType_1">CombinedType_1</router-link> | <router-link to="/CombinedType_2">CombinedType_2</router-link> |
    <router-link to="/Test3D">Test3D</router-link>
  </nav>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const $route = useRoute();
onMounted(() => {
  console.log($route.meta.fullScreen);
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

<!--
 * @Author: Spearhead
 * @Date: 2022-12-29 19:22:51
 * @LastEditTime: 2023-01-01 02:20:11
-->
<template>
  <button @click="addClickEvent">添加click事件</button>
  <button @click="removeClickEvent">解除click事件</button>
</template>

<script setup lang="ts">
const func = () => {
  console.log(window.event);
};
const addClickEvent = () => {
  window.addEventListener('click', func);
};
const removeClickEvent = () => {
  window.removeEventListener('click', func);
};
</script>

<style lang="stylus" scoped></style>

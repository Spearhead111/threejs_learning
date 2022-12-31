<!--
 * @Author: Spearhead
 * @Date: 2022-12-29 22:34:26
 * @LastEditTime: 2022-12-31 18:48:24
-->
<template>
  <p>你好</p>
  <div>{{ name }}</div>
  <button @click="changeName()">改变name</button>
</template>

<script setup lang="ts">
import { Ref, ref, onMounted, watch } from 'vue';

let name: Ref<string> = ref('hahaha');
const changeName = (): void => {
  name.value = name.value === 'hahaha' ? 'lololo' : 'hahaha';
};

watch(
  () => name.value,
  (value) => {
    console.log(`name的值改变为:${value}`);
  }
);

onMounted((): void => {
  console.log(name.value);
});
</script>

<style lang="less" module>
body {
  padding: 0px;

  button {
    padding: 10px;
  }
}
</style>

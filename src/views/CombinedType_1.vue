<!--
 * @Author: Spearhead
 * @Date: 2022-12-29 19:22:51
 * @LastEditTime: 2022-12-30 13:55:55
-->
<template>
  <div>{{ name }}</div>
  <button @click="changeName()">改变name</button>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted } from 'vue';

export default defineComponent({
  setup(_, ctx) {
    console.log(ctx);

    onMounted((): void => {
      console.log('hello world!!');
    });

    const dataMap = reactive({
      name: 'asd',
      changeName(): void {
        this.name = 'dsa';
        console.log(this.name);
      },
    });
    return { ...toRefs(dataMap) };
  },
});
</script>

<style lang="stylus" module></style>

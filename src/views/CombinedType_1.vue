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

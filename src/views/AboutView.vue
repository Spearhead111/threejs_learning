<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';

export default defineComponent({
  setup() {
    const dataMap = reactive({});
    return { ...toRefs(dataMap) };
  },
});
</script>

<style lang="stylus" scoped></style>

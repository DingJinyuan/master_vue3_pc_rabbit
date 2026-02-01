<script setup lang="ts">
import { RouterView } from 'vue-router';

// 测试代码
// import TestButton from '@/components/TestButton.vue'

</script>

<template>
  <!-- <TestButton /> -->
     <div class="test">test scss</div>
  <RouterView/>

</template>

<style scoped lang="scss">
.test{
  color:$priceColor,
}
</style>

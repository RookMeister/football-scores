<script setup lang="ts">
  import { defineAsyncComponent } from 'vue';
  const props = defineProps<{ name: string }>();
  const AsyncIcon = defineAsyncComponent(() => import(`../assets/${props.name}.svg`));
</script>

<template>
  <AsyncIcon class="icon" />
</template>

<style lang="less">
  svg.icon {
    display: block;
  }
</style>

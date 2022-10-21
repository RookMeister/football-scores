<script lang="ts" setup>
import TabBar from '@web/core/TabBar.vue';
import Icon from '@web/core/Icon.vue';

const tabs = [
  { icon: 'football', tiile: 'Матчи' },
  { icon: 'trophy', tiile: 'Лиги' },
  { icon: 'cog-outline', tiile: 'Настройки' }
]
</script>

<template>
  <RouterView />
  <TabBar border >
    <div v-for="tab in tabs" :key="tab.tiile">
      <Icon v-if="tab.icon" :name="tab.icon" />
      <div>{{ tab.tiile }}</div>
    </div>
  </TabBar>
</template>

<style lang="less">
@import './style.less';

// .tab-bar {
//   justify-content: space-between;
//   & > div {
//     --padding-top: 16px;
//     --padding-bottom: 16px;
//     width: auto;
//   }
// }
</style>
<template>
  <ion-app>
    <ion-router-outlet v-if="isNeedTabs" />
    <ion-tabs v-else>
      <ion-router-outlet />
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="calendar" href="/matches">
          <ion-icon :icon="football"></ion-icon>
          <ion-label>Матчи</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="standings" href="/standings">
          <ion-icon :icon="apps"></ion-icon>
          <ion-label>Лиги</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="home" href="/fav">
          <ion-icon :icon="notifications"></ion-icon>
          <ion-label>Избранное</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="settings" href="/settings">
          <ion-icon :icon="ellipsisHorizontal"></ion-icon>
          <ion-label>Ещё</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-app>
</template>

<script lang="ts" setup>
// import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { IonApp, IonRouterOutlet, IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/vue';
import { football, notifications, ellipsisHorizontal, apps } from 'ionicons/icons';

const isNeedTabs = !!(window as any).Telegram.WebApp.initData;
</script>

<style>
ion-segment-button::before {
  border-width: 1px;
}
ion-toolbar {
  --background: var(--ion-background-color, #fff);
}
ion-tab-bar {
  padding-bottom: env(safe-area-inset-bottom, 16px);
}
ion-tab-button > ion-icon {
  font-size: 20px;
}
</style>
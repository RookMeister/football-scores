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

// Detects if device is on iOS
const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test( userAgent );
}
// Detects if device is in standalone mode
const isInStandaloneMode = () => ('standalone' in window.navigator) && ((window.navigator as any).standalone);

// Checks if should display install popup notification:
if (isIos() && !isInStandaloneMode()) {
  // this.setState({ showInstallMessage: true });
}
</script>

<style>
ion-toolbar {
  --background: var(--ion-background-color, #fff);
}
</style>
<template>
  <ion-app>
    <!-- <ion-router-outlet /> -->
    <ion-tabs>
      <ion-router-outlet />
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/home">
          <ion-icon :icon="homeOutline"></ion-icon>
          <ion-label>Главная</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="calendar" href="/matches">
          <ion-icon :icon="calendarOutline"></ion-icon>
          <ion-label>Матчи</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="standings" href="/standings">
          <ion-icon :icon="listOutline"></ion-icon>
          <ion-label>Соревнования</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="settings" href="/settings">
          <ion-icon :icon="settingsOutline"></ion-icon>
          <ion-label>Настройки</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-app>
</template>

<script lang="ts" setup>
// import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { IonApp, IonRouterOutlet, IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/vue';
import { calendarOutline, homeOutline, settingsOutline, listOutline } from 'ionicons/icons';
</script>

<style>
ion-tab-button > ion-icon {
  font-size: 20px;
}
</style>
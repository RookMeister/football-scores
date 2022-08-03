<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>{{ $route.name }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ $route.name }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-list>
        <ion-item lines="full">
          <ion-icon slot="start" :icon="moonOutline" />
          <ion-label>Тёмная тема</ion-label>
          <ion-toggle @ionChange="changeToggle" :checked="isDark" slot="end"></ion-toggle>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon, IonItem, IonLabel, IonList, IonToggle } from '@ionic/vue';
import { moonOutline } from 'ionicons/icons';
const isDark = ref(false)
// const checkToggle = (shouldCheck: boolean) =>  isDark.value = shouldCheck;
const checkTheme = () => (isDark.value = !!document.body.className.match('dark'));
const changeToggle = (ev: CustomEvent) => document.body.classList.toggle('dark', ev.detail.checked);
// const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
checkTheme();

</script>
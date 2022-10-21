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
        <!-- <div v-if="!isFetching && data" class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-12 gap-4 mt-4 px-6">
          <div v-for="item in data.items" v-show="activeBlock === item.leagueType" @click="showDetail(item.urn)" :key="item.titleShort" class="flex items-center flex-col text-center p-2 rounded-lg overflow-hidden" >
            <img v-if="item.image" class="h-20 w-20" :src="IMG_URL + item.image">
            <div v-else class="h-20 w-20" />
            <div class="mt-1 mb-auto">{{ item.titleShort || item.title }}</div>
          </div>
        </div> -->
        <ion-item lines="full">
          <ion-icon slot="start" :icon="moonOutline" />
          <ion-label>Тёмная тема</ion-label>
          <ion-toggle @ionChange="changeToggle" :checked="isDark" slot="end"></ion-toggle>
        </ion-item>
        <template v-if="!isFetching && data">
          <ion-item v-for="item in data.items" lines="full" :key="item.titleShort">
            <!-- <ion-icon slot="start" :icon="moonOutline" /> -->
            <img slot="start" v-if="item.image" class="w-8" :src="IMG_URL + item.image">
            <div slot="start" v-else class="w-8" />
            <ion-label>{{ item.titleShort || item.title }}</ion-label>
            <ion-toggle @ionChange="changeToggleStandings(item)" :checked="isDark" slot="end"></ion-toggle>
          </ion-item>
        </template>
        
        
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useFetch } from '@vueuse/core';

import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon, IonItem, IonLabel, IonList, IonToggle } from '@ionic/vue';
import { moonOutline } from 'ionicons/icons';
const isDark = ref(false);
// const checkToggle = (shouldCheck: boolean) =>  isDark.value = shouldCheck;
const checkTheme = () => (isDark.value = !!document.body.className.match('dark'));
const changeToggle = (ev: CustomEvent) => document.body.classList.toggle('dark', ev.detail.checked);
const changeToggleStandings = (item: any) => {
  console.log(666, item);
  
};
// const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
checkTheme();



const { isFetching, data } = useFetch('/api/competition/', { method: 'GET' }, { refetch: true }).json<ICompetitionsResponce>();
const IMG_URL = import.meta.env.VITE_IMG_URL;
</script>
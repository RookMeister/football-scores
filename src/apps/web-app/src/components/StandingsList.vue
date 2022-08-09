<script setup lang="ts">
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSegment, IonSegmentButton, IonLabel } from '@ionic/vue';
import { computed, ref } from 'vue';
import ContentLoader from '@web/components/core/ContentLoader.vue';
import { useFetch } from '@vueuse/core';
import { ICompetitionsResponce } from '@interfaces/competitions.interface';
import Standing from '@web/components/Standing.vue';

const IMG_URL = import.meta.env.VITE_IMG_URL;

const topStanding = [
  'Российская Премьер-Лига', 'Английская Премьер-лига', 'Ла Лига', 'Серия A', 'Бундеслига', 'Лига 1', 'Эредивизи', 'MLS'
];
const viewsStanding = [
  { title: 'Национальные', leagueType: 'NATIONAL'},
  { title: 'Клубные', leagueType: 'CLUB'},
  { title: 'Сборные', leagueType: 'INTERNATIONAL'}
];

const activeBlock = ref('NATIONAL');
const segmentChanged = (ev: CustomEvent) => (activeBlock.value = ev.detail.value);

const { isFetching, data  } = useFetch('/api/competition/', { method: 'GET' }, { refetch: true }).json<ICompetitionsResponce>();

const tournamentsAll = computed(() => {
  const arr = data.value?.items.slice(0) || [];

  arr.sort((a, b) => {
    const find1 = topStanding.find(s => s === a.title);
    const find2 = topStanding.find(s => s === b.title);
    if (find1 && find2) {
      return 1;
    } else if (find1) {
      return -1;
    } else if (find2) {
      return 1;
    } else if (a.title.includes('Кубок')) {
      return -1;
    } if (b.title.includes('Кубок')) {
      return 1;
    }

    return a.title.localeCompare(b.title)
  })

  return arr;
})

function showDetail(view: string) {
  const nav = document.querySelector('ion-nav#standings-page');
  nav && (nav as any).push(Standing, { view });
}
</script>

<template>
  <ion-header class="ion-no-border">
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
    <ion-toolbar class="border-b" style="--border-width: 0px;top: 0px;position: sticky;--background: var(--ion-background-color, #fff);">
      <ion-segment :value="activeBlock" @ionChange="segmentChanged($event)">
        <ion-segment-button v-for="item in viewsStanding" :key="item.title" :value="item.leagueType" class="px-2">
          <ion-label>{{ item.title }}</ion-label>
        </ion-segment-button>
      </ion-segment>
    </ion-toolbar>
    <div v-if="!isFetching" class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-12 gap-4 mt-4 px-6">
      <div v-for="item in tournamentsAll" v-show="activeBlock === item.leagueType" @click="showDetail(item.urn)" :key="item.titleShort" class="flex items-center flex-col text-center p-2 rounded-lg overflow-hidden" >
        <img v-if="item.image" class="h-20 w-20" :src="IMG_URL + item.image">
        <div v-else class="h-20 w-20" />
        <div class="mt-1 mb-auto">{{ item.titleShort || item.title }}</div>
      </div>
    </div>
    <ContentLoader class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-12 gap-4 mt-4 px-6" v-else>
      <div class="w-full h-32 rounded-lg" v-for="i in 12" :key="i"></div>
    </ContentLoader>
  </ion-content>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSegment, IonSegmentButton, IonIcon, IonLabel, } from '@ionic/vue';
import { logoYoutube } from 'ionicons/icons';
import ContentLoader from '@/components/core/ContentLoader.vue';
import { format, formatISO, startOfYesterday, startOfTomorrow } from 'date-fns';
import { useFetch } from '@vueuse/core';
import { IMatchesResponce } from '@interfaces/matches.interface';


const dates = [
  { title: 'Вчера', date: formatISO(startOfYesterday(), { representation: 'date' }), index: '0' },
  { title: 'Сегодня', date: formatISO(new Date(), { representation: 'date' }), index: '1' },
  { title: 'Завтра', date: formatISO(startOfTomorrow(), { representation: 'date' }), index: '2' }
];

const getSlugForImg = (key: number) => data.value && (data.value.participants[key].frontConfig.logos.default || '').replace('500_500.png', '30_30.png');
const getLiveMin = (time: string) =>  (time.split(':')[0] + "'");



const activeDate = ref(formatISO(new Date(), { representation: 'date' }));
const url = computed(() => `/api/matches/${activeDate.value}/`);
const segmentChanged = (ev: CustomEvent) => (activeDate.value = ev.detail.value);

const { data, isFetching } = useFetch(url, { method: 'GET' }, { refetch: true }).json<IMatchesResponce>();

// const isModalVisible = ref(false);
// const modalInfo = ref(null);

// const openModal = (match: any) => {
//   if (!match.eventStatus.notStarted) {
//     modalInfo.value = match;
//     isModalVisible.value = true;
//   }
// }
</script>

<template>
  <ion-page ref="page">
    <ion-header class="ion-no-border">
      <ion-toolbar style="--background: var(--ion-background-color, #fff);">
        <!-- <ion-buttons slot="start">
          <ion-button> Clear </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button> Done </ion-button>
        </ion-buttons> -->
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
        <ion-segment :value="activeDate" @ionChange="segmentChanged($event)">
          <ion-segment-button v-for="item in dates" :key="item.title" :value="item.date">
            <ion-label>{{ item.title }}</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
      <div v-if="data && !isFetching" class="flex flex-col ">
        <div v-for="(season, i) in data.seasons" :key="season.id" :class="(i > 0) && 'border-t'">
          <div class="px-6 py-2 font-bold">{{ season.titleRu }}</div>
          <div class="px-6">
            <div v-for="match in data.items" :key="match.id" v-show="match.seasonId === season.id">
              <div v-if="match.seasonId === season.id" class="pt-2 flex text-sm items-center justify-between text-neutral-400">
                <div class="flex">
                  <div>{{ format(new Date(match.startTime), "dd.MM, HH:mm") }}</div>
                  <div class="ml-2">{{ match.eventStatus.titleRu }}</div>
                </div>
                <a v-if="match.eventStatus.ended && match.reviewUrl" target="_blank" :href="match.reviewUrl">
                  <ion-icon :icon="logoYoutube"></ion-icon>
                </a>
              </div>
              <div v-if="match.seasonId === season.id" class="flex justify-between py-2">
                <div class="w-56">
                  <div v-for="team in match.competitors" :key="team.participantId" class="flex items-center">
                    <img
                      v-if="getSlugForImg(team.participantId)"
                      class="h-auto mr-1"
                      style="width: 24px;height: 24px;"
                      :src="'https://s74794.cdn.ngenix.net/m/' + getSlugForImg(team.participantId)"
                    >
                    <svg v-else width="24" height="24" style="color: #ddd;" viewBox="0 0 100 100"><path d="M50.045 0L12 6.997v54.591c0 4.202 1.882 8.74 5.604 13.493 3.3 4.205 7.971 8.511 13.883 12.8 7.381 5.336 14.905 9.31 18.558 11.119 3.659-1.81 11.183-5.782 18.562-11.119 5.916-4.288 10.58-8.594 13.877-12.8 3.725-4.759 5.613-9.29 5.613-13.493V6.998L50.045 0z" fill="currentColor" fill-rule="nonzero"></path></svg>
                    <div class="truncate" :class="(team.place === 1) && !match.eventStatus.live && 'font-bold'">
                      {{ data.participants[team.participantId].titleRu }}
                    </div>
                  </div>
                </div>
                <div v-if="!match.eventStatus.notStarted" class="flex items-center">
                  <div v-if="match.eventStatus.live && match.eventClock" class="text-xs mr-2 text-amber-400">
                    {{ getLiveMin(match.eventClock) }}
                  </div>
                  <div>
                    <div
                      v-for="team in match.competitors"
                      :key="team.participantId + team.place"
                      :class="[(team.place === 1) && !match.eventStatus.live && 'font-bold', match.eventStatus.live && 'text-amber-400']"
                      class="flex items-center"
                    >
                      {{ team.results[0] && team.results[0].value }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ContentLoader v-else class="mt-8 px-6 py-2">
        <div class="w-full h-20 rounded-lg mt-2" v-for="i in 8" :key="i"></div>
      </ContentLoader>
      <!-- <ion-modal v-if="modalInfo" :is-open="isModalVisible" :presenting-element="$el">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ modalInfo.titleRu }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="isModalVisible = false">Закрыть</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          {{ modalInfo }}
        </ion-content>
      </ion-modal> -->
    </ion-content>
  </ion-page>
</template>


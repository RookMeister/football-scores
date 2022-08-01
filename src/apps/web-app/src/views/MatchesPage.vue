<script lang="ts" setup>
import { computed, ref } from 'vue';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonModal, IonSegment, IonSegmentButton, IonButtons, IonButton, IonIcon, IonLabel, IonDatetime, IonCard } from '@ionic/vue';
import { logoYoutube, calendarNumberOutline } from 'ionicons/icons';
import ContentLoader from '@web/components/core/ContentLoader.vue';
import { format, formatISO, parseISO } from 'date-fns';
import { useFetch } from '@vueuse/core';
import { IMatchesResponce } from '@interfaces/matches.interface';

const IMG_URL = import.meta.env.VITE_IMG_URL;
const currentDate = new Date();
currentDate.setHours(currentDate.getHours() + currentDate.getTimezoneOffset() / 60);

const getSlugForImg = (key: number) => data.value && (data.value.participants[key].frontConfig.logos.default || '').replace('500_500.png', '30_30.png');
const getLiveMin = (time: string) =>  (time.split(':')[0] + "'");

const activeDate = ref(formatISO(currentDate, { representation: 'date' }));
const activeBlock = ref('Все');
const isLive = computed(() => activeBlock.value === 'Live');
const url = computed(() => `/api/matches/${activeDate.value}/`);
const segmentChanged = (ev: CustomEvent) => (activeBlock.value = ev.detail.value);

const { data, isFetching } = useFetch(url, { method: 'GET' }, { refetch: true }).json<IMatchesResponce>();
const isLiveMatches = computed(() => data.value && data.value.items.some(match => match.eventStatus.live === isLive.value));

const isModalVisible = ref(false);
const canDismiss = ref(false);
const checkLiveMatchesInStanding = (seasonId: number) => {
  if (data.value) {
    return data.value.items.some(match => (match.eventStatus.live === isLive.value) && (match.seasonId === seasonId))
  }
  return false;
}
const changeDate = (date: CustomEvent | null) => {
  canDismiss.value = true;
  setTimeout(() => {
    isModalVisible.value = false;
    date && (activeDate.value = formatISO(parseISO(date.detail.value),  { representation: 'date' }));
    canDismiss.value = false;
  }, 0);
}
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button @click="isModalVisible = true" expand="block">
            <ion-icon :icon="calendarNumberOutline" />
          </ion-button>
        </ion-buttons>
        <ion-title>{{ $route.name }}</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-segment :value="activeBlock" @ionChange="segmentChanged($event)">
          <ion-segment-button v-for="item in ['Все', 'Live']" :key="item" :value="item">
            <ion-label>{{ item }}</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div v-if="data && !isFetching" class="flex flex-col ">
        <template v-if="isLiveMatches">
          <ion-card v-for="season in data.seasons" v-show="checkLiveMatchesInStanding(season.id)" :key="season.id">
            <div class="px-6 py-2 font-bold">{{ season.titleRu }}</div>
            <div class="px-6">
              <div v-for="match in data.items" :key="match.id" v-show="match.seasonId === season.id">
                <template v-if="match.eventStatus.live === isLive">
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
                          :src="IMG_URL + getSlugForImg(team.participantId)"
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
                </template>
              </div>
            </div>
          </ion-card>
        </template>
        <template v-else>Нет подходящих матчей</template>
      </div>
      <ContentLoader v-else class="mt-8 px-6 py-2">
        <div class="w-full h-20 rounded-lg mt-2" v-for="i in 8" :key="i"></div>
      </ContentLoader>
    </ion-content>
    <ion-modal
      :is-open="isModalVisible"
      :can-dismiss="canDismiss"
      handle-behavior="cycle"
      :initial-breakpoint="0.65"
    >
      <ion-content class="ion-padding">
        <ion-datetime :value="activeDate" @ionChange="changeDate" :first-day-of-week="1"  presentation="date" />
        <ion-button @click="changeDate(null)" class="ion-margin-top" expand="block">Закрыть</ion-button>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<style lang="less">
  ion-datetime {
    border-radius: 16px;
    --background: var(--ion-background-color, #fff);
  }
  a {
    color: red;
  }
</style>
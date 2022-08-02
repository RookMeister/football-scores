<script lang="ts" setup>
import { computed, ref } from 'vue';
import { IonContent, IonHeader, IonAccordionGroup, IonAccordion, IonPage, IonItem, IonTitle, IonToolbar, IonModal, IonSegment, IonSegmentButton, IonButtons, IonButton, IonIcon, IonLabel, IonDatetime, IonCard, IonRefresher, IonRefresherContent } from '@ionic/vue';
import { calendarOutline } from 'ionicons/icons';
import ContentLoader from '@web/components/core/ContentLoader.vue';
import MatchItem from '@web/components/MatchItem.vue';
import { formatISO, parseISO } from 'date-fns';
import { useFetch } from '@vueuse/core';
import { IMatchesResponce } from '@interfaces/matches.interface';

const IMG_URL = import.meta.env.VITE_IMG_URL;
const currentDate = new Date();
currentDate.setHours(currentDate.getHours() + currentDate.getTimezoneOffset() / 60);

const activeDate = ref(formatISO(currentDate, { representation: 'date' }));
const activeBlock = ref('Все');
const isLive = computed(() => activeBlock.value === 'Live');
const url = computed(() => `/api/matches/${activeDate.value}/`);
const segmentChanged = (ev: CustomEvent) => (activeBlock.value = ev.detail.value);

const data = ref<IMatchesResponce | null>(null);
const isFetching = ref(false);

const updateData = async () => {
  isFetching.value = true;
  const { data: matches } = await useFetch(url, { method: 'GET' }, { refetch: true }).json<IMatchesResponce>();
  data.value = matches.value;
  isFetching.value = false;
}

updateData()

// const { data, isFetching } = useFetch(url, { method: 'GET' }, { refetch: true }).json<IMatchesResponce>();
const isLiveMatches = computed(() => data.value && data.value.items.some(match => match.eventStatus.live === isLive.value));
const isEndedMatches = computed(() => data.value && data.value.items.some(match => match.eventStatus.ended));

const isModalVisible = ref(false);
const canDismiss = ref(false);
const checkLiveMatchesInStanding = (seasonId: number) => {
  if (data.value) {
    return data.value.items.some(match => (match.eventStatus.live === isLive.value) && (match.seasonId === seasonId))
  }
  return false;
}
const refresh = (event: CustomEvent) => { 
  data.value = null
  setTimeout(() => {
    updateData()
    event.target?.complete();
  }, 2000);
}
const changeDate = (date: CustomEvent | null) => {
  canDismiss.value = true;
  setTimeout(() => {
    isModalVisible.value = false;
    date && (activeDate.value = formatISO(parseISO(date.detail.value),  { representation: 'date' }));
    updateData();
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
            <ion-icon :icon="calendarOutline" />
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
    <ion-refresher slot="fixed" @ionRefresh="refresh">
      <ion-refresher-content refreshing-spinner="circles" />
    </ion-refresher>
      <div v-if="data && !isFetching" class="flex flex-col text-base">
        <template v-if="isLiveMatches">
          <ion-card v-if="isEndedMatches">
            <ion-accordion-group >
              <ion-accordion value="ended">
                <ion-item slot="header" lines="none">
                  <div class="py-2 font-bold flex items-center">
                    Завершенные
                  </div>
                </ion-item>
                <div slot="content" class="px-4 mt-2">
                  <template v-for="match in data.items">
                    <MatchItem :key="match.id" v-if="match.eventStatus.ended" :match="match" :participants="data.participants" />
                  </template>
                </div>
              </ion-accordion>
            </ion-accordion-group>
          </ion-card>
          <ion-card>
            <ion-accordion-group :multiple="true">
              <ion-accordion v-for="season in data.seasons" v-show="checkLiveMatchesInStanding(season.id)" :key="season.id" :value="season.id.toString()">
                <ion-item slot="header" class="-ml-1">
                  <div class="py-2 font-bold flex items-center">
                    <img v-if="season.competition.frontConfig.logos.default" class="h-auto mr-1" style="width: 36px;height: 36px;" :src="IMG_URL + season.competition.frontConfig.logos.default">
                    {{ season.titleRu }}
                  </div>
                </ion-item>
                <div slot="content" class="px-4 mt-2">
                  <template v-for="match in data.items">
                    <MatchItem :key="match.id" v-if="match.seasonId === season.id" :match="match" :participants="data.participants" />
                  </template>
                </div>
              </ion-accordion>
            </ion-accordion-group>
          </ion-card>
        </template>
        <ion-card v-else><div class="px-4 py-2 font-bold">Нет подходящих матчей</div></ion-card>
      </div>
      <ContentLoader v-else class="px-4 py-2">
        <div style="height: 52px;margin-bottom: 16px" class="w-full rounded-lg" v-for="i in 16" :key="i"></div>
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
ion-card {
  margin: 8px 16px;
}
a {
  color: red;
}
</style>
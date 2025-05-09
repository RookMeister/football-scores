<script lang="ts" setup>
import { computed, ref } from 'vue';
import { IonContent, IonHeader, IonAccordionGroup, IonAccordion, IonItem, IonTitle, IonToolbar, IonPage, IonModal, IonSegment, IonSegmentButton, IonButtons, IonButton, IonIcon, IonLabel, IonDatetime, IonCard, IonRefresher, IonRefresherContent } from '@ionic/vue';
import { calendarOutline } from 'ionicons/icons';
import ContentLoader from '@web/components/ContentLoader.vue';
import MatchItem from '@web/modules/matches/components/MatchItem.vue';
import MatchDetail from '@web/modules/matches/views/MatchDetail.vue';
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

async function updateData (target?: any) {
  !target && (isFetching.value = true);
  const { data: matches } = await useFetch(url, { method: 'GET' }).json<IMatchesResponce>();
  target && target.complete();
  data.value = matches.value;
  isFetching.value = false;
}

function showMatchDetail (urn: string) {
  const nav = document.querySelector('ion-nav#matches-page');
  nav && (nav as any).push(MatchDetail, { urn });
}

updateData();

const isLiveMatches = computed(() => data.value && data.value.items.some(match => match.eventStatus.live === isLive.value));
const isEndedMatches = computed(() => data.value && data.value.items.some(match => match.eventStatus.ended));
const isEndedMatchesWithReview = computed(() => data.value && data.value.items.some(match => match.reviewUrl));

const isModalVisible = ref(false);
const canDismiss = ref(false);
const checkLiveMatchesInStanding = (seasonId: number) => {
  if (data.value) {
    return data.value.items.some(match => (match.eventStatus.live === isLive.value) && (match.seasonId === seasonId))
  }
  return false;
}
const refresh = (event: any) => updateData(event.target);
const changeDate = (date: CustomEvent | null) => {
  canDismiss.value = true;
  setTimeout(() => {
    isModalVisible.value = false;
    if (date) {
      const dateNow = formatISO(parseISO(date.detail.value), { representation: 'date' });
      (dateNow !== activeDate.value && (activeDate.value = dateNow));
      updateData();
    }
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
    <ion-content :fullscreen="true" :force-overscroll="true">
      <ion-refresher slot="fixed" @ionRefresh="refresh">
        <ion-refresher-content />
      </ion-refresher>
      <div v-if="data && !isFetching" class="flex flex-col text-base">
        <template v-if="isLiveMatches">
          <ion-accordion-group :multiple="true">
          <ion-accordion v-if="isEndedMatches && !isLive && isEndedMatchesWithReview" value="review">
              <ion-item slot="header">
                <div class="py-2 font-bold flex items-center">
                  Матчи с обзорами
                </div>
              </ion-item>
              <div slot="content" class="px-4 mt-2">
                <template v-for="match in data.items">
                  <MatchItem :key="match.id" v-if="match.eventStatus.ended && match.reviewUrl" :match="match" :participants="data.participants" @click.enter="showMatchDetail(match.urn)"/>
                </template>
              </div>
            </ion-accordion>
            <!-- <ion-accordion v-if="isEndedMatches && !isLive" value="ended">
              <ion-item slot="header">
                <div class="py-2 font-bold flex items-center">
                  Завершенные
                </div>
              </ion-item>
              <div slot="content" class="px-4 mt-2">
                <template v-for="match in data.items">
                  <MatchItem :key="match.id" v-if="match.eventStatus.ended" :match="match" :participants="data.participants" />
                </template>
              </div>
            </ion-accordion> -->
            <ion-accordion v-for="season in data.seasons" v-show="checkLiveMatchesInStanding(season.id)" :key="season.id" :value="season.id.toString()">
              <ion-item slot="header" class="-ml-1">
                <div class="py-2 font-bold flex items-center">
                  <img v-if="season.competition.frontConfig.logos.default" class="h-auto mr-1" style="width: 36px;height: 36px;" :src="IMG_URL + season.competition.frontConfig.logos.default">
                  {{ season.titleRu }}
                </div>
              </ion-item>
              <div slot="content" class="px-4 mt-2">
                <template v-for="match in data.items">
                  <MatchItem :key="match.id" v-if="(match.seasonId === season.id) && (match.eventStatus.live === isLive)" :match="match" :participants="data.participants" @click.enter="showMatchDetail(match.urn)" />
                </template>
              </div>
            </ion-accordion>
          </ion-accordion-group>
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
      :keep-contents-mounted="true"
      :presenting-element="$el"
    >
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button  @click="changeDate(null)">Закрыть</ion-button>
          </ion-buttons>
          <ion-title>Выбор даты</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-datetime :value="activeDate" @ionChange="changeDate" :first-day-of-week="1"  presentation="date" />
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<style lang="less">
ion-datetime {
  max-width: 100%;
  width: 100%;
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
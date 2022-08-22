<script setup lang="ts">
import { IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonSegment, IonSegmentButton, IonLabel } from '@ionic/vue';
import { ref, computed, defineProps } from 'vue';
import { format } from 'date-fns';
import ru from "date-fns/locale/ru";
import { IMatchResponce } from '@interfaces/match.interface';
import { useFetch } from '@vueuse/core';

const IMG_URL = import.meta.env.VITE_IMG_URL;

const props = defineProps({ urn: String })
const activeBlock = ref('Голы');
// const tabs = ref(['Голы', 'Статистика', 'Составы', 'Видео']);
const tabs = ref(['Голы', 'Видео']);
const urlMatchDetail = computed(() => `/api/match/${props.urn}/`);
const { data: match } = useFetch(urlMatchDetail, { method: 'GET' }, { refetch: true }).json<IMatchResponce>();
const segmentChanged = (ev: CustomEvent) => (activeBlock.value = ev.detail.value);
</script>

<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button text="Назад" />
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content :fullscreen="true">
    <div v-if="match" class="px-6 py-2 text-center">
      <div class="text-sm">{{ match.header.season.titleRu }}</div>
      <div v-if="match.header.roundDto" class="text-sm">{{ match.header.roundDto.titleRu }}</div>
      <div class="text-sm">{{ format(new Date(match.header.startTime), "dd MMMM в HH:mm", { locale: ru }) }}</div>
      <div class="flex justify-around items-center mb-2">
        <div class="flex flex-col items-center text-center w-1/3">
          <img
            v-if="match.header.competitors[0].participant.frontConfig.logos.default"
            class="h-24 w-24 inline"
            :src="IMG_URL + match.header.competitors[0].participant.frontConfig.logos.default"
          >
          <div class="text-sm">{{ match.header.competitors[0].participant.titleRu }}</div>
        </div>
        <div class="text-4xl text-center w-1/3">
          <span>{{ match.header.competitors[0].results[0] && match.header.competitors[0].results[0].value }}</span>
          <span>:</span>
          <span>{{ match.header.competitors[1].results[0] && match.header.competitors[1].results[0].value }}</span>
          <div class="text-lg">{{ match.header.eventStatus.titleRu }}</div>
        </div>
        <div class="flex flex-col items-center text-center w-1/3">
          <img
            v-if="match.header.competitors[1].participant.frontConfig.logos.default"
            class="h-24 w-24 inline"
            :src="IMG_URL + match.header.competitors[1].participant.frontConfig.logos.default"
          >
          <div class="text-sm">{{ match.header.competitors[1].participant.titleRu }}</div>
        </div>
      </div>
    </div>
    <template v-if="match && (match.header.eventStatus.ended || match.header.eventStatus.live)">
      <!-- <ion-toolbar style="height: 40px"> -->
        <ion-segment :value="activeBlock" @ionChange="segmentChanged($event)" style="--background: #fff;border-radius: 0;justify-content: left;">
          <ion-segment-button v-for="item in tabs" :key="item" :value="item" mode="md" style="font-size: 11px;min-height: 36px;height: 36px;max-width: 64px;">
            <ion-label>{{ item }}</ion-label>
          </ion-segment-button>
        </ion-segment>
      <!-- </ion-toolbar> -->
      <div v-if="(activeBlock === 'Голы') && match.timeline.items" class="px-6 flex flex-col text-xs">
        <template v-for="goal in match.timeline.items" :key="goal.absoluteTime">
            <!-- :class="(goal.team.title === match.header.competitors[1].participant.titleRu) ? 'w-1/3 ml-auto' : 'w-1/3 mr-auto' " -->
          <div v-if="(goal.eventType === 'score_change') && goal.players && goal.team" class="mt-2">
            {{ goal.matchTime }}
            {{ goal.players.find(p => p.type === 'scorer')?.lastName }},
            {{ goal.team.title }}
          </div>
        </template>
      </div>
      <div v-if="activeBlock === 'Видео'" class="px-6 text-sm">
        <template v-for="news in match.allNews.items" :key="news.id">
          <a v-if="news.title.includes('Видеообзор')" class="block mt-2" target="_blank" :href="'https://sport24.ru/news/football/' + news.urn">{{news.title}}</a>
        </template>
      </div>
    </template>
  </ion-content>
</template>

<style>
/* ion-toolbar > .toolbar-content {
  display: block;
} */
</style>
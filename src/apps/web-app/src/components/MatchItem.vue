<script lang="ts" setup>
import { defineProps } from 'vue';
import { IEvent } from '@interfaces/standings.interface';
import { IonIcon } from '@ionic/vue';
import { logoYoutube } from 'ionicons/icons';
import { format } from 'date-fns';

defineEmits(['click'])
const props = defineProps<{ match: IEvent, participants: any }>();
const IMG_URL = import.meta.env.VITE_IMG_URL;
const getSlugForImg = (key: number) =>props.participants[key].frontConfig.logos.default?.replace('500_500.png', '30_30.png');
const getLiveMin = (time: string) =>  (time.split(':')[0] + "'");
</script>

<template>
  <div class="flex text-sm items-center justify-between text-neutral-400">
    <div class="flex">
      <div>{{ format(new Date(match.startTime), "dd.MM, HH:mm") }}</div>
      <div class="ml-2">{{ match.eventStatus.titleRu }}</div>
    </div>
    <a v-if="match.eventStatus.ended && match.reviewUrl" target="_blank" :href="match.reviewUrl">
      <ion-icon :icon="logoYoutube"></ion-icon>
    </a>
  </div>
  <div class="flex justify-between py-2" @click="$emit('click')">
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
          {{ participants[team.participantId].titleRu }}
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
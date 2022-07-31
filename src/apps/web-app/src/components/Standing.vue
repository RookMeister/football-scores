<script setup lang="ts">
import { IonContent, IonHeader, IonToolbar, IonSegment, IonSegmentButton, IonLabel, IonButtons, IonBackButton, IonSpinner } from '@ionic/vue';
import { ref, computed, defineProps } from 'vue';
import { format } from 'date-fns';
import { useFetch } from '@vueuse/core';
import { ICompetitionResponce } from '@interfaces/competitions.interface';
import { ICompetitionStandingLeagueResponce,  ICompetitionStandingCupResponce } from '@interfaces/standings.interface';

type TLEAGUEORCUP = ICompetitionStandingLeagueResponce | ICompetitionStandingCupResponce;

const IMG_URL = import.meta.env.VITE_IMG_URL;

const props = defineProps({ view: String })

const table = ref<ICompetitionStandingLeagueResponce | null>(null);
const playoff = ref<ICompetitionStandingCupResponce | null>(null);
const activeBlock = ref('0');
const activeRound = ref('');
const activeSeason = ref('');
const winsTeam = ref<{ [key: number]: string }>({});

function tableType(standing: TLEAGUEORCUP): standing is ICompetitionStandingLeagueResponce {
  return (standing as ICompetitionStandingLeagueResponce).stage.stageType === 'LEAGUE';
}

const urlSCompetition = computed(() => `/api/competition/${props.view}/${activeSeason.value}`);
const { data: tournament, onFetchFinally  } = useFetch(urlSCompetition, { method: 'GET' }, { refetch: true }).json<ICompetitionResponce>();
onFetchFinally(() => (activeBlock.value = tournament.value?.stages.actualId?.toString() || '0'));
const urlStanding = computed(() => `/api/standing/${activeBlock.value}/`);
const { data: standing, onFetchResponse, isFetching  } = useFetch(urlStanding, { method: 'GET' }, { refetch: true, immediate: false }).json<TLEAGUEORCUP>();
onFetchResponse(() => getStanding());

const getStanding = () => {
  playoff.value = null;
  table.value = null;
  if (standing.value && tableType(standing.value)) {
    table.value = standing.value;
  } else if (standing.value && !tableType(standing.value)) {
    activeRound.value = standing.value.cupRounds[0].roundTitle;
    playoff.value = standing.value;
    standing.value.cupRounds.forEach((r) => {
      const { roundTitle } = r;
      r.eventGroups.forEach(e => {
        winsTeam.value[e.wins[0].participantId] = roundTitle;
        winsTeam.value[e.wins[1].participantId] = roundTitle;
        if (r.roundTitle === 'Финал') {
          const winTeam = e.wins.find(t => t.wins);
          winTeam && (winsTeam.value[winTeam.participantId] = 'Победитель');
        }
      })
    })
  }
}

const sortCompetitors = (arr: any[], condition = false) => {
  const newArr = [...arr];
  return newArr.sort((a, b) => {
    if (condition) {
      return (b.priority - a.priority)
    } else {
      return (a.priority - b.priority)
    }
  })
}

const getLiveMin = (time: string) => {
  const [min] = time.split(':');
  return min + "'";
}

const getSlugImg = (key: number, data: TLEAGUEORCUP) => (data.participants[key].frontConfig.logos.default || '').replace('500_500.png', '30_30.png');

const segmentChanged = (ev: CustomEvent) => (activeBlock.value = ev.detail.value);
</script>

<template>
  <ion-header class="ion-no-border">
    <ion-toolbar>
      <ion-buttons slot="start">
        <ion-back-button :text="$route.name" />
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content :fullscreen="true">
    <!-- <ion-header collapse="condense">
      <ion-toolbar>
        <ion-title size="large">{{ $route.name }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-toolbar class="border-b" style="--border-width: 0px;top: 0px;position: sticky;--background: var(--ion-background-color, #fff);">
      <ion-segment :value="activeBlock" @ionChange="segmentChanged($event)">
        <ion-segment-button v-for="item in viewsStanding" :key="item.title" :value="item.leagueType">
          <ion-label>{{ item.title }}</ion-label>
        </ion-segment-button>
      </ion-segment>
    </ion-toolbar> -->
    <div v-if="tournament" class="flex flex-col items-center">
      <img class="h-24 w-24" :src="IMG_URL + tournament.header.image" alt="" srcset="">
      <h1><b>{{ (tournament.header).title }}</b></h1>
      <div class="px-6 w-full">
        <ion-segment v-if="tournament.stages.items.length !== 1" :value="activeBlock" @ionChange="segmentChanged($event)">
          <ion-segment-button v-for="item in tournament.stages.items" :key="item.titleRu" :value="item.id.toString()">
            <ion-label>{{ item.titleRu }}</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div>
      <ion-spinner v-if="isFetching" name="crescent" />
      <template v-else-if="table">
        <template v-for="item in table.stageGroups">
          <h3 v-if="Object.keys(table.stageGroups).length > 1" class="mt-4">{{ item.titleRu }}</h3>
          <table class="px-6 w-full text-left border-spacing-y-2 border-separate table-auto">
            <thead>
              <tr>
                <th class="py-2 border-b border-b-gray-300" scope="col">#</th>
                <th class="py-2 border-b border-b-gray-300" scope="col">Team</th>
                <th class="py-2 border-b border-b-gray-300 text-center w-6" scope="col">W</th>
                <th class="py-2 border-b border-b-gray-300 text-center w-6" scope="col">D</th>
                <th class="py-2 border-b border-b-gray-300 text-center w-6" scope="col">L</th>
                <th class="py-2 border-b border-b-gray-300 text-center w-8" scope="col">GD</th>
                <th class="py-2 border-b border-b-gray-300 text-center w-8" scope="col">PTS</th>
              </tr>
            </thead>
            <tr v-show="team.stageGroupId === item.id" v-for="team in table.items.sort((a: any, b: any) => a.standingTable.rank - b.standingTable.rank)" :key="team.participantId">
              <td>{{ team.standingTable.rank }}</td>
              <td class="w-32 flex items-center">
                <img class="h-4 w-4 mr-2" :src="IMG_URL + getSlugImg(team.participantId, table)">
                <div class="truncate">{{ table.participants[team.participantId].titleRu }}</div>
              </td>
              <td class="text-center">{{ team.standingTable.win }}</td>
              <td class="text-center">{{ team.standingTable.draw }}</td>
              <td class="text-center">{{ team.standingTable.loss }}</td>
              <td class="text-center">{{ team.standingTable.goalsDiff }}</td>
              <td class="text-center">{{ team.standingTable.points }}</td>
            </tr>
          </table>
        </template>
      </template>
      <template v-else-if="playoff">
        <nav class="flex w-full justify-between mt-4 text-center px-6">
          <div
            v-for="round in playoff.cupRounds"
            class="p-2 block border-b-2 grow"
            @click="activeRound = round.roundTitle"
            :class="(activeRound === round.roundTitle) && 'text-red-500 border-b-red-500'"
          >
            {{ round.roundTitle }}
          </div>
        </nav>
        <div v-if="playoff" class="flex mt-4 w-full">
          <template v-show="round.roundTitle === activeRound" v-for="round in playoff.cupRounds">
            <table v-if="round.roundTitle === activeRound" class="w-full text-left border-spacing-y-2 table-auto">
              <thead>
                <tr>
                  <th class="pl-6 py-2 border-b border-b-gray-300" scope="col">Team</th>
                  <th class="py-2 border-b border-b-gray-300 text-center w-14" scope="col"></th>
                  <th class="py-2 border-b border-b-gray-300 text-center w-18" scope="col"></th>
                </tr>
              </thead>
              <tr v-for="math in round.eventGroups" class="flex border-b border-b-gray-300 w-screen">
                <td class="block mr-auto items-center py-2 pl-6">
                  <template v-for="(event, i) in math.events">
                    <template v-if="i === 0">
                      <div
                        v-for="competitor in sortCompetitors(event.competitors)"
                        class="flex items-center"
                        :class="(winsTeam[competitor.participantId] !== round.roundTitle) && 'font-bold'"
                      >
                        <img
                          v-if="getSlugImg(competitor.participantId, playoff)"
                          class="h-auto mr-1"
                          style="width: 24px;height: 24px;"
                          :src="IMG_URL + getSlugImg(competitor.participantId, playoff)"
                        >
                        <svg v-else width="24" height="24" style="color: #ddd;" viewBox="0 0 100 100"><path d="M50.045 0L12 6.997v54.591c0 4.202 1.882 8.74 5.604 13.493 3.3 4.205 7.971 8.511 13.883 12.8 7.381 5.336 14.905 9.31 18.558 11.119 3.659-1.81 11.183-5.782 18.562-11.119 5.916-4.288 10.58-8.594 13.877-12.8 3.725-4.759 5.613-9.29 5.613-13.493V6.998L50.045 0z" fill="currentColor" fill-rule="nonzero"></path></svg>
                        <div class="truncate" :class="(winsTeam[competitor.participantId] !== round.roundTitle) && 'font-bold'">{{ playoff.participants[competitor.participantId].titleRu }}</div>
                      </div>
                    </template>
                  </template>
                </td>
                <td v-for="(event, i) in math.events" class="text-center py-2 relative pr-6 flex" :class="[(i === 0) && 'align-top', (i === 1) && 'align-bottom']">
                  <div v-if="(i === 0) && event.eventStatus.live && event.eventClock" class="text-xs mr-2 text-amber-400 flex items-center">
                    {{ getLiveMin(event.eventClock) }}
                  </div>
                  <div v-if="i === 0">
                    <div v-for="competitor in sortCompetitors(event.competitors)" :class="(competitor.place === 1) && 'font-bold'">
                      <template v-if="competitor.results[0].periodName === 'normaltime_and_overtime'">{{ competitor.results[0].value }}</template>
                    </div>
                  </div>
                  <div v-if="(i === 1) && event.eventStatus.live && event.eventClock" class="text-xs mr-2 text-amber-400 flex items-center">
                    {{ getLiveMin(event.eventClock) }}
                  </div>
                  <div v-if="(i === 1) && !event.eventStatus.notStarted">
                      <div
                        v-for="competitor in sortCompetitors(event.competitors, true)"
                        :class="[(competitor.place === 1) && !event.eventStatus.live && 'font-bold', event.eventStatus.live && 'text-amber-400']"
                      >
                        <template v-if="competitor.results[0].periodName === 'normaltime_and_overtime'">{{ competitor.results[0].value }}</template>
                      </div>
                  </div>
                  <div v-else-if="i === 1" class="flex flex-col h-full justify-center items-center text-xs text-neutral-400">
                      <div>{{ format(new Date(event.startTime), "dd.MM HH:mm") }}</div>
                      <div>{{ event.eventStatus.titleRu }}</div>
                    </div>
                  <div class="absolute flex flex-col justify-center inset-y-0 right-0 mr-4">
                    <div
                      v-for="competitor in sortCompetitors(event.competitors, !!i)"
                      class="text-gray-400 text-xs"
                      :class="[(competitor.place === 1) && !event.eventStatus.live && 'font-bold', event.eventStatus.live && 'text-amber-400']"
                    >
                      <template v-if="competitor.results[1] && competitor.results[1].periodName === 'penalties'">{{ competitor.results[1].value }}</template>
                    </div>
                  </div>
                </td>
              </tr>
            </table>
          </template>
        </div>
      </template>
    </div>
  </ion-content>
</template>
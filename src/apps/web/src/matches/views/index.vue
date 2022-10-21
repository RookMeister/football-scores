<script lang="ts" setup>
import { ref } from 'vue';
import { getMatches } from '@web/api/matches';
import Header from '@web/core/Header.vue';
import Icon from '@web/core/Icon.vue';
import MatchItem from '@web/matches/components/MatchItem.vue';
import { formatISO } from 'date-fns';

// import { IMatchesResponce } from '@interfaces/matches.interface';
const currentDate = new Date();
const activeDate = ref(formatISO(currentDate, { representation: 'date' }));
currentDate.setHours(currentDate.getHours() + currentDate.getTimezoneOffset() / 60);
const { data, isFetching } = getMatches(activeDate.value);
</script>

<template>
  <Header title="Матчи" static />
  <template v-if="data && !isFetching">
    <div v-for="season in data.seasons"
    v-show="data.items.some(m => (m.seasonId === season.id) && (m.eventStatus.id !== 'postponed'))" :key="season.id" style="padding-inline: 16px;">
      <div style="padding-block: 8px;display: flex; align-items:center;position: sticky;top: 50px;background-color: var(--background);">
        <img v-if="season.competition.frontConfig.logos.default" style="width: 24px;height: 24px;margin-right: 8px;" :src="'/m/'  + season.competition.frontConfig.logos.default">
        {{ season.titleRu }}
        <Icon name="chevron-forward-outline" style="height: 24px;width: 24px;margin-left: auto;" />
      </div>
      <template v-for="match in data.items">
        <MatchItem style="padding-block: 2px" :match="match" :participants="{ home: data.participants[match.competitors[0].participantId], away: data.participants[match.competitors[1].participantId]}" :key="match.id" v-if="(match.seasonId === season.id) && (match.eventStatus.id !== 'postponed')" />
        <!-- <MatchItem v-if="(match.seasonId === season.id) && (match.eventStatus.id !== 'postponed')" style="margin-bottom: 8px;" :match="match" :participants="data.participants" :key="match.id"  /> -->
      </template>
    </div>
  </template>
</template>
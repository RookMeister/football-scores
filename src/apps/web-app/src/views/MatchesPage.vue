<script lang="ts" setup>
import { IonPage,  IonNav } from '@ionic/vue';
import MatchesList from '@web/modules/matches/views/MatchesList.vue';

</script>

<template>
  <ion-page>
    <ion-nav id="matches-page" :root="MatchesList" />
  </ion-page>
</template>
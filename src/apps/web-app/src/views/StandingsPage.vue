<script setup lang="ts">
import { IonPage, IonNav } from '@ionic/vue';
import StandingsList from '@web/components/StandingsList.vue';
</script>

<template>
  <ion-page>
    <ion-nav id="standings-page" :root="StandingsList" />
  </ion-page>
</template>
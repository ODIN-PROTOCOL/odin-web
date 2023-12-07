<template>
  <div class="app__main-view">
    <HomeWidget />
    <InfoPanel />
    <LatestStats />
  </div>
</template>

<script lang="ts" setup>
import InfoPanel from '@/components/InfoPanel/InfoPanel.vue'
import LatestStats from '@/components/LatestList/LatestStats.vue'
import HomeWidget from '@/components/HomeWidget.vue'
</script>

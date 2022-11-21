<template>
  <div class="chart">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :key="Component" :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const chartData = ref<string>()

onMounted(async (): Promise<void> => {
  chartData.value = 'asd'
})
</script>

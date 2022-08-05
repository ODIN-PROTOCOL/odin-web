<template>
  <router-link class="titled-link" :to="to" :title="title || text">
    <span>
      {{ text }}
    </span>
  </router-link>
</template>

<script setup lang="ts">
import { LocationAsRelativeRaw } from 'vue-router'

withDefaults(
  defineProps<{
    text: number | string
    title?: number | string
    to: LocationAsRelativeRaw
  }>(),
  {
    title: '',
  },
)
</script>

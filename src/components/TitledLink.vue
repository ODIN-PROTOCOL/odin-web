<template>
  <router-link class="titled-link" :to="name || to" :title="title || text">
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
    name?: LocationAsRelativeRaw
    to?: string
  }>(),
  {
    title: '',
    to: '#',
  },
)
</script>

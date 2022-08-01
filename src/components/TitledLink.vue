<template>
  <router-link class="nav__link" :to="to" :title="title || text">
    <span>
      {{ text }}
    </span>
  </router-link>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    text: number | string
    title?: number | string
    to?: string
  }>(),
  {
    title: '',
    to: '#',
  },
)
</script>

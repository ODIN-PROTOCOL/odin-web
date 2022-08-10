<template>
  <div class="app-tab" v-show="title == selectedTitle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
defineProps<{
  title: string
}>()

const selectedTitle = inject('selectedTitle')
</script>

<style lang="scss" scoped></style>

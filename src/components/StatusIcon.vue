<template>
  <component :width="width" :height="height" :key="component" :is="component" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SuccessIcon from '@/components/icons/SuccessIcon.vue'
import ErrorIcon from '@/components/icons/ErrorIcon.vue'

const props = withDefaults(
  defineProps<{
    status: string
    width?: number | string
    height?: number | string
  }>(),
  {
    width: 24,
    height: 24,
  },
)

const component = computed(() => {
  return props.status === 'success' ? SuccessIcon : ErrorIcon
})
</script>

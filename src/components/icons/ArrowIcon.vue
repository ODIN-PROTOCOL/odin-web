<template>
  <svg
    class="arrow-icon"
    :class="className"
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.84199 1.175L5.66699 0L0.666992 5L5.66699 10L6.84199 8.825L3.02533 5L6.84199 1.175Z"
    />
  </svg>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    className?: string
    width?: number | string
    height?: number | string
  }>(),
  {
    className: '',
    width: 24,
    height: 24,
  },
)
</script>

<template>
  <svg
    :class="className"
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z"
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

<style lang="scss" scoped>
svg > path {
  fill: var(--clr__secondary);
}
</style>

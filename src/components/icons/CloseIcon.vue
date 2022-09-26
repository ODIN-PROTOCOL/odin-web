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
      d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
      fill="none"
    />
  </svg>
</template>

<script lang="ts" setup>
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
  fill: var(--clr__search-icon);
}
</style>

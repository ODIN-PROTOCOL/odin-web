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
      d="M16 7H3.83L9.42 1.41L8 0L0 8L8 16L9.41 14.59L3.83 9H16V7Z"
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
    className: 'back-icon',
    width: 16,
    height: 16,
  },
)
</script>

<style lang="scss" scoped>
svg > path {
  fill: var(--clr__nav-back);
}
</style>

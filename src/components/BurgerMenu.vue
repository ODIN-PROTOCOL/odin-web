<template>
  <button>
    <transition name="fade" mode="out-in">
      <svg
        :class="className"
        :width="width"
        :height="height"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        v-if="!isOpen"
      >
        <path
          d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z"
          :fill="fill"
        />
      </svg>
      <svg
        :class="className"
        :width="width"
        :height="height"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        v-else
      >
        <path
          d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
          :fill="fill"
        />
      </svg>
    </transition>
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    isOpen?: boolean
    className?: string
    width?: number | string
    height?: number | string
    fill?: string
  }>(),
  {
    isOpen: false,
    className: '',
    fill: '#212529',
    width: 24,
    height: 24,
  },
)
</script>
<style lang="scss" scoped>
svg {
  cursor: pointer;
}
</style>

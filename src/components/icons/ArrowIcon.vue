<template>
  <svg
    class="nav__dropdown-wrapper-arrow"
    :class="className"
    :width="width"
    :height="height"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M16.59 8.59L12 13.17L7.41 8.59L6 10L12 16L18 10L16.59 8.59Z" />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ArrowIcon',
  props: {
    className: { type: String },
    width: { type: Number, default: 24 },
    height: { type: Number, default: 24 },
  },
})
</script>

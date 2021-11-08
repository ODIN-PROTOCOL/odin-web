<template>
  <svg
    :class="className"
    :width="width"
    :height="height"
    viewBox="0 0 48 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M30 0.000244141H6C2.7 0.000244141 0.0300007 2.70024 0.0300007 6.00025L0 54.0003C0 57.3003 2.67 60.0003 5.97 60.0003H42C45.3 60.0003 48 57.3003 48 54.0003V18.0002L30 0.000244141ZM42 54.0003H6V6.00025H27V21.0002H42V54.0003ZM12 39.0303L16.23 43.2603L21 38.5203V51.0003H27V38.5203L31.77 43.2903L36 39.0303L24.03 27.0002L12 39.0303Z"
      fill="#CCE4FF"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ArrowIcon',
  props: {
    className: { type: String },
    width: { type: Number, default: 48 },
    height: { type: Number, default: 60 },
  },
})
</script>

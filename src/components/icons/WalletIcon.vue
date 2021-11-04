<template>
  <svg
    :class="className"
    :width="width"
    :height="height"
    viewBox="0 0 19 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 4.28V2C18 0.9 17.1 0 16 0H2C0.89 0 0 0.9 0 2V16C0 17.1 0.89 18 2 18H16C17.1 18 18 17.1 18 16V13.72C18.59 13.37 19 12.74 19 12V6C19 5.26 18.59 4.63 18 4.28ZM17 6V12H10V6H17ZM2 16V2H16V4H10C8.9 4 8 4.9 8 6V12C8 13.1 8.9 14 10 14H16V16H2Z"
      fill="white"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'WalletIcon',
  props: {
    className: { type: String },
    width: { type: Number, default: 19 },
    height: { type: Number, default: 18 },
  },
})
</script>

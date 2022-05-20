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
      d="M0 24C0 10.7452 10.7452 0 24 0V0C37.2548 0 48 10.7452 48 24V24C48 37.2548 37.2548 48 24 48V48C10.7452 48 0 37.2548 0 24V24Z"
      fill="#989FA6"
    />
    <path
      d="M34 18C34 16.9 33.1 16 32 16H16C14.9 16 14 16.9 14 18V30C14 31.1 14.9 32 16 32H32C33.1 32 34 31.1 34 30V18ZM32 18L24 23L16 18H32ZM32 30H16V20L24 25L32 20V30Z"
      fill="white"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MailIcon',
  props: {
    className: { type: String },
    width: { type: [Number, String], default: 48 },
    height: { type: [Number, String], default: 48 },
  },
})
</script>

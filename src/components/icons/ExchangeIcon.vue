<template>
  <svg
    :class="className"
    :width="width"
    :height="height"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.3337 14.175V8.33333H11.667V14.175H9.16699L12.5003 17.5L15.8337 14.175H13.3337ZM7.50033 2.5L4.16699 5.825H6.66699V11.6667H8.33366V5.825H10.8337L7.50033 2.5ZM13.3337 14.175V8.33333H11.667V14.175H9.16699L12.5003 17.5L15.8337 14.175H13.3337ZM7.50033 2.5L4.16699 5.825H6.66699V11.6667H8.33366V5.825H10.8337L7.50033 2.5Z"
      fill="#FFFFFF"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ExchangeIcon',
  props: {
    className: { type: String },
    width: { type: Number, default: 20 },
    height: { type: Number, default: 20 },
  },
})
</script>

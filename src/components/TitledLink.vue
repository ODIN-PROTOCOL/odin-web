<template>
  <router-link class="nav__link" :to="to" :title="title || text">
    <span>
      {{ text }}
    </span>
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    text: {
      type: [String, Number],
      required: true,
    },
    title: {
      type: [String, Number],
      required: false,
    },
    to: {
      type: String,
      default: () => '#',
    },
  },
})
</script>

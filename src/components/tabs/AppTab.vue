<template>
  <div class="app-tab" v-show="title === selectedTitle">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'

export default defineComponent({
  name: 'app-tab',
  props: { title: { type: String, requred: true } },
  setup: function () {
    const selectedTitle = inject('selectedTitle')

    return { selectedTitle }
  },
})
</script>

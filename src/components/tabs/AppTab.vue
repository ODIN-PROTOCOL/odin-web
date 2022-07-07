<template>
  <div class="app-tab" v-show="titleKey === selectedTitle">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'

export default defineComponent({
  props: {
    title: { type: String, requred: true },
    titleKey: { type: String, requred: true },
  },
  setup() {
    const selectedTitle = inject('selectedTitle')

    return { selectedTitle }
  },
})
</script>

<style lang="scss" scoped></style>

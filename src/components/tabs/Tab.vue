<template>
  <div class="tab-content" v-show="title == selectedTitle">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'

export default defineComponent({
  props: { title: { type: String, requred: true } },
  setup: function () {
    const selectedTitle = inject('selectedTitle')

    return { selectedTitle }
  },
})
</script>

<style lang="scss" scoped></style>

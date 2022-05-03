<template>
  <div :class="`modal-${shema}`">
    <div :class="`modal-${shema}__backdrop`" @click="emitClose()"></div>
    <div :class="`modal-${shema}__content`">
      <div :class="`modal-${shema}__content-head fx-row`">
        <slot name="title"></slot>
        <button
          :class="`modal-${shema}__close-btn app-ico-btn fx-sae`"
          type="button"
          @click="emitClose()"
        >
          <img src="~@/assets/icons/close.svg" alt="Close" />
        </button>
      </div>

      <slot name="main"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['close'],
  props: { shema: { type: String, default: 'base' } },
  setup(_, { emit }) {
    if (document.activeElement) {
      const activeEl = document.activeElement as HTMLElement
      activeEl.blur()
    }
    return { emitClose: () => emit('close') }
  },
})
</script>

<style lang="scss"></style>

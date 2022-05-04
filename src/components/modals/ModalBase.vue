<template>
  <div class="modal-base" :class="shema">
    <div class="modal-base__backdrop" @click="emitClose()"></div>
    <div class="modal-base__content">
      <div class="modal-base__content-head fx-row">
        <slot name="title"></slot>
        <button
          class="modal-base__close-btn app-ico-btn fx-sae"
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
  props: { shema: { type: String, default: '' } },
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

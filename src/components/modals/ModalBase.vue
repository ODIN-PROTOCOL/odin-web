<template>
  <div class="modal-base">
    <div class="modal-base__backdrop" @click="emitClose()"></div>
    <div class="modal-base__content">
      <div class="modal-base__content-head">
        <slot name="title"></slot>

        <button
          class="modal-base__close-btn app-btn"
          type="button"
          @click="emitClose()"
        >
          X
        </button>
      </div>

      <slot name="main"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent<{ testMsg: string }>({
  emits: ['close'],
  setup(_, { emit }) {
    if (document.activeElement) {
      const activeEl = document.activeElement as HTMLElement
      activeEl.blur()
    }
    return { emitClose: () => emit('close') }
  },
})
</script>

<style lang="scss">
.modal-base {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

.modal-base__backdrop {
  background: rgba(0, 0, 0, 0.75);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.modal-base__content {
  background: white;
  border-radius: 0.8rem;
  padding: 2rem;
  z-index: 1;
  width: 100%;
  max-width: 48rem;
}

.modal-base__content-head {
  display: flex;
  margin-bottom: 0.8rem;
}

.modal-base__close-btn {
  margin-left: auto;
}
</style>

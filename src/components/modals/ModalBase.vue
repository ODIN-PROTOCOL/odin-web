<template>
  <div class="modal-base">
    <div class="modal-base__backdrop" @click="emitClose()"></div>
    <div class="modal-base__content">
      <button class="modal-base__close-btn" type="button" @click="emitClose()">
        CLOSE!
      </button>

      <slot name="main"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent<{ testMsg: string }>({
  emits: ['close'],
  setup(_, { emit }) {
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
  border-radius: 8px;
  padding: 20px;
  z-index: 1;
}
</style>

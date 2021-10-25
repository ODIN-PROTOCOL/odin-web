<template>
  <ModalBase class="info-modal" @close="onClose()">
    <template #title>
      <h3 class="app-form__title">Become a validator</h3>
    </template>

    <template #main>
      <div class="info-modal__text">
        <span>Some text</span>
      </div>
    </template>
  </ModalBase>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { DialogHandler, dialogs } from '@/helpers/dialogs'
import { preventIf } from '@/helpers/functions'
import ModalBase from './ModalBase.vue'

const InfoModal = defineComponent({
  components: { ModalBase },
  setup: function () {
    const isLoading = ref(false)
    return {
      onClose: preventIf(dialogs.getHandler('onClose'), isLoading),
    }
  },
})

export default InfoModal
export function showInfoModal(callbacks: {
  onClose?: DialogHandler
}): Promise<unknown | null> {
  return dialogs.show(InfoModal, callbacks)
}
</script>

<style lang="scss" scoped>
.info-modal__text {
  padding: 0 1rem;
}
</style>

<template>
  <ModalBase class="exchange-form-modal" @close="onCLose()">
    <template #title>
      <h3 class="app-form__title">Exchange</h3>
    </template>

    <template #main>
      <h1>EXCHANGE</h1>
      <button class="app-btn" @click="onSubmit()">Exchange</button>
    </template>
  </ModalBase>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { DialogHandler, dialogs } from '@/helpers/dialogs'
import ModalBase from '@/components/modals/ModalBase.vue'

const ExchangeFormDialog = defineComponent({
  components: { ModalBase },
  setup: function () {
    return {
      onSubmit: dialogs.getHandler('onSubmit'),
      onClose: dialogs.getHandler('onClose'),
    }
  },
})

export default ExchangeFormDialog
export function showExchangeFormDialog(callbacks: {
  onSubmit?: DialogHandler
  onClose?: DialogHandler
}): Promise<unknown | null> {
  return dialogs.show(ExchangeFormDialog, callbacks)
}
</script>

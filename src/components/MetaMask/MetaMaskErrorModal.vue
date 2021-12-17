<template>
  <ModalBase class="exchange-form-modal" @close="onClose()">
    <template #title>
      <img src="~@/assets/brand/metamask-fox.svg" alt="metamask_logo" />
    </template>

    <template #main>
      <form class="app-form load-fog metamask-form">
        <div class="app-form__field metamask-form__field--centered">
          {{ message }}
        </div>
      </form>
    </template>
  </ModalBase>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { DialogPayloadHandler, dialogs } from '@/helpers/dialogs'
import ModalBase from '@/components/modals/ModalBase.vue'
import { DecoratedFn } from '@/shared-types'
import { preventIf } from '@/helpers/functions'
const MetaMaskErrorFormModal = defineComponent({
  name: 'MetaMaskErrorModal',
  components: { ModalBase },
  props: {
    message: { type: String, required: true },
  },
  setup() {
    const isLoading = ref(false)
    const onClose: DecoratedFn<DialogPayloadHandler> = preventIf(
      dialogs.getHandler('onClose'),
      isLoading
    )
    return {
      onClose,
    }
  },
})
export default MetaMaskErrorFormModal
</script>

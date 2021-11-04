<template>
  <ModalBase class="modal-base_right" @close="onClose()">
    <template #title>
      <h3 class="app-form__title">Send</h3>
    </template>

    <template #main>
      <form
        class="app-form load-fog"
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent
      >
        <div class="app-form__main">
          <div class="app-form__field">
            <label class="app-form__field-lbl">Receiver</label>
            <input
              class="app-form__field-input"
              name="send-receiver"
              type="text"
              v-model="form.receiver"
              :disabled="isLoading"
            />
            <p v-if="form.receiverErr" class="app-form__field-err">
              {{ form.receiverErr }}
            </p>
          </div>
          <div class="app-form__field">
            <label class="app-form__field-lbl">Amount</label>
            <input
              class="app-form__field-input"
              name="send-amount"
              type="text"
              v-model="form.amount"
              :disabled="isLoading"
            />
            <p v-if="form.amountErr" class="app-form__field-err">
              {{ form.amountErr }}
            </p>
          </div>
        </div>

        <div class="app-form__footer">
          <button
            class="app-btn app-btn_outlined"
            type="button"
            @click="onClose()"
            :disabled="isLoading"
          >
            Cancel
          </button>
          <button
            class="app-btn"
            type="button"
            @click="submit()"
            :disabled="!form.isValid || isLoading"
          >
            Send
          </button>
        </div>
      </form>
    </template>
  </ModalBase>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useForm, validators } from '@/composables/useForm'
import { DialogHandler, dialogs } from '@/helpers/dialogs'
import { preventIf } from '@/helpers/functions'
import { handleError } from '@/helpers/errors'
import { notifySuccess } from '@/helpers/notifications'
import ModalBase from '@/components/modals/ModalBase.vue'

const SendFormModal = defineComponent({
  components: { ModalBase },
  setup: function () {
    const form = useForm({
      receiver: ['', validators.required],
      amount: [0, validators.required, ...validators.num(1, 10)],
    })
    const isLoading = ref(false)
    const onSubmit = dialogs.getHandler('onSubmit')
    const onClose = preventIf(dialogs.getHandler('onClose'), isLoading)

    const submit = async () => {
      isLoading.value = true
      try {
        console.log('sended')
        onSubmit()
        notifySuccess('Successfuly sended')
      } catch (error) {
        handleError(error as Error)
      }
      isLoading.value = false
    }

    return {
      form: form.flatten(),
      isLoading,
      submit,
      onClose,
    }
  },
})

export default SendFormModal
export function showSendFormDialog(callbacks: {
  onSubmit?: DialogHandler
  onClose?: DialogHandler
}): Promise<unknown | null> {
  return dialogs.show(SendFormModal, callbacks)
}
</script>

<style lang="scss" scoped></style>

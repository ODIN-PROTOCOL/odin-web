<template>
  <ModalBase class="withdraw-form-modal" @close="onClose()">
    <template #title>
      <h3 class="app-form__title">Withdraw Stake</h3>
    </template>

    <template #main>
      <form
        class="app-form load-fog"
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent
      >
        <div class="app-form__main">
          <div class="app-form__field">
            <label class="app-form__field-lbl"> Amount (ODIN) </label>
            <input
              class="app-form__field-input"
              name="delegate-amount"
              type="number"
              min="1"
              placeholder="1000"
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
            class="app-btn"
            type="button"
            @click="submit()"
            :disabled="!form.isValid || isLoading"
          >
            Withdraw
          </button>
        </div>
      </form>
    </template>
  </ModalBase>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { DialogHandler, dialogs } from '@/helpers/dialogs'
import { handleError } from '@/helpers/errors'
import { preventIf } from '@/helpers/functions'
import { notifySuccess } from '@/helpers/notifications'
import { useForm, validators } from '@/composables/useForm'
import ModalBase from './ModalBase.vue'

const WithdrawFormDialog = defineComponent({
  components: { ModalBase },
  setup() {
    const form = useForm({
      amount: ['', validators.required, ...validators.num(1)],
    })
    const isLoading = ref(false)
    const onSubmit = dialogs.getHandler('onSubmit')

    const submit = async () => {
      isLoading.value = true
      try {
        // TODO submit withdraw stake
        onSubmit()
        notifySuccess('Successfully delegated')
      } catch (error) {
        handleError(error)
      }
      isLoading.value = false
    }

    return {
      form: form.flatten(),
      isLoading,
      submit,
      onClose: preventIf(dialogs.getHandler('onClose'), isLoading),
    }
  },
})

export default WithdrawFormDialog
export function showWithdrawFormDialog(callbacks: {
  onSubmit?: DialogHandler
  onClose?: DialogHandler
}): Promise<unknown | null> {
  return dialogs.show(WithdrawFormDialog, callbacks)
}
</script>

<style lang="scss" scoped></style>

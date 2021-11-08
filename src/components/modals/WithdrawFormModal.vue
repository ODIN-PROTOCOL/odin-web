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
            <label class="app-form__field-lbl">Amount</label>
            <div class="app-form__field-input-wrapper">
              <span>LOKI</span>
              <input
                class="app-form__field-input"
                name="delegate-amount"
                type="number"
                min="1"
                placeholder="1000"
                v-model="form.amount"
                :disabled="isLoading"
              />
            </div>
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
import { defineComponent, PropType, ref } from 'vue'
import { wallet } from '@/api/wallet'
import { callers } from '@/api/callers'
import { DialogHandler, dialogs } from '@/helpers/dialogs'
import { handleError } from '@/helpers/errors'
import { preventIf } from '@/helpers/functions'
import { notifySuccess } from '@/helpers/notifications'
import { ValidatorDecoded } from '@/helpers/validatorDecoders'
import { useForm, validators } from '@/composables/useForm'
import { coins } from '@cosmjs/amino'
import ModalBase from './ModalBase.vue'
import { Bech32 } from '@cosmjs/encoding'

const WithdrawFormDialog = defineComponent({
  props: {
    validator: { type: Object as PropType<ValidatorDecoded>, required: true },
  },
  components: { ModalBase },
  setup(props) {
    const form = useForm({
      amount: [
        1,
        validators.required,
        validators.integer,
        ...validators.num(1),
        validators.maxCharacters(128),
      ],
    })
    const isLoading = ref(false)
    const onSubmit = dialogs.getHandler('onSubmit')

    const submit = async () => {
      isLoading.value = true
      try {
        const encodedAddress = Bech32.decode(props.validator.operatorAddress)
        await callers.withdrawCoinsToAcc({
          sender: wallet.account.address,
          receiver: Bech32.encode('odin', encodedAddress.data),
          amount: coins(form.amount.val(), 'loki'),
        })
        onSubmit()
        notifySuccess('Successfully withdrawn')
      } catch (error) {
        handleError(error as Error)
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
export function showWithdrawFormDialog(
  callbacks: {
    onSubmit?: DialogHandler
    onClose?: DialogHandler
  },
  props: { validator: ValidatorDecoded }
): Promise<unknown | null> {
  return dialogs.show(WithdrawFormDialog, callbacks, { props })
}
</script>

<style lang="scss" scoped></style>

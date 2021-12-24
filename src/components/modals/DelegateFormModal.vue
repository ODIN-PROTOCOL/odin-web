<template>
  <ModalBase class="delegate-form-modal" @close="onClose()">
    <template #title>
      <h3 class="app-form__title">Delegate</h3>
    </template>

    <template #main>
      <form
        class="app-form load-fog"
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent
      >
        <div class="app-form__main">
          <div class="app-form__field">
            <label class="app-form__field-lbl"> Available </label>
            <p>{{ $fCoin(lokiBalance) }}</p>
          </div>

          <div v-if="delegation && delegation.balance" class="app-form__field">
            <label class="app-form__field-lbl"> You delegated </label>
            <p>{{ $fCoin(delegation.balance) }}</p>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl">Amount</label>
            <div class="app-form__field-input-wrapper">
              <span>LOKI</span>
              <input
                class="app-form__field-input"
                name="delegate-amount"
                type="text"
                :max="lokiBalance"
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
            Delegate
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
import { dialogs } from '@/helpers/dialogs'
import { handleError } from '@/helpers/errors'
import { preventIf } from '@/helpers/functions'
import { notifySuccess } from '@/helpers/notifications'
import { useForm, validators } from '@/composables/useForm'
import ModalBase from './ModalBase.vue'
import { ValidatorDecoded } from '@/helpers/validatorDecoders'
import { useBalances } from '@/composables/useBalances'
import { DelegationResponse } from '@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/staking'
import { coin } from '@cosmjs/amino'

const defaultBalanceBlank = { amount: 0, denom: 'loki' }

const DelegateFormDialog = defineComponent({
  props: {
    validator: { type: Object as PropType<ValidatorDecoded>, required: true },
    delegation: { type: Object as PropType<DelegationResponse> },
  },
  components: { ModalBase },
  setup(props) {
    const { get: getBalance, load: loadBalances } = useBalances()
    const lokiBalance = getBalance('loki') || defaultBalanceBlank

    const form = useForm({
      amount: [
        '',
        validators.required,
        validators.integer,
        ...validators.num(1, Number(lokiBalance.amount)),
        validators.maxCharacters(128),
      ],
    })
    const isLoading = ref(false)
    const onSubmit = dialogs.getHandler('onSubmit')

    const submit = async () => {
      isLoading.value = true
      try {
        await callers.validatorDelegate({
          delegatorAddress: wallet.account.address,
          validatorAddress: props.validator.operatorAddress,
          amount: coin(Number(form.amount.val()), 'loki'),
        })
        await loadBalances()
        onSubmit()
        notifySuccess('Successfully delegated')
      } catch (error) {
        handleError(error as Error)
      }
      isLoading.value = false
    }

    return {
      form: form.flatten(),
      lokiBalance,
      isLoading,
      submit,
      onClose: preventIf(dialogs.getHandler('onClose'), isLoading),
    }
  },
})

export default DelegateFormDialog
</script>

<style scoped lang="scss"></style>

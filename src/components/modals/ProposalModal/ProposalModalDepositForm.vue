<template>
  <form
    class="proposal-modal-deposit-form app-form load-fog"
    :class="{ 'load-fog_show': isLoading }"
    @submit.prevent
  >
    <div class="app-form__field">
      <label class="app-form__field-lbl fs-wb"> Deposit (LOKI) </label>
      <input
        class="app-form__field-input"
        name="deposit-amount"
        type="number"
        placeholder="1000"
        min="1"
        step="1"
        v-model="form.amount"
        :disabled="isLoading || isProcessing"
      />
      <p v-if="form.amountErr" class="app-form__field-err">
        {{ form.amountErr }}
      </p>
    </div>

    <div class="app-form__footer">
      <button
        class="app-btn"
        type="button"
        @click="submit"
        :disabled="isLoading || isProcessing || !form.isValid"
      >
        <template v-if="isProcessing"> Depositing… </template>
        <template v-else> Deposit </template>
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import { useForm, validators } from '@/composables/useForm'
import { callers } from '@/api/callers'
import { handleError } from '@/helpers/errors'
import { notifySuccess } from '@/helpers/notifications'
import { wallet } from '@/api/wallet'
import { coins } from '@cosmjs/launchpad'
import { ProposalDecoded } from '@/helpers/proposalDecoders'
export default defineComponent({
  emits: ['update:isLoading', 'submitted'],
  props: {
    proposal: { type: Object as PropType<ProposalDecoded>, required: true },
    isLoading: { type: Boolean, required: true },
  },
  setup(props, { emit }) {
    const form = useForm({
      amount: ['1', validators.required, ...validators.num(1)],
    })
    const isProcessing = ref(false)
    watch(isProcessing, (v) => emit('update:isLoading', v))

    const submit = async () => {
      if (props.isLoading || isProcessing.value) return

      isProcessing.value = true
      try {
        await callers.proposalDeposit({
          proposalId: props.proposal.proposalId,
          depositor: wallet.account.address,
          amount: coins(Number(form.amount.val()), 'loki'),
        })

        emit('submitted')
        notifySuccess('Deposited successfully')
      } catch (error) {
        handleError(error)
      }
      isProcessing.value = false
    }

    return {
      form: form.flatten(),
      isProcessing,
      submit,
    }
  },
})
</script>

<style lang="scss" scoped></style>

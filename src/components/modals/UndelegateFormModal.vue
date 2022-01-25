<template>
  <ModalBase class="undelegate-form-modal" @close="onClose()">
    <template #title>
      <h3 class="app-form__title">Undelegate</h3>
    </template>

    <template #main>
      <form
        class="app-form load-fog"
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent
      >
        <div class="app-form__main">
          <div class="app-form__field">
            <label class="app-form__field-lbl"> Operator address </label>
            <CopyText
              :text="validator.operatorAddress"
              :title="validator.operatorAddress"
              :displayText="$cropAddress(validator.operatorAddress)"
            />
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl"> Min delegation </label>
            <p>
              {{
                $convertLokiToOdin(validator.minSelfDelegation, {
                  withDenom: true,
                })
              }}
            </p>
          </div>

          <div v-if="delegation && delegation.balance" class="app-form__field">
            <label class="app-form__field-lbl"> You delegated </label>
            <p>
              {{
                $convertLokiToOdin(delegation.balance.amount, {
                  withDenom: true,
                })
              }}
            </p>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl"> Amount </label>
            <div class="app-form__field-input-wrapper">
              <span>ODIN</span>
              <input
                class="app-form__field-input"
                name="undelegate-amount"
                type="text"
                placeholder="1"
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
            Undelegate
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
import { COINS_LIST } from '@/api/api-config'
import { dialogs } from '@/helpers/dialogs'
import { handleError } from '@/helpers/errors'
import { preventIf } from '@/helpers/functions'
import { convertLokiToOdin, convertOdinToLoki } from '@/helpers/converters'
import { notifySuccess } from '@/helpers/notifications'
import { useForm, validators } from '@/composables/useForm'
import ModalBase from './ModalBase.vue'
import CopyText from '@/components/CopyText.vue'
import { ValidatorDecoded } from '@/helpers/validatorDecoders'
import { coin } from '@cosmjs/amino'
import { useBalances } from '@/composables/useBalances'
import { DelegationResponse } from '@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/staking'

export default defineComponent({
  props: {
    validator: { type: Object as PropType<ValidatorDecoded>, required: true },
    delegation: {
      type: Object as PropType<DelegationResponse>,
      required: true,
    },
  },
  components: { ModalBase, CopyText },
  setup(props) {
    const delegated = Number(
      convertLokiToOdin(props.delegation.balance?.amount)
    )

    const form = useForm({
      amount: [
        '',
        validators.required,
        validators.number,
        validators.sixDecimalNumber,
        ...validators.num(0.000001, delegated),
        validators.maxCharacters(32),
      ],
    })
    const isLoading = ref(false)
    const onSubmit = dialogs.getHandler('onSubmit')

    const submit = async () => {
      isLoading.value = true
      try {
        await callers.validatorUndelegate({
          delegatorAddress: wallet.account.address,
          validatorAddress: props.validator.operatorAddress,
          amount: coin(convertOdinToLoki(form.amount.val()), COINS_LIST.LOKI),
        })
        await useBalances().load()
        onSubmit()
        notifySuccess('Successfully undelegated')
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
</script>

<style scoped lang="scss"></style>

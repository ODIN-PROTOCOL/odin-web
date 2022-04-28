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
          <div class="app-form__field delegate-form-modal__field">
            <div class="app-form__field-row">
              <label class="app-form__field-lbl"> Available </label>
              <p
                :title="
                  $convertLokiToOdin(lokiBalance?.amount, {
                    withDenom: true,
                    forTitle: true,
                  })
                "
              >
                {{
                  $convertLokiToOdin(lokiBalance?.amount, { withDenom: true })
                }}
              </p>
            </div>
            <div class="app-form__field-row">
              <button
                class="app-btn app-btn_small app-btn_outlined"
                type="button"
                @click="maxAmount()"
                :disabled="isLoading || isEmptyBalance || isBalanceLowerThanFee"
              >
                Max amount
              </button>
            </div>
          </div>
          <div v-if="delegation && delegation.balance" class="app-form__field">
            <label class="app-form__field-lbl"> You delegated </label>
            <p
              :title="
                $convertLokiToOdin(delegation.balance?.amount, {
                  withDenom: true,
                  forTitle: true,
                })
              "
            >
              {{
                $convertLokiToOdin(delegation.balance?.amount, {
                  withDenom: true,
                })
              }}
            </p>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl">Amount</label>
            <div class="app-form__field-input-wrapper">
              <span>ODIN</span>
              <input
                class="app-form__field-input"
                name="delegate-amount"
                type="text"
                placeholder="1"
                v-model="form.amount"
                :disabled="isLoading || isEmptyBalance || isBalanceLowerThanFee"
              />
            </div>
            <p
              v-if="form.amountErr || isEmptyBalance || isBalanceLowerThanFee"
              class="app-form__field-err"
            >
              {{
                isBalanceLowerThanFee
                  ? 'Not enough tokens! Please make deposit'
                  : form.amountErr
              }}
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
import { computed, defineComponent, PropType, ref } from 'vue'
import { wallet } from '@/api/wallet'
import { callers } from '@/api/callers'
import { COINS_LIST, API_CONFIG } from '@/api/api-config'
import { DialogHandler, dialogs } from '@/helpers/dialogs'
import { handleError } from '@/helpers/errors'
import { preventIf } from '@/helpers/functions'
import { convertLokiToOdin, convertOdinToLoki } from '@/helpers/converters'
import { notifySuccess } from '@/helpers/notifications'
import { useForm, validators } from '@/composables/useForm'
import ModalBase from './ModalBase.vue'
import { ValidatorDecoded } from '@/helpers/validatorDecoders'
import { useBalances } from '@/composables/useBalances'
import { DelegationResponse } from 'cosmjs-types/cosmos/staking/v1beta1/staking'
import { coin, Coin } from '@cosmjs/amino'
import { big as bigMath } from '@/helpers/bigMath'

const defaultBalanceBlank: Coin = { amount: '0', denom: COINS_LIST.LOKI }

const DelegateFormDialog = defineComponent({
  props: {
    validator: { type: Object as PropType<ValidatorDecoded>, required: true },
    delegation: { type: Object as PropType<DelegationResponse> },
  },
  components: { ModalBase },
  setup(props) {
    const { get: getBalance, load: loadBalances } = useBalances()
    const lokiBalance: Coin = getBalance(COINS_LIST.LOKI) || defaultBalanceBlank
    const fee = ref(API_CONFIG.fee)
    const ODIN_MULTIPLIER = 0.000001

    const isEmptyBalance = computed(() => {
      return !Number(lokiBalance.amount)
    })
    const isBalanceLowerThanFee = computed(() => {
      return Number(lokiBalance.amount) < Number(fee.value)
    })

    const form = useForm({
      amount: [
        '',
        validators.required,
        validators.number,
        validators.sixDecimalNumber,
        ...validators.num(
          0.000001,
          Number(convertLokiToOdin(lokiBalance.amount))
        ),
        validators.maxCharacters(32),
      ],
    })
    const isLoading = ref(false)
    const onSubmit = dialogs.getHandler('onSubmit')

    const maxAmount = () => {
      const amount = bigMath.multiply(lokiBalance.amount, ODIN_MULTIPLIER)
      form.amount.val(amount.toString())
    }
    const submit = async () => {
      isLoading.value = true
      try {
        await callers.validatorDelegate({
          delegatorAddress: wallet.account.address,
          validatorAddress: props.validator.operatorAddress,
          amount: coin(convertOdinToLoki(form.amount.val()), COINS_LIST.LOKI),
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
      isEmptyBalance,
      submit,
      onClose: preventIf(dialogs.getHandler('onClose'), isLoading),
      maxAmount,
      isBalanceLowerThanFee,
    }
  },
})
export default DelegateFormDialog
export function showDelegateFormDialog(
  callbacks: {
    onSubmit?: DialogHandler
    onClose?: DialogHandler
  },
  props: { validator: ValidatorDecoded; delegation?: DelegationResponse }
): Promise<unknown | null> {
  return dialogs.show(DelegateFormDialog, callbacks, { props })
}
</script>

<style scoped lang="scss">
.delegate-form-modal {
  &__field {
    display: grid;
    grid:
      auto/
      minmax(1rem, 1fr)
      minmax(1rem, 1fr);
  }
}

@include respond-to(small) {
  .app-form {
    &__field-row:first-child {
      margin-bottom: 1rem;
    }
  }
  .delegate-form-modal {
    &__field {
      grid: none;
    }
  }
}
</style>

<template>
  <ModalBase class="delegate-form-modal__wrapper" @close="onClose()">
    <template #title>
      <h3 class="app-form__title">Delegate</h3>
    </template>

    <template #main>
      <form
        class="app-form load-fog delegate-form-modal"
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent="submit"
      >
        <div class="app-form__main">
          <div class="app-form__field delegate-form-modal__field-balance">
            <div
              class="delegate-form-modal__field-balance-row app-form__field-row"
            >
              <label class="app-form__field-lbl delegate-form-modal__field-lbl">
                Available
              </label>
              <p
                class="delegate-form-modal__field-balance-value"
                :title="$convertLokiToOdin(lokiBalance?.amount)"
              >
                {{
                  $convertLokiToOdin(lokiBalance?.amount, { withDenom: true })
                }}
              </p>
            </div>
            <div class="app-form__field delegate-form-modal__field-balance-row">
              <label class="app-form__field-lbl delegate-form-modal__field-lbl">
                You delegated
              </label>
              <p
                v-if="delegation && delegation.balance"
                class="delegate-form-modal__field-balance-value"
                :title="$convertLokiToOdin(delegation.balance?.amount)"
              >
                {{
                  $convertLokiToOdin(delegation.balance?.amount, {
                    withDenom: true,
                  })
                }}
              </p>
              <p v-else class="delegate-form-modal__field-balance-value">
                0 ODIN
              </p>
            </div>
          </div>

          <div class="app-form__field">
            <div class="delegate-form-modal__field-lbl-wrapper">
              <label class="app-form__field-lbl">Amount</label>
              <label
                class="app-table__link delegate-form-modal__field-lbl--max"
                @click="maxAmount()"
                :disabled="isLoading || isEmptyBalance || isBalanceLowerThanFee"
              >
                Max Amount
              </label>
            </div>
            <div class="app-form__field-input-wrapper">
              <span>ODIN</span>
              <input
                class="app-form__field-input"
                name="delegate-amount"
                type="text"
                placeholder="1"
                v-model="flattenForm.amount"
                :disabled="isLoading || isEmptyBalance || isBalanceLowerThanFee"
              />
            </div>
            <p
              v-if="
                flattenForm.amountErr || isEmptyBalance || isBalanceLowerThanFee
              "
              class="app-form__field-err"
            >
              {{
                isBalanceLowerThanFee
                  ? 'Not enough tokens! Please make deposit'
                  : flattenForm.amountErr
              }}
            </p>
          </div>
        </div>

        <div class="app-form__footer">
          <button
            class="app-btn w-full app-btn--medium"
            :disabled="!flattenForm.isValid || isLoading"
          >
            Delegate
          </button>
        </div>
      </form>
    </template>
  </ModalBase>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { wallet } from '@/api/wallet'
import { callers } from '@/api/callers'
import { COINS_LIST, API_CONFIG } from '@/api/api-config'
import { dialogs } from '@/helpers/dialogs'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { preventIf } from '@/helpers/functions'
import { convertLokiToOdin, convertOdinToLoki } from '@/helpers/converters'
import { useForm, validators } from '@/composables/useForm'
import { ModalBase } from '@/components/modals'
import { useBalances } from '@/composables/useBalances'
import { DelegationResponse } from 'cosmjs-types/cosmos/staking/v1beta1/staking'
import { coin, Coin } from '@cosmjs/amino'
import { big as bigMath } from '@/helpers/bigMath'
import { ValidatorInfoModify } from '@/helpers/validatorHelpers'

const defaultBalanceBlank: Coin = { amount: '0', denom: COINS_LIST.LOKI }

const props = defineProps<{
  validator: ValidatorInfoModify
  delegation: DelegationResponse
}>()

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
    ...validators.num(0.000001, Number(convertLokiToOdin(lokiBalance.amount))),
    validators.maxCharacters(32),
  ],
})
const flattenForm = form.flatten()
const isLoading = ref(false)
const onSubmit = dialogs.getHandler('onSubmit')
const onClose = preventIf(dialogs.getHandler('onClose'), isLoading)
const maxAmount = () => {
  const amount = bigMath.multiply(lokiBalance.amount, ODIN_MULTIPLIER)
  form.amount.val(amount.toString())
}
const submit = async () => {
  isLoading.value = true
  try {
    await callers.validatorDelegate({
      delegatorAddress: wallet.account.address,
      validatorAddress: props.validator.info.operatorAddress,
      amount: coin(convertOdinToLoki(form.amount.val()), COINS_LIST.LOKI),
    })
    await loadBalances()
    onSubmit()
    handleNotificationInfo('Successfully delegated', TYPE_NOTIFICATION.success)
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  isLoading.value = false
}
</script>

<style scoped lang="scss">
.delegate-form-modal {
  padding-top: 0.8rem;
}
.delegate-form-modal__field-lbl-wrapper {
  display: flex;
  justify-content: space-between;
}
.delegate-form-modal__field-balance-row {
  background: var(--clr__modal-field-bg);
  border-radius: 0.8rem;
  padding: 0.8rem;
  width: 100%;

  &:first-child {
    margin-right: 1.6rem;
  }
}
.delegate-form-modal__field-balance {
  display: flex;
  margin-bottom: 2.4rem;
  position: relative;
}
.delegate-form-modal__field-lbl {
  font-weight: 400;
  color: var(--clr__modal-backdrop-bg);
  margin: 0;
  &--max {
    cursor: pointer;
    &:hover {
      opacity: 0.7;
    }
    &:active {
      transform: scale(0.9);
    }
  }
}
.delegate-form-modal__field-balance-value {
  font-weight: 600;
  font-size: 1.6rem;
  line-height: 2.4rem;
}

@include respond-to(small) {
  .delegate-form-modal__field-balance {
    gap: 1.6rem;
    flex-direction: column;
  }
}
</style>

<template>
  <ModalBase
    class="undelegate-form-modal__wrapper"
    scheme="no-margin-title"
    @close="onClose()"
  >
    <template #title>
      <h3 class="app-form__title">Undelegate</h3>
    </template>

    <template #main>
      <form
        class="undelegate-form-modal app-form load-fog"
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent
      >
        <div class="app-form__main">
          <div class="undelegate-form-modal__field-title app-form__field-title">
            <label class="undelegate-form-modal__field-lbl">From</label>
            <CopyText
              class="undelegate-form-modal__copy-text"
              :text="validator.info.operatorAddress"
              :title="validator.info.operatorAddress"
              :display-text="$cropAddress(validator.info.operatorAddress)"
            />
          </div>
          <div class="undelegate-form-modal__field-wrapper">
            <div class="undelegate-form-modal__field-balance">
              <label class="undelegate-form-modal__field-lbl">
                Min delegation
              </label>
              <p
                class="undelegate-form-modal__field-balance-value"
                :title="
                  $convertLokiToOdin(
                    validator.commissions[0]?.minSelfDelegation,
                  )
                "
              >
                {{
                  $convertLokiToOdin(
                    validator.commissions[0]?.minSelfDelegation,
                  )
                }}
              </p>
            </div>

            <div
              v-if="delegation && delegation.balance"
              class="undelegate-form-modal__field-balance"
            >
              <label class="undelegate-form-modal__field-lbl">
                You delegated
              </label>
              <p
                class="undelegate-form-modal__field-balance-value"
                :title="$convertLokiToOdin(delegation.balance.amount)"
              >
                {{
                  $convertLokiToOdin(delegation.balance.amount, {
                    withDenom: true,
                  })
                }}
              </p>
            </div>
          </div>

          <div class="undelegate-form-modal__field">
            <label class="undelegate-form-modal__field-lbl_black">
              Amount
            </label>
            <div
              class="undelegate-form-modal__field-input-wrapper app-form__field-input-wrapper"
            >
              <span>ODIN</span>
              <input
                class="app-form__field-input"
                name="undelegate-amount"
                type="text"
                placeholder="1"
                v-model="flattenForm.amount"
                :disabled="isLoading"
              />
            </div>
            <p
              v-if="flattenForm.amountErr"
              class="undelegate-form-modal__field-err app-form__field-err"
            >
              {{ flattenForm.amountErr }}
            </p>
          </div>
          <div class="undelegate-form-modal__field-info">
            <InfoIcon class="info-icon" />
            <span
              >Your funds will be credited in
              {{ START_VALUE.delegatePeriod }}</span
            >
          </div>
        </div>

        <div class="app-form__footer">
          <button
            class="app-btn w-full app-btn--medium"
            type="submit"
            @click="submit()"
            :disabled="!flattenForm.isValid || isLoading"
          >
            Undelegate
          </button>
        </div>
      </form>
    </template>
  </ModalBase>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { wallet } from '@/api/wallet'
import { callers } from '@/api/callers'
import { COINS_LIST, START_VALUE } from '@/api/api-config'
import { dialogs } from '@/helpers/dialogs'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { preventIf } from '@/helpers/functions'
import { convertLokiToOdin, convertOdinToLoki } from '@/helpers/converters'
import { useForm, validators } from '@/composables/useForm'
import { coin } from '@cosmjs/amino'
import { DelegationResponse } from 'cosmjs-types/cosmos/staking/v1beta1/staking'
import { useBalances } from '@/composables/useBalances'
import { ValidatorInfoModify } from '@/helpers/validatorHelpers'
import { ModalBase } from '@/components/modals'
import { InfoIcon } from '@/components/icons'
import CopyText from '@/components/CopyText.vue'

const props = defineProps<{
  validator: ValidatorInfoModify
  delegation: DelegationResponse
}>()

const delegated = Number(
  convertLokiToOdin(props.delegation.balance?.amount, { onlyNumber: true }),
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
const flattenForm = form.flatten()
const onSubmit = dialogs.getHandler('onSubmit')
const onClose = preventIf(dialogs.getHandler('onClose'), isLoading)
const submit = async () => {
  if (!form.isValid.value) return

  isLoading.value = true
  try {
    await callers.validatorUndelegate({
      delegatorAddress: wallet.account.address,
      validatorAddress: props.validator.info.operatorAddress,
      amount: coin(convertOdinToLoki(form.amount.val()), COINS_LIST.LOKI),
    })
    await useBalances().load()
    onSubmit()
    handleNotificationInfo(
      'Successfully undelegated',
      TYPE_NOTIFICATION.success,
    )
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  isLoading.value = false
}
</script>

<style scoped lang="scss">
.undelegate-form-modal__copy-text {
  margin: 0 1rem;
}
.undelegate-form-modal {
  margin-top: 0.5rem;
  font-size: 1.4rem;
  line-height: 2rem;
}
.undelegate-form-modal__field-wrapper {
  display: flex;
  margin-bottom: 2.4rem;
}
.undelegate-form-modal__field-balance {
  background: var(--clr__modal-field-bg);
  border-radius: 0.8rem;
  padding: 0.8rem;
  width: 100%;
  &:first-child {
    margin-right: 1.6rem;
  }
}
.undelegate-form-modal__field-balance-value {
  font-weight: 600;
  font-size: 1.6rem;
  line-height: 2.4rem;
}
.undelegate-form-modal__field-lbl {
  font-weight: 400;
  color: var(--clr__modal-backdrop-bg);
  margin: 0;
}
.undelegate-form-modal__field-lbl_black {
  font-size: 1.6rem;
  line-height: 2.4rem;
  color: var(--clr__text);
}
.undelegate-form-modal__field-title {
  display: flex;
  margin-bottom: 2.4rem;
}
.undelegate-form-modal__field {
  margin: 0;
}
.undelegate-form-modal__field-info {
  font-weight: 400;
  color: var(--clr__modal-backdrop-bg);
  display: flex;
  align-items: center;
  margin-top: 1.6rem;
}
.info-icon {
  margin-right: 0.9rem;
}
.undelegate-form-modal__field-input-wrapper {
  margin-top: 0.8rem;
}
.undelegate-form-modal__field-err {
  margin-top: 0.8rem;
}
@include respond-to(small) {
  .undelegate-form-modal__field-wrapper {
    display: flex;
  }
}
</style>

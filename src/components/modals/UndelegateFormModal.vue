<template>
  <ModalBase
    class="undelegate-form-modal__wrapper"
    @close="onClose()"
    :isAddMargin="false"
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
              class="copy-text"
              :text="validator.operatorAddress"
              :title="validator.operatorAddress"
              :displayText="$cropAddress(validator.operatorAddress)"
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
                  $convertLokiToOdin(validator.minSelfDelegation, {
                    withDenom: true,
                    forTitle: true,
                  })
                "
              >
                {{
                  $convertLokiToOdin(validator.minSelfDelegation, {
                    withDenom: true,
                  })
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
                :title="
                  $convertLokiToOdin(delegation.balance.amount, {
                    withDenom: true,
                    forTitle: true,
                  })
                "
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
                v-model="form.amount"
                :disabled="isLoading"
              />
            </div>
            <p
              v-if="form.amountErr"
              class="undelegate-form-modal__field-err app-form__field-err"
            >
              {{ form.amountErr }}
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
import { COINS_LIST, START_VALUE } from '@/api/api-config'
import { DialogHandler, dialogs } from '@/helpers/dialogs'
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
import { DelegationResponse } from 'cosmjs-types/cosmos/staking/v1beta1/staking'
import InfoIcon from '@/components/icons/InfoIcon.vue'

const UndelegateFormDialog = defineComponent({
  props: {
    validator: { type: Object as PropType<ValidatorDecoded>, required: true },
    delegation: {
      type: Object as PropType<DelegationResponse>,
      required: true,
    },
  },
  components: { ModalBase, CopyText, InfoIcon },
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
      if (!form.isValid.value) return

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
      START_VALUE,
    }
  },
})
export default UndelegateFormDialog
export function showUndelegateFormDialog(
  callbacks: {
    onSubmit?: DialogHandler
    onClose?: DialogHandler
  },
  props: { validator: ValidatorDecoded; delegation: DelegationResponse }
): Promise<unknown | null> {
  return dialogs.show(UndelegateFormDialog, callbacks, { props })
}
</script>

<style scoped lang="scss">
.copy-text {
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

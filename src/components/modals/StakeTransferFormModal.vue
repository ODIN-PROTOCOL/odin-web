<template>
  <ModalBase
    class="stake-transfer-form-modal__wrapper"
    :scheme="SCHEMES.paddingContent31px"
    @close="onClose()"
  >
    <template #title>
      <h3 class="app-form__title">Stake transfer</h3>
    </template>
    <template #main>
      <form
        class="stake-transfer-form-modal app-form load-fog"
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent
      >
        <div class="app-form__main stake-transfer-form-modal__main">
          <div class="stake-transfer-form-modal__select-wrapper">
            <div class="stake-transfer-form-modal__select-header">
              <label class="stake-transfer-form-modal__select-header-title"
                >From</label
              >
            </div>
            <VuePicker class="vue-pick" v-model="form.sender">
              <template #dropdownInner>
                <div class="vue-pick__dropdown-custom">
                  <VuePickerOption
                    v-for="(validator, key) in delegatedValidators"
                    :key="key"
                    :value="validator?.info.operatorAddress"
                    :isDisabled="isHaveSameValueInReceiver(validator)"
                  >
                    <div class="stake-transfer-form-modal__option frame">
                      <div class="stake-transfer-form-modal__option-info">
                        <label
                          class="stake-transfer-form-modal__option-moniker"
                          :title="validator.descriptions[0]?.moniker || '-'"
                        >
                          {{ validator.descriptions[0]?.moniker || '-' }}
                        </label>
                        <label class="stake-transfer-form-modal__option-adress">
                          {{ $cropAddress(validator?.info.operatorAddress) }}
                        </label>
                      </div>
                      <p
                        class="stake-transfer-form-modal__option-balance"
                        :title="
                          $convertLokiToOdin(
                            validator.delegation?.balance?.amount,
                            {
                              onlyNumber: true,
                            },
                          )
                        "
                      >
                        {{
                          $convertLokiToOdin(
                            validator.delegation?.balance?.amount,
                            {
                              withDenom: true,
                            },
                          )
                        }}
                      </p>
                    </div>
                  </VuePickerOption>
                </div>
              </template>
            </VuePicker>
          </div>

          <div class="stake-transfer-form-modal__select-wrapper">
            <div class="stake-transfer-form-modal__select-header">
              <label class="stake-transfer-form-modal__select-header-title"
                >To</label
              >
              <button
                @click="changeField()"
                class="stake-transfer-form-modal__select-header-btn"
              >
                {{
                  isShowToAdressOption ? 'Enter address' : 'Select validator'
                }}
              </button>
            </div>
            <VuePicker
              v-if="isShowToAdressOption"
              class="vue-pick"
              v-model="form.receiver"
            >
              <template #dropdownInner>
                <div class="vue-pick__dropdown-custom">
                  <VuePickerOption
                    v-for="(validator, key) in filtredValidators"
                    :key="key"
                    :value="validator?.info.operatorAddress"
                    :isDisabled="isHaveSameValueInSender(validator)"
                  >
                    <div class="stake-transfer-form-modal__option frame">
                      <div class="stake-transfer-form-modal__option-info">
                        <label
                          class="stake-transfer-form-modal__option-moniker"
                          :title="validator.descriptions[0]?.moniker || '-'"
                        >
                          {{ validator.descriptions[0]?.moniker || '-' }}
                        </label>
                        <label class="stake-transfer-form-modal__option-adress">
                          {{ $cropAddress(validator?.info.operatorAddress) }}
                        </label>
                      </div>
                      <p
                        v-if="validator.delegation"
                        class="stake-transfer-form-modal__option-balance"
                        :title="
                          $convertLokiToOdin(
                            validator.delegation?.balance?.amount,
                            {
                              onlyNumber: true,
                            },
                          )
                        "
                      >
                        {{
                          $convertLokiToOdin(
                            validator.delegation?.balance?.amount,
                            {
                              withDenom: true,
                            },
                          )
                        }}
                      </p>
                    </div>
                  </VuePickerOption>
                </div>
              </template>
            </VuePicker>
            <div v-else class="stake-transfer-form-modal__handler-input frame">
              <label class="stake-transfer-form-modal__handler-input-title">
                Address
              </label>
              <input
                class="app-form__field-input"
                name="undelegate-amount"
                type="text"
                placeholder="odinvaloper1cgfdwtrqfdrzh4z8rkcyx8g4jv22v8wgav3rjx"
                v-model="form.receiver"
                :disabled="isLoading"
              />
              <p
                v-if="form.receiverErr"
                class="stake-transfer-form-modal__field-err app-form__field-err"
              >
                {{ form.receiverErr }}
              </p>
              <div
                v-if="delegation[form.receiver] && !form.receiverErr"
                class="stake-transfer-form-modal__field-balance"
              >
                <label class="stake-transfer-form-modal__field-balance-lbl"
                  >You delegated</label
                >
                <p
                  class="stake-transfer-form-modal__field-balance-value"
                  :title="
                    $convertLokiToOdin(
                      delegation[form.receiver]?.balance?.amount,
                      {
                        onlyNumber: true,
                      },
                    )
                  "
                >
                  {{
                    $convertLokiToOdin(
                      delegation[form.receiver]?.balance?.amount,
                    )
                  }}
                </p>
              </div>
            </div>
          </div>

          <div class="stake-transfer-form-modal__field">
            <label class="stake-transfer-form-modal__field-lbl">Amount</label>
            <div
              class="stake-transfer-form-modal__field-input-wrapper app-form__field-input-wrapper"
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
              class="stake-transfer-form-modal__field-err app-form__field-err"
            >
              {{ form.amountErr }}
            </p>
          </div>
        </div>

        <div class="app-form__footer stake-transfer-form-modal__footer">
          <button
            class="app-btn w-full app-btn--medium"
            type="button"
            @click="submit()"
            :disabled="!form.isValid || isLoading"
          >
            Transfer
          </button>
        </div>
      </form>
    </template>
  </ModalBase>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  watch,
  computed,
  ComputedRef,
} from 'vue'
import { wallet } from '@/api/wallet'
import { callers } from '@/api/callers'
import { COINS_LIST } from '@/api/api-config'
import { DialogHandler, dialogs } from '@/helpers/dialogs'
import { preventIf } from '@/helpers/functions'
import { convertLokiToOdin, convertOdinToLoki } from '@/helpers/converters'
import { useForm, validators } from '@/composables/useForm'
import ModalBase, { SCHEMES } from './ModalBase.vue'
import { ValidatorInfoModify } from '@/helpers/validatorHelpers'
import { coin } from '@cosmjs/amino'
import { DelegationResponse } from 'cosmjs-types/cosmos/staking/v1beta1/staking'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { VuePicker, VuePickerOption } from '@invisiburu/vue-picker'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'

const StakeTransferFormModal = defineComponent({
  props: {
    validators: {
      type: Array as PropType<ValidatorInfoModify[]>,
      required: true,
    },
    delegation: {
      type: Object,
      required: true,
    },
  },
  components: { ModalBase, VuePicker, VuePickerOption },
  setup(props) {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const delegatedAdress = Object.keys(props.delegation)
    const isShowToAdressOption = ref(true)
    const delegatedValidators = ref()
    const allValidators = ref<Array<ValidatorInfoModify>>(props.validators)
    const maxAmount: ComputedRef<number> = computed(
      () =>
        Number(
          convertLokiToOdin(
            props.delegation[form.sender.val()]?.balance?.amount,
            {
              onlyNumber: true,
            },
          ),
        ) || 0,
    )
    const form = useForm({
      amount: [
        '',
        validators.required,
        validators.number,
        validators.sixDecimalNumber,
        validators.min(0.000001),
        validators.maxReactive(maxAmount),
        validators.maxCharacters(32),
      ],
      sender: [
        '',
        validators.required,
        validators.odinValidator,
        validators.maxCharacters(50),
        validators.minCharacters(50),
      ],
      receiver: [
        '',
        validators.required,
        validators.odinValidator,
        validators.maxCharacters(50),
        validators.minCharacters(50),
      ],
    })
    delegatedValidators.value = delegatedAdress.map(
      (validatorAddress: string) => {
        return {
          ...allValidators.value.find(
            (validator: ValidatorInfoModify) =>
              validator?.info.operatorAddress === validatorAddress,
          ),
          delegation: props.delegation[validatorAddress],
        }
      },
    )
    form.sender.val(delegatedValidators.value[0].info.operatorAddress)
    const filtredValidators = computed(() =>
      allValidators.value.map((validator: ValidatorInfoModify) => {
        return {
          ...validator,
          delegation: props.delegation[validator?.info.operatorAddress] || {},
        }
      }),
    )

    if (allValidators.value[0]?.info.operatorAddress === form.sender.val()) {
      form.receiver.val(filtredValidators.value[1]?.info.operatorAddress)
    } else {
      form.receiver.val(filtredValidators.value[0]?.info.operatorAddress)
    }
    form.amount.val(String(maxAmount.value))

    const findReceiverValidator = () => {
      if (!isShowToAdressOption.value && !form.receiver.errorIfDirty.value) {
        if (form.receiver.val() === form.sender.val()) {
          form.receiver.err('Choose another validator')
        } else {
          const findValidator = filtredValidators.value.find(
            (item: ValidatorInfoModify) =>
              item?.info.operatorAddress === form.receiver.val(),
          )
          if (!findValidator) {
            form.receiver.err('Validator not found')
          }
        }
      }
    }

    watch(
      () => form.sender.val(),
      () => {
        try {
          if (form.receiver.val() === form.sender.val()) {
            form.receiver.err('Choose another validator')
            return
          } else if (form.receiver.isDirty.value) {
            form.receiver.err(null)
            findReceiverValidator()
          }
          form.amount.reset()
          form.amount.val(String(maxAmount.value))
        } catch (error) {
          form.receiver.err('Validator not found')
        }
      },
    )
    watch(
      () => form.receiver.val(),
      () => {
        if (!form.receiver.errorIfDirty.value) {
          findReceiverValidator()
        }
      },
    )
    const isHaveSameValueInReceiver = (validator: ValidatorInfoModify) => {
      return validator.info.operatorAddress === form.receiver.val()
    }
    const isHaveSameValueInSender = (validator: ValidatorInfoModify) => {
      return validator.info.operatorAddress === form.sender.val()
    }
    const changeField = async () => {
      allValidators.value = props.validators
      isShowToAdressOption.value = !isShowToAdressOption.value
      if (allValidators.value[0]?.info.operatorAddress === form.sender.val()) {
        form.receiver.val(allValidators.value[1]?.info.operatorAddress)
      } else {
        form.receiver.val(allValidators.value[0]?.info.operatorAddress)
      }
    }
    const onSubmit = dialogs.getHandler('onSubmit')
    const submit = async () => {
      if (!form.isValid.value) return
      lockLoading()
      try {
        await callers.validatorDelegateToAnotherValidator({
          validatorSrcAddress: String(form.sender.val()),
          validatorDstAddress: String(form.receiver.val()),
          delegatorAddress: wallet.account.address,
          amount: coin(convertOdinToLoki(form.amount.val()), COINS_LIST.LOKI),
        })
        onSubmit()
        handleNotificationInfo(
          'Successfully delegated',
          TYPE_NOTIFICATION.success,
        )
      } catch (error) {
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.info)
      }
      releaseLoading()
    }
    return {
      form: form.flatten(),
      submit,
      onClose: preventIf(dialogs.getHandler('onClose'), isLoading),
      changeField,
      isHaveSameValueInReceiver,
      isHaveSameValueInSender,
      isLoading,
      delegatedValidators,
      isShowToAdressOption,
      filtredValidators,
      SCHEMES,
    }
  },
})
export default StakeTransferFormModal
export function showUndelegateFormDialog(
  callbacks: {
    onSubmit?: DialogHandler
    onClose?: DialogHandler
  },
  props: { validators: ValidatorInfoModify; delegation: DelegationResponse },
): Promise<unknown | null> {
  return dialogs.show(StakeTransferFormModal, callbacks, { props })
}
</script>

<style scoped lang="scss">
.stake-transfer-form-modal__footer,
.stake-transfer-form-modal__main {
  padding: 0 1rem;
}
.frame {
  padding: 1.2rem 4.8rem 1.2rem 1.6rem;
  gap: 0.8rem;
  box-shadow: 0 0 0.2rem var(--clr__wallet-info-box-shadow),
    0 0.4rem 1.2rem var(--clr__wallet-info-box-shadow);
  border-radius: 0.8rem;
}
.vue-pick__dropdown-custom {
  .frame {
    box-shadow: none;
  }
}
.stake-transfer-form-modal__select-wrapper {
  margin-bottom: 2.8rem;
}
.stake-transfer-form-modal__select-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
}
.stake-transfer-form-modal__select-header-title {
  font-size: 2rem;
}
.stake-transfer-form-modal__select-header-btn {
  font-size: 1.4rem;
  line-height: 2rem;
  color: var(--clr__action);
}
.stake-transfer-form-modal__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 6.8rem;
  margin-right: 0;
}
.stake-transfer-form-modal__option-info {
  display: flex;
  flex-direction: column;
  max-width: 15rem;
}
.stake-transfer-form-modal__option-moniker,
.stake-transfer-form-modal__option-balance,
.stake-transfer-form-modal__field-balance-value {
  font-weight: 600;
}
.stake-transfer-form-modal__option-adress {
  font-weight: 400;
  font-size: 1.4rem;
  line-height: 2rem;
}
.stake-transfer-form-modal__option-adress,
.stake-transfer-form-modal__option-balance {
  color: var(--clr__text-muted);
}
.stake-transfer-form-modal__option-moniker,
.stake-transfer-form-modal__option-balance {
  @include ellipsis();
}
.stake-transfer-form-modal {
  margin-top: 0.5rem;
}
.stake-transfer-form-modal__field-wrapper {
  display: flex;
  margin-bottom: 2.4rem;
}
.stake-transfer-form-modal__field-balance {
  background: var(--clr__modal-field-bg);
  border-radius: 0.8rem;
  padding: 0.8rem;
  width: 100%;
  &:first-child {
    margin-right: 1.6rem;
  }
}
.stake-transfer-form-modal__field-balance-lbl {
  font-weight: 400;
  color: var(--clr__modal-backdrop-bg);
  margin: 0;
}
.stake-transfer-form-modal__field-title {
  display: flex;
  margin-bottom: 2.4rem;
}
.stake-transfer-form-modal__field {
  margin: 0;
}
.stake-transfer-form-modal__field-input-wrapper,
.stake-transfer-form-modal__field-err {
  margin-top: 0.8rem;
}
.stake-transfer-form-modal__handler-input {
  display: flex;
  flex-direction: column;
  padding: 1.2rem 1.6rem;
}
@include respond-to(tablet) {
  .stake-transfer-form-modal__option-info {
    max-width: 7rem;
  }
}
</style>

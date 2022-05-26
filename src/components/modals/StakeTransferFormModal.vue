<template>
  <ModalBase class="stake-transfer-form-modal__wrapper" @close="onClose()">
    <template #title>
      <h3 class="app-form__title">Stake transfer</h3>
    </template>
    <template #main>
      <form
        class="stake-transfer-form-modal app-form load-fog"
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent
      >
        <div class="app-form__main">
          <div class="stake-transfer-form-modal__select-wrapper">
            <div class="stake-transfer-form-modal__select-header">
              <label class="stake-transfer-form-modal__select-header-title"
                >From</label
              >
            </div>
            <VuePicker class="vue-pick" v-model="form.from">
              <template #dropdownInner>
                <div class="vue-picker__dropdown-custom">
                  <VuePickerOption
                    v-for="(val, key) in delegatedValidators"
                    :key="key"
                    :value="val.operatorAddress"
                  >
                    <div class="stake-transfer-form-modal__option frame">
                      <div class="stake-transfer-form-modal__option-info">
                        <label
                          class="stake-transfer-form-modal__option-moniker"
                        >
                          {{ val.description.moniker }}
                        </label>
                        <label class="stake-transfer-form-modal__option-adress">
                          {{ $cropAddress(val.operatorAddress) }}
                        </label>
                      </div>
                      <p
                        class="stake-transfer-form-modal__option-balance"
                        :title="
                          $convertLokiToOdin(val.delegation.balance?.amount, {
                            onlyNumber: true,
                          })
                        "
                      >
                        {{ $convertLokiToOdin(val.delegation.balance?.amount) }}
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
              v-model="form.to"
            >
              <template #dropdownInner>
                <div class="vue-picker__dropdown-custom">
                  <VuePickerOption
                    v-for="(validator, key) in allValidators"
                    :key="key"
                    :value="validator.operatorAddress"
                  >
                    <div class="stake-transfer-form-modal__option frame">
                      <div class="stake-transfer-form-modal__option-info">
                        <label
                          class="stake-transfer-form-modal__option-moniker"
                        >
                          {{ validator.description.moniker }}
                        </label>
                        <label class="stake-transfer-form-modal__option-adress">
                          {{ $cropAddress(validator.operatorAddress) }}
                        </label>
                      </div>
                      <p
                        v-if="validator.delegation"
                        class="stake-transfer-form-modal__option-balance"
                        :title="
                          $convertLokiToOdin(
                            validator.delegation.balance?.amount,
                            {
                              onlyNumber: true,
                            }
                          )
                        "
                      >
                        {{
                          $convertLokiToOdin(
                            validator.delegation.balance?.amount
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
                v-model="form.to"
                :disabled="isLoading"
              />
              <p
                v-if="form.toErr"
                class="stake-transfer-form-modal__field-err app-form__field-err"
              >
                {{ form.toErr }}
              </p>
              <div
                v-if="allValidators[0].delegation"
                class="stake-transfer-form-modal__field-balance"
              >
                <label class="stake-transfer-form-modal__field-lbl"
                  >You delegated</label
                >
                <p
                  class="stake-transfer-form-modal__field-balance-value"
                  :title="
                    $convertLokiToOdin(
                      allValidators[0].delegation.balance?.amount,
                      {
                        onlyNumber: true,
                      }
                    )
                  "
                >
                  {{
                    $convertLokiToOdin(
                      allValidators[0].delegation.balance?.amount
                    )
                  }}
                </p>
              </div>
            </div>
          </div>

          <div class="stake-transfer-form-modal__field">
            <label class="stake-transfer-form-modal__field-lbl_black">
              Amount
            </label>
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

        <div class="app-form__footer">
          <button
            class="app-btn"
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
import { defineComponent, PropType, ref, watch } from 'vue'
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
import { ValidatorDecoded } from '@/helpers/validatorDecoders'
import { coin } from '@cosmjs/amino'
import { DelegationResponse } from 'cosmjs-types/cosmos/staking/v1beta1/staking'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { VuePicker, VuePickerOption } from '@invisiburu/vue-picker'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'

const StakeTransferFormModal = defineComponent({
  props: {
    validators: {
      type: Object as PropType<ValidatorDecoded[]>,
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
    const allValidators = ref()
    delegatedValidators.value = delegatedAdress.map((item: string) => {
      return {
        ...props.validators.find(
          (validator: ValidatorDecoded) => validator.operatorAddress === item
        ),
        delegation: props.delegation[item],
      }
    })
    allValidators.value = props.validators.map((item: ValidatorDecoded) => {
      return {
        ...item,
        delegation: props.delegation[item.operatorAddress] || {},
      }
    })

    const maxAmount = ref(
      Number(
        convertLokiToOdin(
          delegatedValidators.value[0].delegation.balance?.amount,
          {
            onlyNumber: true,
          }
        )
      )
    )
    const form = useForm({
      amount: [
        '',
        validators.required,
        validators.number,
        validators.sixDecimalNumber,
        validators.min(0.000001),
        validators.max(maxAmount.value),
        validators.maxCharacters(32),
      ],
      from: [
        delegatedValidators.value[0].operatorAddress,
        validators.required,
        validators.odinValidator,
        validators.maxCharacters(64),
      ],
      to: [
        allValidators.value[0].operatorAddress,
        validators.required,
        validators.odinValidator,
        validators.maxCharacters(64),
      ],
    })
    watch(
      () => form.from.val(),
      () => {
        // How to make reactive in form.amount field
        maxAmount.value = Number(
          convertLokiToOdin(props.delegation[form.from.val()].balance?.amount, {
            onlyNumber: true,
          })
        )
        console.log(maxAmount.value)
        form.amount.reset()
        form.amount.addValidator(validators.max(maxAmount.value))
      }
    )
    watch(
      () => form.to.val(),
      async () => {
        if (!isShowToAdressOption.value) {
          setTimeout(async () => {
            try {
              const resp = await callers.getValidator(String(form.to.val()))
              if (isShowToAdressOption.value || !resp.validator) return
              console.log(!resp.validator)

              allValidators.value = [
                {
                  ...resp.validator,
                  delegation: props.delegation[resp.validator?.operatorAddress],
                },
              ]
            } catch (error) {
              form.from.err('Validator not found')
            }
          }, 2000)
        }
      }
    )
    const changeField = async () => {
      form.to.val(props.validators[0].operatorAddress)
      isShowToAdressOption.value = !isShowToAdressOption.value
      allValidators.value = props.validators.map((item: ValidatorDecoded) => {
        return {
          ...item,
          delegation: props.delegation[item.operatorAddress] || {},
        }
      })
    }
    const onSubmit = dialogs.getHandler('onSubmit')
    const submit = async () => {
      if (!form.isValid.value) return
      lockLoading()

      try {
        await callers.validatorDelegateToAnotherValidator({
          validatorSrcAddress: String(form.from.val()),
          validatorDstAddress: String(form.to.val()),
          delegatorAddress: wallet.account.address,
          amount: coin(convertOdinToLoki(form.amount.val()), COINS_LIST.LOKI),
        })
        onSubmit()
        notifySuccess('Successfully delegated')
      } catch (error) {
        handleError(error as Error)
      }
      releaseLoading()
    }
    return {
      form: form.flatten(),
      isLoading,
      submit,
      onClose: preventIf(dialogs.getHandler('onClose'), isLoading),
      START_VALUE,
      delegatedValidators,
      changeField,
      isShowToAdressOption,
      allValidators,
    }
  },
})
export default StakeTransferFormModal
export function showUndelegateFormDialog(
  callbacks: {
    onSubmit?: DialogHandler
    onClose?: DialogHandler
  },
  props: { validators: ValidatorDecoded; delegation: DelegationResponse }
): Promise<unknown | null> {
  return dialogs.show(StakeTransferFormModal, callbacks, { props })
}
</script>

<style scoped lang="scss">
.vue-picker__dropdown-custom {
  .frame {
    box-shadow: none;
  }
}
.vue-picker__dropdown-custom .vue-picker-option:hover:not(:disabled),
.vue-picker__dropdown-custom .vue-picker-option_cur {
  font-weight: 600;
  color: #007bff;
  background: rgba(204, 228, 255, 0.4);
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
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;
}

.stake-transfer-form-modal__select-header-btn {
  display: flex;
  align-items: center;
  text-align: center;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #007bff;
}
.frame {
  padding: 12px 48px 12px 16px;
  gap: 8px;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.08), 0px 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
}
.stake-transfer-form-modal__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 48px 12px 16px;
  gap: 8px;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.08), 0px 4px 12px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  // width: 328px;
  height: 68px;
  margin-right: 0;
}
.stake-transfer-form-modal__option-info {
  display: flex;
  flex-direction: column;
}
.stake-transfer-form-modal__option-moniker {
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
}

.stake-transfer-form-modal__option-adress {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
}

.stake-transfer-form-modal__option-balance {
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #6c757d;
}

.stake-transfer-form-modal__copy-text {
  margin: 0 1rem;
}
.stake-transfer-form-modal {
  margin-top: 0.5rem;
  font-size: 1.4rem;
  line-height: 2rem;
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
.stake-transfer-form-modal__field-balance-value {
  font-weight: 600;
  font-size: 1.6rem;
  line-height: 2.4rem;
}
.stake-transfer-form-modal__field-lbl {
  font-weight: 400;
  color: var(--clr__modal-backdrop-bg);
  margin: 0;
}
.stake-transfer-form-modal__field-lbl_black {
  font-size: 1.6rem;
  line-height: 2.4rem;
  color: var(--clr__text);
}
.stake-transfer-form-modal__field-title {
  display: flex;
  margin-bottom: 2.4rem;
}
.stake-transfer-form-modal__field {
  margin: 0;
}
.stake-transfer-form-modal__field-info {
  font-weight: 400;
  color: var(--clr__modal-backdrop-bg);
  display: flex;
  align-items: center;
  margin-top: 1.6rem;
}
.info-icon {
  margin-right: 0.9rem;
}
.stake-transfer-form-modal__field-input-wrapper {
  margin-top: 0.8rem;
}
.stake-transfer-form-modal__field-err {
  margin-top: 0.8rem;
}
.stake-transfer-form-modal__handler-input {
  display: flex;
  flex-direction: column;
  padding: 1.2rem 1.6rem;
}
@include respond-to(small) {
  .stake-transfer-form-modal__field-wrapper {
    display: flex;
  }
}
</style>

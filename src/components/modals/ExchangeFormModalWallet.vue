<template>
  <ModalBase @close="onClose()">
    <template #title>
      <h3 class="app-form__title">Exchange</h3>
    </template>

    <template #main>
      <form
        class="app-form load-fog"
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent
      >
        <div class="app-form__main">
          <div class="app-form__row">
            <div class="app-form__field app-form__field_small">
              <label class="app-form__field-lbl">Asset</label>
              <VuePicker
                class="_vue-picker"
                placeholder="Exchange from"
                v-model="exchangeFrom"
              >
                <template #dropdownInner>
                  <div class="_vue-picker__dropdown-custom">
                    <VuePickerOption value="loki" text="LOKI">
                      LOKI
                    </VuePickerOption>
                  </div>
                  <div class="_vue-picker__dropdown-custom">
                    <VuePickerOption value="odin" text="ODIN">
                      ODIN
                    </VuePickerOption>
                  </div>
                </template>
              </VuePicker>
            </div>

            <div class="app-form__field">
              <label class="app-form__field-lbl">Amount</label>
              <input
                class="app-form__field-input"
                name="exchange-from-amount"
                type="number"
                placeholder="0"
                v-model="form.amount"
                :disabled="isLoading || exchangeFrom === exchangeTo"
              />
              <p v-if="form.amountErr" class="app-form__field-err">
                {{ form.amountErr }}
              </p>
            </div>
          </div>

          <div class="app-form__row app-form__row_center mg-b16 mg-t16">
            <button class="app-form__exchange-btn" @click="changeHandler()">
              <ExchangeIcon />
            </button>
            <span class="app-form__exchange-rate">{{ rateText }}</span>
          </div>

          <div class="app-form__row">
            <div class="app-form__field app-form__field_small">
              <label class="app-form__field-lbl">Asset</label>
              <VuePicker
                class="_vue-picker"
                placeholder="Exchange to"
                v-model="exchangeTo"
              >
                <template #dropdownInner>
                  <div class="_vue-picker__dropdown-custom">
                    <VuePickerOption value="loki" text="LOKI">
                      LOKI
                    </VuePickerOption>
                  </div>
                  <div class="_vue-picker__dropdown-custom">
                    <VuePickerOption value="odin" text="ODIN">
                      ODIN
                    </VuePickerOption>
                  </div>
                </template>
              </VuePicker>
            </div>

            <div class="app-form__field">
              <label class="app-form__field-lbl">Amount</label>
              <input
                class="app-form__field-input"
                name="exchange-to-amount"
                type="number"
                :value="expectedAmount"
                disabled
              />
            </div>
          </div>
        </div>

        <div class="app-form__footer">
          <button class="app-btn" type="button" @click="submit()">
            Exchange
          </button>
        </div>
      </form>
    </template>
  </ModalBase>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import { callers } from '@/api/callers'
import { coin } from '@cosmjs/amino'
import { wallet } from '@/api/wallet'
import { QueryRateResponse } from '@provider/codec/coinswap/query'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { VuePicker, VuePickerOption } from '@invisiburu/vue-picker'
import { DialogHandler, dialogs } from '@/helpers/dialogs'
import { notifySuccess } from '@/helpers/notifications'
import { handleError } from '@/helpers/errors'
import { useForm, validators } from '@/composables/useForm'
import { NumLike } from '@/helpers/casts'
import { bigMath } from '@/helpers/bigMath'
import BigNumber from 'bignumber.js'
import ModalBase from '@/components/modals/ModalBase.vue'
import ExchangeIcon from '@/components/icons/ExchangeIcon.vue'
import { preventIf } from '@/helpers/functions'

const ExchangeFormDialog = defineComponent({
  components: { ModalBase, ExchangeIcon, VuePicker, VuePickerOption },
  setup: function () {
    const form = useForm({
      amount: [
        0,
        validators.required,
        validators.integer,
        validators.maxCharacters(128),
      ],
    })
    const exchangeFrom = ref<string>('loki')
    const exchangeTo = ref<string>('odin')
    const expectedAmount = ref<string>('0')
    const rate = ref()
    const rateText = ref()

    const isLoading = ref(false)
    const onSubmit = dialogs.getHandler('onSubmit')

    const getRate = async (from: string, to: string) => {
      isLoading.value = true
      try {
        rate.value = await callers.getRate(from, to)
      } catch (error) {
        handleError(error as Error)
      }
      isLoading.value = false
    }

    const setRateText = () => {
      if (exchangeFrom.value === exchangeTo.value) {
        rateText.value = 'N/A'
      } else {
        rateText.value = `1 ${exchangeFrom.value.toUpperCase()} =
         ${_calcExpected(1)} ${exchangeTo.value.toUpperCase()}`
      }
    }

    const _calcExpected = (value: NumLike | null): BigNumber | null => {
      if (!value) return null
      return bigMath.multiply(value, bigMath.fromPrecise(rate.value.rate))
    }

    const _reCalcExpected = async () => {
      const amount = form.amount.val()
      const expectedRaw = _calcExpected(amount)
      if (!amount || !expectedRaw) {
        expectedAmount.value = '0'
        return
      }

      expectedAmount.value = bigMath.toStrStrict(expectedRaw)
    }

    const changeHandler = async () => {
      let tempValue = exchangeFrom.value
      exchangeFrom.value = exchangeTo.value
      exchangeTo.value = tempValue
    }

    watch(() => form.amount.val(), _reCalcExpected)
    watch([exchangeFrom, exchangeTo], async () => {
      if (exchangeFrom.value !== exchangeTo.value) {
        await getRate(exchangeFrom.value, exchangeTo.value)
        _reCalcExpected()
      }
      setRateText()
    })

    const submit = async () => {
      isLoading.value = true
      try {
        await callers.createExchange({
          from: exchangeFrom.value,
          to: exchangeTo.value,
          amount: coin(form.amount.val(), exchangeFrom.value),
          requester: wallet.account.address,
        })
        onSubmit()
        notifySuccess('Exchange successfully created')
      } catch (error) {
        handleError(error as Error)
      }
      isLoading.value = false
    }

    onMounted(async () => {
      await getRate(exchangeFrom.value, exchangeTo.value)
      setRateText()
    })

    return {
      form: form.flatten(),
      exchangeFrom,
      exchangeTo,
      expectedAmount,
      rateText,
      changeHandler,
      isLoading,
      submit,
      onClose: preventIf(dialogs.getHandler('onClose'), isLoading),
    }
  },
})

export default ExchangeFormDialog
export function showExchangeFormDialog(
  callbacks?: {
    onSubmit?: DialogHandler
    onClose?: DialogHandler
  },
  props?: {
    lokiToOdinRate: QueryRateResponse
  }
): Promise<unknown | null> {
  return dialogs.show(ExchangeFormDialog, callbacks, { props })
}
</script>

<style lang="scss" scoped>
.app-form {
  &__main {
    overflow: unset;
  }

  &__row {
    display: flex;
    justify-content: space-between;

    &_center {
      align-items: center;
    }
  }

  &__field {
    width: 22.2rem;

    &_small {
      width: 9rem;
      margin-right: 1.6rem;
    }

    &:not(:first-of-type) {
      margin-block-start: 0;
    }
  }

  &__field-input {
    padding: 1rem;
  }

  &__exchange-rate {
    font-size: 1.4rem;
  }

  &__exchange-btn {
    width: 3.6rem;
    height: 3.6rem;
    padding: 0.7rem;
    border: 1px solid transparent;
    border-radius: 0.4rem;
    background: var(--clr__btn-normal);

    &:hover {
      border: 1px solid transparent;
      background: var(--clr__btn-hover);
    }

    &:active {
      border: 1px solid transparent;
      background: var(--clr__btn-pressed);
    }
  }
}
</style>

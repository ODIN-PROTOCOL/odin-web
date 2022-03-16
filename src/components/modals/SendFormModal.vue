<template>
  <ModalBase class="modal-base_right" @close="onClose()">
    <template #title>
      <h3 class="app-form__title">Send</h3>
    </template>

    <template #main>
      <form
        class="app-form load-fog"
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent
      >
        <div class="app-form__main">
          <div class="app-form__info mg-b16">
            <label class="app-form__info-title">Balance</label>
            <div class="app-form__info-content">
              <div
                class="app-form__info-row"
                v-for="item in balance"
                :key="item.denom"
              >
                <span class="app-form__info-row-title"> ODIN </span>
                <span class="app-form__info-row-value">
                  {{ $convertLokiToOdin(item.amount, { withDenom: true }) }}
                </span>
              </div>
            </div>
          </div>

          <div class="app-form__info mg-b32">
            <label class="app-form__info-title">Current rate</label>
            <div class="app-form__info-content">
              <div class="app-form__info-row">
                <span class="app-form__info-row-title">1 ODIN</span>
                <span class="app-form__info-row-value">
                  ${{ String(rate['odin-protocol']?.usd) }}
                </span>
              </div>
              <div class="app-form__info-row">
                <span class="app-form__info-row-title">1 GEO</span>
                <span class="app-form__info-row-value">
                  ${{ String(rate.geodb?.usd) }}
                </span>
              </div>
            </div>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl">Receiver</label>
            <input
              class="app-form__field-input"
              name="send-receiver"
              type="text"
              placeholder="Receiver's address"
              v-model="form.receiver"
              :disabled="isLoading"
            />
            <p v-if="form.receiverErr" class="app-form__field-err">
              {{ form.receiverErr }}
            </p>
          </div>
          <div class="app-form__field">
            <label class="app-form__field-lbl">Asset</label>
            <VuePicker
              class="_vue-picker"
              placeholder="ODIN"
              v-model="sendAsset"
            >
              <template #dropdownInner>
                <div class="_vue-picker__dropdown-custom">
                  <VuePickerOption value="loki" text="LOKI">
                    LOKI
                  </VuePickerOption>
                  <!-- while only LOKI can be sent, in time it will be possible to send ODIN -->
                  <!-- <VuePickerOption value="odin" text="ODIN">
                    ODIN
                  </VuePickerOption> -->
                </div>
              </template>
            </VuePicker>
          </div>
          <div class="app-form__field mg-b32">
            <label class="app-form__field-lbl">Amount</label>
            <div class="app-form__field-input-wrapper">
              <span>{{ sendAsset.toUpperCase() }}</span>
              <input
                class="app-form__field-input"
                name="send-amount"
                type="text"
                placeholder="1"
                v-model="form.amount"
                :disabled="isLoading || isEmptyBalance"
              />
            </div>
            <p
              v-if="form.amountErr || isEmptyBalance"
              class="app-form__field-err"
            >
              {{
                isEmptyBalance
                  ? 'Not enough tokens! Please make deposit'
                  : form.amountErr
              }}
            </p>
          </div>

          <div class="app-form__info">
            <label class="app-form__info-title">Fee amount</label>
            <div class="app-form__info-content">
              <div class="app-form__info-row">
                <span class="app-form__info-row-value">
                  {{ $convertLokiToOdin(fee, { withDenom: true }) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="app-form__footer">
          <button
            class="app-btn app-btn_outlined"
            type="button"
            @click="onClose()"
            :disabled="isLoading"
          >
            Cancel
          </button>
          <button
            class="app-btn"
            type="button"
            @click="submit()"
            :disabled="!form.isValid || isLoading"
          >
            Send
          </button>
        </div>
      </form>
    </template>
  </ModalBase>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed } from 'vue'
import { callers } from '@/api/callers'
import { coins } from '@cosmjs/amino'
import { wallet } from '@/api/wallet'
import { API_CONFIG, COINS_LIST } from '@/api/api-config'
import { useForm, validators } from '@/composables/useForm'
import { dialogs } from '@/helpers/dialogs'
import { preventIf } from '@/helpers/functions'
import { convertLokiToOdin, convertOdinToLoki } from '@/helpers/converters'
import { handleError } from '@/helpers/errors'
import { notifySuccess } from '@/helpers/notifications'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { VuePicker, VuePickerOption } from '@invisiburu/vue-picker'
import ModalBase from '@/components/modals/ModalBase.vue'
import { Coin } from '@cosmjs/amino'
import { WalletRate } from '@/helpers/Types'
import { coin } from '@cosmjs/launchpad'

export default defineComponent({
  name: 'SendFormModal',
  components: { ModalBase, VuePicker, VuePickerOption },
  props: {
    rate: { type: Object as PropType<WalletRate>, required: true },
    balance: { type: Array as PropType<Coin[]>, required: true },
  },
  setup: function (props) {
    const fee = ref(API_CONFIG.fee)
    const isLoading = ref(false)
    const onSubmit = dialogs.getHandler('onSubmit')
    const onClose = preventIf(dialogs.getHandler('onClose'), isLoading)
    const sendAsset = ref(COINS_LIST.ODIN)
    const selectedBalance = computed(() => {
      const balance = props.balance.find((item) => {
        return item.denom === COINS_LIST.LOKI
      })
      return balance || coin(0, sendAsset.value)
    })
    const isEmptyBalance = computed(() => {
      return !Number(selectedBalance.value.amount)
    })

    let form = useForm({
      receiver: [
        '',
        validators.required,
        validators.withOutSpaceAtStart,
        validators.maxCharacters(128),
        validators.odinAddress,
        validators.exceptValue(
          wallet.account.address,
          'It is not possible to send tokens to yourself'
        ),
      ],
      amount: [
        '',
        validators.required,
        validators.number,
        validators.sixDecimalNumber,
        ...validators.num(
          0.000001,
          Number(convertLokiToOdin(selectedBalance.value.amount))
        ),
        validators.maxCharacters(32),
      ],
    })

    const submit = async () => {
      isLoading.value = true
      try {
        await callers.createSend({
          fromAddress: wallet.account.address,
          toAddress: form.receiver.val(),
          amount: coins(convertOdinToLoki(form.amount.val()), COINS_LIST.LOKI),
        })
        onSubmit()
        notifySuccess('Successfully sent')
      } catch (error) {
        handleError(error as Error)
      }
      isLoading.value = false
    }

    return {
      COINS_LIST,
      form: form.flatten(),
      sendAsset,
      fee,
      isEmptyBalance,
      isLoading,
      submit,
      onClose,
    }
  },
})
</script>

<style lang="scss" scoped>
.app-form {
  &__info {
    padding: 1.6rem 1.2rem;
    border: 1px solid var(--clr__action);
    border-radius: 0.8rem;
  }

  &__info-title {
    display: block;
    margin-bottom: 1.6rem;
  }

  &__info-content {
    & > *:not(:last-child) {
      margin-bottom: 0.8rem;
    }
  }

  &__info-row {
    display: flex;
    flex-direction: row;
    gap: 2.4rem;
  }

  &__info-row-title {
    min-width: 10rem;
  }

  &__info-row-value {
    font-weight: 600;
  }
}
</style>

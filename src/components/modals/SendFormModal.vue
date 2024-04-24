<template>
  <ModalBase class="modal-base" @close="onClose()">
    <template #title>
      <h3 class="app-form__title">Send</h3>
    </template>

    <template #main>
      <form
        class="app-form load-fog"
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent="submit"
      >
        <div class="app-form__main">
          <div class="send-form-modal__info-balance">
            <div class="send-form-modal__info-balance-item">
              <label class="send-form-modal__info-balance-item-lbl"
                >ODIN balance</label
              >
              <div
                class="send-form-modal__info-balance-item-value"
                :title="OdinBalance"
              >
                {{ OdinBalance }}
              </div>
            </div>
            <div class="send-form-modal__info-balance-item">
              <label
                class="send-form-modal__info-balance-item-lbl"
                :title="geoBalance"
                >GEO balance</label
              >
              <div class="send-form-modal__info-balance-item-value">
                {{ geoBalance }}
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
              v-model="flattenForm.receiver"
              :disabled="isLoading"
            />
            <p v-if="flattenForm.receiverErr" class="app-form__field-err">
              {{ flattenForm.receiverErr }}
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
                  <VuePickerOption value="odin" text="ODIN">
                    ODIN
                  </VuePickerOption>
                </div>
              </template>
            </VuePicker>
          </div>
          <div class="app-form__field">
            <label class="app-form__field-lbl">Amount</label>
            <div class="app-form__field-input-wrapper">
              <span>{{ sendAsset.toUpperCase() }}</span>
              <input
                class="app-form__field-input"
                name="send-amount"
                type="text"
                placeholder="1"
                v-model="flattenForm.amount"
                :disabled="isLoading || isEmptyBalance"
              />
            </div>
            <p
              v-if="flattenForm.amountErr || isEmptyBalance"
              class="app-form__field-err"
            >
              {{
                isEmptyBalance
                  ? 'Not enough tokens! Please make deposit'
                  : flattenForm.amountErr
              }}
            </p>
          </div>
          <div class="send-form-modal__field-info">
            <span
              >Fee amount:
              {{ $convertLokiToOdin(fee, { onlyNumber: true }) }} ODIN</span
            >
          </div>
        </div>

        <div class="app-form__footer">
          <button
            class="app-btn app-btn--medium w-full"
            :disabled="!flattenForm.isValid || isLoading"
          >
            Send
          </button>
        </div>
      </form>
    </template>
  </ModalBase>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { callers } from '@/api/callers'
import { coins } from '@cosmjs/amino'
import { wallet } from '@/api/wallet'
import { API_CONFIG, COINS_LIST } from '@/api/api-config'
import { useForm, validators } from '@/composables/useForm'
import { dialogs } from '@/helpers/dialogs'
import { preventIf } from '@/helpers/functions'
import { convertLokiToOdin, convertOdinToLoki } from '@/helpers/converters'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { VuePicker, VuePickerOption } from '@invisiburu/vue-picker'
import { ModalBase } from '@/components/modals'
import { Coin } from '@cosmjs/amino'
import { coin } from '@cosmjs/stargate'

const props = defineProps<{
  balance: Coin[]
}>()

const fee = ref(API_CONFIG.fee)
const isLoading = ref(false)
const onSubmit = dialogs.getHandler('onSubmit')
const onClose = preventIf(dialogs.getHandler('onClose'), isLoading)
const sendAsset = ref(COINS_LIST.ODIN)
const selectedBalance = computed(() => {
  const balance = props.balance.find(item => {
    return item.denom === COINS_LIST.LOKI
  })
  return balance || coin(0, sendAsset.value)
})
const OdinBalance = computed(() => {
  const balance = props.balance.find(item => {
    return item.denom === COINS_LIST.LOKI
  })
  return balance ? convertLokiToOdin(balance.amount, { onlyNumber: true }) : 0
})
const geoBalance = computed(() => {
  const balance = props.balance.find(item => {
    return item.denom === COINS_LIST.GEO
  })
  return balance || 0
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
      'It is not possible to send tokens to yourself',
    ),
  ],
  amount: [
    '',
    validators.required,
    validators.number,
    validators.sixDecimalNumber,
    ...validators.num(
      0.000001,
      Number(convertLokiToOdin(selectedBalance.value.amount)),
    ),
    validators.maxCharacters(32),
  ],
})

const flattenForm = form.flatten()

const submit = async () => {
  isLoading.value = true
  try {
    await callers.createSend({
      fromAddress: wallet.account.address,
      toAddress: form.receiver.val(),
      amount: coins(convertOdinToLoki(form.amount.val()), COINS_LIST.LOKI),
    })
    onSubmit()
    handleNotificationInfo('Successfully sent', TYPE_NOTIFICATION.success)
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  isLoading.value = false
}
</script>

<style lang="scss" scoped>
.send-form-modal__info-balance {
  display: flex;
  flex-direction: row;
  margin-bottom: 2.4rem;
}
.send-form-modal__info-balance-item {
  width: 100%;
  padding: 1.6rem 1.2rem;
  padding: 0.8rem;
  border-radius: 0.8rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  &:first-child {
    margin-right: 1.6rem;
  }
}
.send-form-modal__info-balance-item-lbl {
  font-size: 1.4rem;
  font-weight: 400;
  color: var(--clr__text-muted);
  margin: 0;
}
.send-form-modal__info-balance-item-value {
  font-weight: 600;
}
.send-form-modal__field-info {
  font-size: 1.4rem;
  font-weight: 400;
  color: var(--clr__modal-backdrop-bg);
  display: flex;
  align-items: center;
}
.send-form-modal__info-icon {
  margin-right: 0.9rem;
}
</style>

<template>
  <ModalBase class="exchange-form-modal" @close="onClose()">
    <template #title>
      <h3>Exchange ETH/ERC20</h3>
    </template>

    <template #main>
      <form
        class="app-form load-fog"
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent
      >
        <div class="app-form__field">
          <label class="app-form__field-lbl"> Asset </label>
          <select
            class="app-form__field-input"
            name="exchange-source-asset"
            v-model="form.sourceAsset"
            :disabled="isLoading"
          >
            <option v-for="asset in assets" :key="asset" :value="asset">
              {{ asset }}
            </option>
          </select>
          <p v-if="form.sourceAssetErr" class="app-form__field-err">
            {{ form.sourceAssetErr }}
          </p>
        </div>

        <div class="app-form__field">
          <label class="app-form__field-lbl"> Source address </label>
          <input
            class="app-form__field-input"
            name="request-source-address"
            type="text"
            placeholder="0x675898…"
            v-model="form.sourceAddress"
            :disabled="isLoading"
          />
          <p v-if="form.sourceAddressErr" class="app-form__field-err">
            {{ form.sourceAddressErr }}
          </p>
        </div>

        <div class="app-form__field">
          <label class="app-form__field-lbl"> Amount </label>
          <input
            class="app-form__field-input"
            name="request-source-amount"
            type="number"
            min="1"
            step="1"
            placeholder="1000"
            v-model="form.sourceAmount"
            :disabled="isLoading"
          />
          <p v-if="form.sourceAmountErr" class="app-form__field-err">
            {{ form.sourceAmountErr }}
          </p>
          <p class="app-form__field-note">≈ {{ approxDestAmount }}</p>
        </div>

        <div class="app-form__footer">
          <button
            class="app-btn-2nd"
            type="button"
            @click="onClose()"
            :disabled="!form.isValid || isLoading"
          >
            Cancel
          </button>
          <button
            class="app-btn"
            type="button"
            @click="submit()"
            :disabled="!form.isValid || isLoading"
          >
            Exchange
          </button>
        </div>
      </form>
    </template>
  </ModalBase>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { wallet } from '@/api/wallet'
import { callers } from '@/api/callers'
import { DialogHandler, dialogs } from '@/helpers/dialogs'
import { handleError } from '@/helpers/errors'
import { preventIf } from '@/helpers/functions'
import { notifySuccess } from '@/helpers/notifications'
import { useForm, validators } from '@/composables/useForm'
import { useRateAutoCalc } from '@/composables/useRateAutoCalc'
import ModalBase from './ModalBase.vue'

const ExchangeFormModal = defineComponent({
  components: { ModalBase },
  setup() {
    const assets = ['ODIN']
    const form = useForm({
      sourceAsset: [assets[0], validators.required, validators.oneOf(assets)],
      sourceAddress: ['', validators.required, validators.erc20Address],
      sourceAmount: ['1', validators.required, ...validators.num(0.000001)],
    })
    const isLoading = ref(false)
    const onSubmit = dialogs.getHandler('onSubmit')
    const onClose = preventIf(dialogs.getHandler('onClose'), isLoading)

    const submit = async () => {
      isLoading.value = true
      try {
        await callers.createBinanceExchange({
          binance_address: form.sourceAddress.val(),
          odin_address: wallet.account.address,
          amount: form.sourceAmount.val(),
          denom: form.sourceAsset.val().toLowerCase(),
        })

        onSubmit()
        notifySuccess('Exchange created')
      } catch (error) {
        handleError(error)
      }
      isLoading.value = false
    }

    const approxDestAmount = useRateAutoCalc(
      form.sourceAsset.current,
      form.sourceAmount.current,
      'loki'
    )

    // TODO: remove fakeForm
    const _fakeForm = () => {
      form.sourceAddress.val('0x6758980b195114d08ce5119cf383a8ec5417f35a')
    }
    _fakeForm()

    return {
      form: form.flatten(),
      isLoading,
      submit,
      approxDestAmount,
      assets,
      onClose,
    }
  },
})

export default ExchangeFormModal
export function showExchangeFormDialog(callbacks?: {
  onSubmit?: DialogHandler
  onClose?: DialogHandler
}): Promise<unknown | null> {
  return dialogs.show(ExchangeFormModal, callbacks)
}
</script>

<style scoped lang="scss"></style>

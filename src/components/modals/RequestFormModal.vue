<template>
  <ModalBase class="request-form-modal modal-base_right" @close="onClose()">
    <template #title>
      <h3 class="app-form__title">Create request</h3>
    </template>

    <template #main>
      <form
        class="app-form load-fog"
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent
      >
        <div class="app-form__main">
          <div class="app-form__field">
            <label class="app-form__field-lbl"> Oracle Script ID </label>
            <input
              class="app-form__field-input"
              name="request-oracle-script-id"
              type="text"
              v-model="form.oracleScriptId"
              :disabled="isLoading"
            />
            <p v-if="form.oracleScriptIdErr" class="app-form__field-err">
              {{ form.oracleScriptIdErr }}
            </p>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl"> Ask count </label>
            <input
              class="app-form__field-input"
              name="request-ask-count"
              type="number"
              v-model="form.askCount"
              :disabled="isLoading"
            />
            <p v-if="form.askCountErr" class="app-form__field-err">
              {{ form.askCountErr }}
            </p>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl"> Min count </label>
            <input
              class="app-form__field-input"
              name="request-min-count"
              type="number"
              v-model="form.minCount"
              :disabled="isLoading"
            />
            <p v-if="form.minCountErr" class="app-form__field-err">
              {{ form.minCountErr }}
            </p>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl"> Call data </label>
            <VuePicker
              class="_vue-picker"
              placeholder="call data"
              v-model="form.calldata"
            >
              <template #dropdownInner>
                <div
                  class="_vue-picker__dropdown-custom"
                  v-for="phone in phones"
                  :key="phone"
                >
                  <VuePickerOption :value="phone" :text="phone">
                    {{ phone }}
                  </VuePickerOption>
                </div>
              </template>
            </VuePicker>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl"> Fee limit </label>
            <input
              class="app-form__field-input"
              name="request-fee-limit"
              type="number"
              min="1"
              v-model="form.feeLimit"
              :disabled="isLoading"
            />
            <p v-if="form.feeLimitErr" class="app-form__field-err">
              {{ form.feeLimitErr }}
            </p>
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
            Create
          </button>
        </div>
      </form>
    </template>
  </ModalBase>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Long from 'long'
import { wallet } from '@/api/wallet'
import { callers } from '@/api/callers'
import { DialogHandler, dialogs } from '@/helpers/dialogs'
import { handleError } from '@/helpers/errors'
import { preventIf } from '@/helpers/functions'
import { notifySuccess } from '@/helpers/notifications'
import { obiCoin } from '@/helpers/obi-structures'
import { useForm, validators } from '@/composables/useForm'
import ModalBase from './ModalBase.vue'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { VuePicker, VuePickerOption } from '@invisiburu/vue-picker'
import { coins } from '@cosmjs/launchpad'
import phones from '@/assets/phones.json'

const RequestFormModal = defineComponent({
  props: {
    maxAskCount: { type: Number, required: true },
  },
  components: { ModalBase, VuePicker, VuePickerOption },
  setup(props) {
    const form = useForm({
      oracleScriptId: ['', validators.required],
      askCount: [
        1,
        validators.required,
        ...validators.num(1, props.maxAskCount),
      ],
      minCount: [
        1,
        validators.required,
        ...validators.num(1, props.maxAskCount),
      ],
      calldata: ['', validators.required],
      feeLimit: ['1', validators.required, ...validators.num(1)],
    })
    const isLoading = ref(false)
    const onSubmit = dialogs.getHandler('onSubmit')
    const onClose = preventIf(dialogs.getHandler('onClose'), isLoading)

    const submit = async () => {
      if (!form.isValid.value) return
      isLoading.value = true
      try {
        await callers.createRequest({
          oracleScriptId: Long.fromString(form.oracleScriptId.val()),
          askCount: Long.fromNumber(form.askCount.val()),
          minCount: Long.fromNumber(form.minCount.val()),
          // TODO: clarify calldata
          // calldata: obiPhoneModels(form.calldata.val()),
          calldata: obiCoin.encode({
            symbol: 'BTC',
            multiplier: '1000000000',
          }),
          feeLimit: coins(Number.parseInt(form.feeLimit.val()), 'loki'),
          prepareGas: Long.fromNumber(200000),
          executeGas: Long.fromNumber(200000),
          sender: wallet.account.address,
          clientId: '1',
        })

        onSubmit()
        notifySuccess('Request created')
      } catch (error) {
        handleError(error as Error)
      } finally {
        isLoading.value = false
      }
    }

    return {
      form: form.flatten(),
      isLoading,
      submit,
      onClose,
      phones,
    }
  },
})

export default RequestFormModal
export function showRequestFormDialog(
  callbacks: {
    onSubmit?: DialogHandler
    onClose?: DialogHandler
  },
  props: { maxAskCount: number }
): Promise<unknown | null> {
  return dialogs.show(RequestFormModal, callbacks, { props })
}
</script>

<style scoped lang="scss"></style>

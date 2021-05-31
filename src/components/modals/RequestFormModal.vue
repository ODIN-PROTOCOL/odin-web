<template>
  <ModalBase class="request-form-modal" @close="onClose()">
    <template #title>
      <h3>Create request</h3>
    </template>

    <template #main>
      <form
        class="app-form load-fog"
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent
      >
        <div class="app-form__field">
          <label class="app-form__field-lbl"> Oracle Script Id </label>
          <input
            class="app-form__field-input"
            name="request-oracle-script-id"
            type="text"
            v-model="form.oracleScriptId"
            :readonly="true"
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
            min="1"
            max="10"
            step="1"
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
            min="1"
            max="10"
            step="1"
            v-model="form.minCount"
            :disabled="isLoading"
          />
          <p v-if="form.minCountErr" class="app-form__field-err">
            {{ form.minCountErr }}
          </p>
        </div>

        <div class="app-form__field">
          <label class="app-form__field-lbl"> Call data </label>
          <select
            class="app-form__field-input"
            name="request-calldata"
            multiple
            v-model="form.calldata"
            :disabled="isLoading"
          >
            <option v-for="phone in phones" :key="phone" :value="phone">
              {{ phone }}
            </option>
          </select>
          <p v-if="form.calldataErr" class="app-form__field-err">
            {{ form.calldataErr }}
          </p>
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

        <div class="app-form__footer">
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
import { defineComponent, PropType, ref } from 'vue'
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
import { coins } from '@cosmjs/launchpad'
import phones from '@/assets/phones.json'
import { NumLike, NumLikeTypes, toStr } from '@/helpers/casts'

const RequestFormModal = defineComponent({
  props: {
    oracleScriptId: { type: NumLikeTypes as PropType<NumLike>, required: true },
  },
  components: { ModalBase },
  setup(props) {
    const form = useForm({
      oracleScriptId: [toStr(props.oracleScriptId), validators.required],
      askCount: ['1', validators.required, ...validators.num(1, 10)],
      minCount: ['1', validators.required, ...validators.num(1, 10)],
      calldata: [[], validators.minItems(1)],
      feeLimit: ['1', validators.required, ...validators.num(1)],
    })
    const isLoading = ref(false)
    const onSubmit = dialogs.getHandler('onSubmit')
    const onClose = preventIf(dialogs.getHandler('onClose'), isLoading)

    const submit = async () => {
      isLoading.value = true
      try {
        await callers.createRequest({
          oracleScriptId: Long.fromString(form.oracleScriptId.val()),
          askCount: Long.fromString(form.askCount.val()),
          minCount: Long.fromString(form.minCount.val()),
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
        notifySuccess('Oracle Script created')
      } catch (error) {
        handleError(error)
      }
      isLoading.value = false
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
  props: { oracleScriptId: NumLike }
): Promise<unknown | null> {
  return dialogs.show(RequestFormModal, callbacks, { props })
}
</script>

<style scoped lang="scss"></style>

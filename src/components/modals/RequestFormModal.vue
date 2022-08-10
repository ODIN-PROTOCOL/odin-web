<template>
  <ModalBase class="request-form-modal modal-base--right" @close="onClose()">
    <template #title>
      <h3 class="app-form__title">Create request</h3>
    </template>

    <template #main>
      <form
        class="app-form load-fog"
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent="submit"
      >
        <div class="app-form__main">
          <div class="app-form__field">
            <label class="app-form__field-lbl"> Oracle Script ID </label>
            <input
              class="app-form__field-input"
              name="request-oracle-script-id"
              type="text"
              @input="findOracleScript"
              v-model="flattenForm.oracleScriptId"
              placeholder="ID"
              :disabled="isLoading"
            />
            <p v-if="flattenForm.oracleScriptIdErr" class="app-form__field-err">
              {{ flattenForm.oracleScriptIdErr }}
            </p>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl"> Ask count </label>
            <input
              class="app-form__field-input"
              name="request-ask-count"
              type="number"
              placeholder="1"
              v-model="flattenForm.askCount"
              :disabled="isLoading"
            />
            <p v-if="flattenForm.askCountErr" class="app-form__field-err">
              {{ flattenForm.askCountErr }}
            </p>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl"> Min count </label>
            <input
              class="app-form__field-input"
              name="request-min-count"
              type="number"
              placeholder="1"
              v-model="flattenForm.minCount"
              :disabled="isLoading"
            />
            <p v-if="flattenForm.minCountErr" class="app-form__field-err">
              {{ flattenForm.minCountErr }}
            </p>
          </div>

          <div class="app-form__field request-form-modal__field">
            <div class="app-form__field-lbl">
              <label>Call data(JSON format)</label>
            </div>
            <TextareaField
              v-model="flattenForm.calldata"
              name="request-calldata"
              :rows="7"
              :disabled="isLoading || Boolean(flattenForm.oracleScriptIdErr)"
              placeholder="Call data"
            />
            <p v-if="flattenForm.feeLimitErr" class="app-form__field-err">
              {{ flattenForm.calldataErr }}
            </p>
            <div v-if="callDataSchema" class="request-form-modal__field-info">
              <div class="request-form-modal__field-lbl--info">
                <label>Required input format:</label>
              </div>
              <div class="request-form-modal__calldata-example">
                {{ callDataSchema }}
              </div>
            </div>
          </div>
          <div class="app-form__field">
            <label class="app-form__field-lbl">Assets</label>
            <VuePicker
              class="_vue-picker"
              placeholder="Assets"
              v-model="flattenForm.assets"
            >
              <template #dropdownInner>
                <div class="_vue-picker__dropdown-custom">
                  <VuePickerOption
                    v-for="{ text, value } in assetsChanges"
                    :key="text"
                    :value="value"
                    :text="text"
                  >
                    {{ text }}
                  </VuePickerOption>
                </div>
              </template>
            </VuePicker>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl"> Fee limit </label>
            <div class="app-form__field-input-wrapper">
              <span>{{ flattenForm.assets.toUpperCase() }}</span>
              <input
                class="app-form__field-input"
                name="request-fee-limit"
                type="text"
                v-model="flattenForm.feeLimit"
                :disabled="isLoading"
                placeholder="1"
              />
            </div>
            <p v-if="flattenForm.feeLimitErr" class="app-form__field-err">
              {{ flattenForm.feeLimitErr }}
            </p>
          </div>
        </div>

        <div class="app-form__footer">
          <button
            class="app-btn app-btn--outlined app-btn--medium"
            type="button"
            @click="onClose()"
            :disabled="isLoading"
          >
            Cancel
          </button>
          <button
            class="app-btn app-btn--medium"
            :disabled="!flattenForm.isValid || isLoading"
          >
            Create
          </button>
        </div>
      </form>
    </template>
  </ModalBase>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Long from 'long'
import { wallet } from '@/api/wallet'
import { callers } from '@/api/callers'
import { dialogs } from '@/helpers/dialogs'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { preventIf } from '@/helpers/functions'
import { assetsChanges } from '@/helpers/translators'
import { useForm, validators } from '@/composables/useForm'
import { ModalBase } from '@/components/modals'
import { coins } from '@cosmjs/launchpad'
import debounce from 'lodash.debounce'
import { Obi } from '@bandprotocol/bandchain.js'
import TextareaField from '@/components/fields/TextareaField.vue'
import { convertOdinToLoki, getDenom } from '@/helpers/converters'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { VuePicker, VuePickerOption } from '@invisiburu/vue-picker'

const props = defineProps<{
  maxAskCount: number
}>()

const form = useForm({
  oracleScriptId: ['', validators.required],
  askCount: ['', validators.required, ...validators.num(1, props.maxAskCount)],
  minCount: ['', validators.required, ...validators.num(1, props.maxAskCount)],
  calldata: [''],
  assets: [assetsChanges.odin.value, validators.required],
  feeLimit: [
    '',
    validators.required,
    validators.number,
    validators.sixDecimalNumber,
    ...validators.num(0.000001),
    validators.maxCharacters(32),
  ],
})
const isLoading = ref(false)
const callDataSchema = ref()
const onSubmit = dialogs.getHandler('onSubmit')
const flattenForm = form.flatten()
const onClose = preventIf(dialogs.getHandler('onClose'), isLoading)
const findOracleScript = debounce(async () => {
  if (!form.oracleScriptId.val()) return
  isLoading.value = true
  try {
    const { oracleScript } = await callers.getOracleScript(
      form.oracleScriptId.val(),
    )
    callDataSchema.value = oracleScript?.schema
  } catch (error) {
    form.oracleScriptId.error.value = 'Oracle script not found'
    callDataSchema.value = ''
    form.calldata.val('')
  }
  isLoading.value = false
}, 500)

const _processCallData = () => {
  try {
    const obi = new Obi(callDataSchema.value)
    return obi.encodeInput(JSON.parse(form.calldata.val()))
  } catch (error) {
    throw new ReferenceError(
      'Invalid call data! Pay attention to the data schema!',
    )
  }
}

const submit = async () => {
  if (!form.isValid.value) return
  isLoading.value = true
  try {
    await callers.createRequest({
      oracleScriptId: Long.fromString(form.oracleScriptId.val()),
      askCount: Long.fromNumber(form.askCount.val()),
      minCount: Long.fromNumber(form.minCount.val()),
      calldata: _processCallData(),
      feeLimit: coins(
        convertOdinToLoki(form.feeLimit.val()),
        getDenom(form.assets.val()),
      ),
      prepareGas: Long.fromNumber(200000),
      executeGas: Long.fromNumber(200000),
      sender: wallet.account.address,
      clientId: wallet.account.address,
    })

    onSubmit()
    handleNotificationInfo('Request created', TYPE_NOTIFICATION.success)
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.request-form-modal__field-info {
  margin-top: 0.4rem;
  color: var(--clr__text-muted);
  font-size: 1.4rem;
  line-height: 2rem;
}
.request-form-modal__field-lbl--info {
  font-weight: 400;
}
.request-form-modal__calldata-example {
  overflow-wrap: break-word;
  font-weight: 300;
}
</style>

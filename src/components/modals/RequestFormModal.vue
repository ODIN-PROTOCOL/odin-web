<template>
  <ModalBase class="request-form-modal modal-base--right" @close="onClose()">
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
              @input="findOracleScript"
              v-model="form.oracleScriptId"
              placeholder="ID"
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

          <div class="app-form__field request-form-modal__field">
            <div class="app-form__field-lbl request-form-modal__field-lbl--ext">
              <label> Call data(JSON format) </label>
              <div class="request-form-modal__field-info" v-if="callDataSchema">
                <img
                  class="request-form-modal__field-info-icon"
                  src="~@/assets/icons/info.svg"
                  alt="info"
                />
                <div class="request-form-modal__field-info-tooltip">
                  <span class="request-form-modal__field-info-tooltip-txt">
                    Schema:
                  </span>
                  <p>
                    {{ callDataSchema }}
                  </p>
                </div>
              </div>
            </div>
            <TextareaField
              v-model="form.calldata"
              name="request-calldata"
              :rows="7"
              :disabled="isLoading || form.oracleScriptIdErr"
              placeholder="Call data"
            />
            <p v-if="form.feeLimitErr" class="app-form__field-err">
              {{ form.calldataErr }}
            </p>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl">Assets</label>
            <VuePicker
              class="_vue-picker"
              placeholder="Assets"
              v-model="form.assets"
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
              <span>{{ form.assets.toUpperCase() }}</span>
              <input
                class="app-form__field-input"
                name="request-fee-limit"
                type="text"
                v-model="form.feeLimit"
                :disabled="isLoading"
                placeholder="1"
              />
            </div>
            <p v-if="form.feeLimitErr" class="app-form__field-err">
              {{ form.feeLimitErr }}
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
import { dialogs } from '@/helpers/dialogs'
import { handleError } from '@/helpers/errors'
import { preventIf } from '@/helpers/functions'
import { assetsChanges } from '@/helpers/translators'
import { notifySuccess } from '@/helpers/notifications'
import { useForm, validators } from '@/composables/useForm'
import ModalBase from './ModalBase.vue'
import { coins } from '@cosmjs/launchpad'
import debounce from 'lodash/debounce'
import { Obi } from '@bandprotocol/bandchain.js'
import TextareaField from '@/components/fields/TextareaField.vue'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { VuePicker, VuePickerOption } from '@invisiburu/vue-picker'

export default defineComponent({
  props: {
    maxAskCount: { type: Number, required: true },
  },
  components: { ModalBase, TextareaField, VuePicker, VuePickerOption },
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
      calldata: [''],
      assets: ['loki', validators.required],
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
    const onClose = preventIf(dialogs.getHandler('onClose'), isLoading)
    const findOracleScript = debounce(async () => {
      if (!form.oracleScriptId.val()) return
      isLoading.value = true
      try {
        const { oracleScript } = await callers.getOracleScript(
          form.oracleScriptId.val()
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
          'Invalid call data! Pay attention to the data schema!'
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
          feeLimit: coins(form.feeLimit.val(), form.assets.val()),
          prepareGas: Long.fromNumber(200000),
          executeGas: Long.fromNumber(200000),
          sender: wallet.account.address,
          clientId: wallet.account.address,
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
      callDataSchema,
      findOracleScript,
      assetsChanges,
    }
  },
})
</script>

<style scoped lang="scss">
.request-form-modal__field-info {
  position: relative;

  &:hover {
    .request-form-modal__field-info-tooltip {
      display: block;
    }
  }
}

.request-form-modal__field-info-tooltip {
  display: none;
  position: absolute;
  bottom: 130%;
  right: -0.5rem;
  min-width: 15rem;
  padding: 1.2rem 2.4rem;
  background: var(--clr__tooltip-bg);
  border-radius: 0.8rem;
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 1.6rem;
  color: var(--clr__tooltip-text);

  &:before {
    content: '';
    display: block;
    width: 0.6rem;
    height: 0.6rem;
    position: absolute;
    bottom: -0.3rem;
    right: 1rem;
    transform: rotate(45deg);
    background: var(--clr__tooltip-bg);
  }
}

.request-form-modal__field-info-tooltip-txt {
  display: inline-block;
  color: var(--clr__input-border);
  margin-bottom: 1rem;
}

.request-form-modal__field-lbl--ext {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

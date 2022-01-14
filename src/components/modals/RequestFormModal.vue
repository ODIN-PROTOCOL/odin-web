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
              @input="findOracleScript"
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

          <div class="app-form__field request-form-modal__field">
            <div class="app-form__field-lbl request-form-modal__field-lbl_ext">
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
            <!-- <div class="app-form__field-lbl app-form__field-lbl_ext">
              <label> Call data(JSON format) </label>
              <div class="app-form__info-wrapper" v-if="callDataSchema">
                <div class="app-form__info">
                  <img src="~@/assets/icons/info.svg" alt="info" />
                </div>
                <div class="app-form__info-tooltip">
                  <span class="app-form__info-tooltip-txt">Schema:</span>
                  <p>
                    {{ callDataSchema }}
                  </p>
                </div>
              </div>
            </div> -->
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
import { dialogs } from '@/helpers/dialogs'
import { COINS_LIST } from '@/api/api-config'
import { handleError } from '@/helpers/errors'
import { preventIf } from '@/helpers/functions'
import { notifySuccess } from '@/helpers/notifications'
import { useForm, validators } from '@/composables/useForm'
import ModalBase from './ModalBase.vue'
import { coins } from '@cosmjs/launchpad'
import debounce from 'lodash/debounce'
import { Obi } from '@bandprotocol/bandchain.js'
import TextareaField from '@/components/fields/TextareaField.vue'

export default defineComponent({
  props: {
    maxAskCount: { type: Number, required: true },
  },
  components: { ModalBase, TextareaField },
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
      feeLimit: ['1', validators.required, ...validators.num(1)],
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
          feeLimit: coins(
            Number.parseInt(form.feeLimit.val()),
            COINS_LIST.LOKI
          ),
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
    }
  },
})
</script>

<style scoped lang="scss">
.request-form-modal {
  &__field-info {
    position: relative;

    &:hover {
      .request-form-modal__field-info-tooltip {
        display: block;
      }
    }
  }

  &__field-info-tooltip {
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

  &__field-info-tooltip-txt {
    display: inline-block;
    color: var(--clr__input-border);
    margin-bottom: 1rem;
  }

  &__field-lbl {
    &_ext {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>

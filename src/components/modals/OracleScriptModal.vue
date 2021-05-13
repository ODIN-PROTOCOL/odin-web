<template>
  <ModalBase class="oracle-script-form-modal" @close="onClose()">
    <template #title>
      <h3>View oracle script</h3>
    </template>

    <template #main>
      <form class="app-form" @submit.prevent>
        <div class="app-form__field">
          <label class="app-form__field-lbl"> Name </label>
          <input
            class="app-form__field-input"
            name="oracle-script-name"
            type="text"
            v-model="form.name"
            :readonly="true"
          />
          <p v-if="form.nameErr" class="app-form__field-err">
            {{ form.nameErr }}
          </p>
        </div>

        <div class="app-form__field">
          <label class="app-form__field-lbl"> Description </label>
          <textarea
            class="app-form__field-input"
            name="oracle-script-description"
            rows="5"
            v-model="form.description"
            :readonly="true"
          ></textarea>
          <p v-if="form.descriptionErr" class="app-form__field-err">
            {{ form.descriptionErr }}
          </p>
        </div>

        <div class="app-form__field">
          <label class="app-form__field-lbl"> Code (.wasm) </label>
          <InputFile
            class="app-form__field-input"
            name="oracle-script-executable"
            accept=".wasm"
            v-model="form.codeFile"
            :readonly="true"
          />
          <p v-if="form.codeFileErr" class="app-form__field-err">
            {{ form.codeFileErr }}
          </p>
        </div>

        <div class="app-form__footer">
          <button class="app-btn" type="button" @click="toRequestCreation()">
            To request creation
          </button>
        </div>
      </form>
    </template>
  </ModalBase>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { DialogCallback, makeDialog } from '@/helpers/dialogs'
import { preventIf } from '@/helpers/functions'
import { injectDialogHandler } from './modal-helpers'
import { useForm, validators } from '@/composables/useForm'
import ModalBase from './ModalBase.vue'
import InputFile from '@/components/inputs/InputFile.vue'
import { showRequestFormDialog } from './RequestFormModal.vue'
import { OracleScript } from '@provider/codec/oracle/v1/oracle'

const OracleScriptModal = defineComponent({
  props: { oracleScript: Object },
  components: { ModalBase, InputFile },
  setup(props) {
    const oracleScript = props.oracleScript as OracleScript
    if (!oracleScript?.id) {
      throw new ReferenceError('Missing required arg: oracleScript')
    }

    const form = useForm({
      name: [oracleScript.name, validators.required],
      description: [oracleScript.description, validators.required],
      codeFile: [oracleScript.filename, validators.required],
    })
    const isLoading = ref(false)
    const onRequestCreated = injectDialogHandler('onRequestCreated')
    const onClose = preventIf(injectDialogHandler('onClose'), isLoading)

    const toRequestCreation = () => {
      onClose()
      showRequestFormDialog(
        { onSubmit: onRequestCreated },
        { oracleScriptId: oracleScript.id }
      )
    }

    return {
      form: form.flatten(),
      toRequestCreation,
      onClose,
    }
  },
})

export default OracleScriptModal
export function showOracleScriptDialog(
  callbacks: {
    onRequestCreated?: DialogCallback
    onClose?: DialogCallback
  },
  props: { oracleScript: OracleScript }
): Promise<unknown | null> {
  return makeDialog(OracleScriptModal, callbacks, { props })
}
</script>

<style scoped lang="scss"></style>

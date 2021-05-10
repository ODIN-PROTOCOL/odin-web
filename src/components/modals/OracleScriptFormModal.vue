<template>
  <ModalBase class="oracle-script-form-modal" @close="onClose()">
    <template #title>
      <h3>Create oracle script</h3>
    </template>

    <template #main>
      <form
        class="app-form load-fog"
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent
      >
        <div class="app-form__field">
          <label class="app-form__field-lbl"> Name </label>
          <input
            class="app-form__field-input"
            name="name"
            type="text"
            v-model="name"
            :disabled="isLoading"
          />
          <p v-if="nameError" class="app-form__field-err">
            {{ nameError }}
          </p>
        </div>

        <div class="app-form__field">
          <label class="app-form__field-lbl"> Description </label>
          <textarea
            class="app-form__field-input"
            name="description"
            rows="5"
            v-model="description"
            :disabled="isLoading"
          ></textarea>
          <p v-if="descriptionError" class="app-form__field-err">
            {{ descriptionError }}
          </p>
        </div>

        <div class="app-form__field">
          <label class="app-form__field-lbl"> Code (.wasm) </label>
          <InputFile
            class="app-form__field-input"
            name="executable"
            accept=".wasm"
            v-model="codeFile"
            :disabled="isLoading"
          />
          <p v-if="codeFileError" class="app-form__field-err">
            {{ codeFileError }}
          </p>
        </div>

        <div class="app-form__footer">
          <button
            class="app-btn"
            type="button"
            @click="submit()"
            :disabled="!isValid"
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
import { loremIpsum } from 'lorem-ipsum'
import { createOracleScript } from '@/api/callers/createOracleScript'
import { getWalletAccounts } from '@/api/client/wallet'
import { DialogCallback, makeDialog } from '@/helpers/dialogs'
import { readFile } from '@/helpers/files'
import { handleError } from '@/helpers/errors'
import { preventIf } from '@/helpers/functions'
import { notifySuccess } from '@/helpers/notifications'
import { injectDialogHandler } from './modal-helpers'
import { useForm, validators } from '@/composables/useForm'
import ModalBase from './ModalBase.vue'
import InputFile from '@/components/inputs/InputFile.vue'

const OracleScriptFormModal = defineComponent({
  components: { ModalBase, InputFile },
  setup() {
    const form = useForm({
      name: [
        'Oracle Script ' + loremIpsum({ units: 'words', count: 3 }),
        validators.required,
      ],
      description: [
        loremIpsum({ units: 'sentences', count: 3 }),
        validators.required,
      ],
      codeFile: [null as File | null, validators.required],
    })
    const isLoading = ref(false)
    const onSubmit = injectDialogHandler('onSubmit')

    const submit = async () => {
      const [account] = getWalletAccounts()
      const codeFileParsed = await _parseCodeFile()
      if (!codeFileParsed) return

      isLoading.value = true
      try {
        await createOracleScript({
          name: form.name.current.value,
          description: form.description.current.value,
          code: codeFileParsed,
          owner: account.address,
          sender: account.address,
          schema: '',
          sourceCodeUrl: '',
        })

        onSubmit()
        notifySuccess('Oracle Script created')
      } catch (error) {
        handleError(error)
      }
      isLoading.value = false
    }

    const _parseCodeFile = async (): Promise<Uint8Array | null> => {
      form.codeFile.error.value = null

      const file = form.codeFile.current.value as File | null
      const parsed = file ? await readFile(file, 'uint8Array') : null
      if (!parsed) {
        form.codeFile.error.value = 'Cannot parse the file'
        return null
      }

      return parsed
    }

    return {
      name: form.name.current,
      nameError: form.name.errorIfDirty,
      description: form.description.current,
      descriptionError: form.description.errorIfDirty,
      codeFile: form.codeFile.current,
      codeFileError: form.codeFile.errorIfDirty,
      isValid: form.isValid,
      isLoading,
      submit,
      onClose: preventIf(injectDialogHandler('onClose'), isLoading),
    }
  },
})

export default OracleScriptFormModal
export function showOracleScriptFormDialog(callbacks: {
  onSubmit?: DialogCallback
  onClose?: DialogCallback
}): Promise<unknown | null> {
  return makeDialog(OracleScriptFormModal, callbacks)
}
</script>

<style scoped lang="scss"></style>

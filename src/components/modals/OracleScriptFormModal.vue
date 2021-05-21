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
            name="oracle-script-name"
            type="text"
            v-model="form.name"
            :disabled="isLoading"
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
            :disabled="isLoading"
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
            :disabled="isLoading"
          />
          <p v-if="form.codeFileErr" class="app-form__field-err">
            {{ form.codeFileErr }}
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
import { defineComponent, ref } from 'vue'
import { loremIpsum } from 'lorem-ipsum'
import { wallet } from '@/api/wallet'
import { callers } from '@/api/callers'
import { DialogHandler, dialogs } from '@/helpers/dialogs'
import { readFile } from '@/helpers/files'
import { handleError } from '@/helpers/errors'
import { preventIf } from '@/helpers/functions'
import { notifySuccess } from '@/helpers/notifications'
import { useForm, validators } from '@/composables/useForm'
import ModalBase from './ModalBase.vue'
import InputFile from '@/components/inputs/InputFile.vue'

const OracleScriptFormModal = defineComponent({
  components: { ModalBase, InputFile },
  setup() {
    const form = useForm({
      name: ['', validators.required],
      description: ['', validators.required],
      codeFile: [null as File | null, validators.required],
    })
    const isLoading = ref(false)
    const onSubmit = dialogs.getHandler('onSubmit')

    const submit = async () => {
      const codeFileParsed = await _parseCodeFile()
      if (!codeFileParsed) return

      isLoading.value = true
      try {
        await callers.createOracleScript({
          name: form.name.val(),
          description: form.description.val(),
          code: codeFileParsed,
          owner: wallet.account.address,
          sender: wallet.account.address,
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
      form.codeFile.err(null)

      const file = form.codeFile.val() as File | null
      const parsed = file ? await readFile(file, 'uint8Array') : null
      if (!parsed) {
        form.codeFile.err('Cannot parse the file')
        return null
      }

      return parsed
    }

    // TODO: remove fakeForm
    const _fakeForm = () => {
      form.name.val('Oracle Script ' + loremIpsum({ units: 'words', count: 3 }))
      form.description.val(loremIpsum({ units: 'sentences', count: 3 }))
    }

    _fakeForm()

    return {
      form: form.flatten(),
      isLoading,
      submit,
      onClose: preventIf(dialogs.getHandler('onClose'), isLoading),
    }
  },
})

export default OracleScriptFormModal
export function showOracleScriptFormDialog(callbacks: {
  onSubmit?: DialogHandler
  onClose?: DialogHandler
}): Promise<unknown | null> {
  return dialogs.show(OracleScriptFormModal, callbacks)
}
</script>

<style scoped lang="scss"></style>

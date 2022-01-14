<template>
  <ModalBase
    class="oracle-script-form-modal modal-base_right"
    @close="onClose()"
  >
    <template #title>
      <h3 class="app-form__title">Oracle script creating</h3>
    </template>

    <template #main>
      <form
        class="app-form load-fog"
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent
      >
        <div class="app-form__main">
          <div class="app-form__field">
            <label class="app-form__field-lbl"> Name </label>
            <input
              class="app-form__field-input"
              name="oracle-script-name"
              type="text"
              placeholder="Oracle Script name"
              v-model="form.name"
              :disabled="isLoading"
            />
            <p v-if="form.nameErr" class="app-form__field-err">
              {{ form.nameErr }}
            </p>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl"> Description </label>
            <TextareaField
              v-model="form.description"
              name="oracle-script-description"
              :rows="5"
              :disabled="isLoading"
              placeholder="Oracle Script description"
            />
            <p v-if="form.descriptionErr" class="app-form__field-err">
              {{ form.descriptionErr }}
            </p>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl"> Schema </label>
            <TextareaField
              v-model="form.schema"
              name="oracle-script-schema"
              :rows="2"
              :disabled="isLoading"
              placeholder="Oracle Script Schema"
            />
            <p v-if="form.schemaErr" class="app-form__field-err">
              {{ form.schemaErr }}
            </p>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl"> Code (.wasm) </label>
            <InputFileField
              class="app-form__field-input"
              name="oracle-script-executable"
              accept=".wasm"
              v-model="form.codeFile"
              :disabled="isLoading"
              :drag="true"
            />
            <p v-if="form.codeFileErr" class="app-form__field-err">
              {{ form.codeFileErr }}
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
import { wallet } from '@/api/wallet'
import { callers } from '@/api/callers'
import { dialogs } from '@/helpers/dialogs'
import { readFile } from '@/helpers/files'
import { handleError } from '@/helpers/errors'
import { preventIf } from '@/helpers/functions'
import { notifySuccess } from '@/helpers/notifications'
import { useForm, validators } from '@/composables/useForm'
import ModalBase from './ModalBase.vue'
import InputFileField from '@/components/fields/InputFileField.vue'
import TextareaField from '@/components/fields/TextareaField.vue'

export default defineComponent({
  components: { ModalBase, InputFileField, TextareaField },
  setup() {
    const form = useForm({
      name: ['', validators.required],
      description: ['', validators.required],
      schema: ['', validators.required],
      codeFile: [null as File | null, validators.required],
    })
    const isLoading = ref(false)
    const onSubmit = dialogs.getHandler('onSubmit')

    const submit = async () => {
      if (!form.isValid.value) return
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
          schema: form.schema.val(),
          sourceCodeUrl: '',
        })

        onSubmit()
        notifySuccess('Oracle Script created')
      } catch (error) {
        handleError(error as Error)
      } finally {
        isLoading.value = false
      }
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

    return {
      form: form.flatten(),
      isLoading,
      submit,
      onClose: preventIf(dialogs.getHandler('onClose'), isLoading),
    }
  },
})
</script>

<style scoped lang="scss"></style>

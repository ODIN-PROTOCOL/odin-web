<template>
  <ModalBase
    class="oracle-script-form-modal modal-base--right"
    @close="onClose()"
  >
    <template #title>
      <h3 class="app-form__title">Oracle script creating</h3>
    </template>

    <template #main>
      <form
        class="app-form load-fog"
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent="submit"
      >
        <div class="app-form__main">
          <div class="app-form__field">
            <label class="app-form__field-lbl"> Name </label>
            <input
              class="app-form__field-input"
              name="oracle-script-name"
              type="text"
              placeholder="Oracle Script name"
              v-model="flattenForm.name"
              :disabled="isLoading"
            />
            <p v-if="flattenForm.nameErr" class="app-form__field-err">
              {{ flattenForm.nameErr }}
            </p>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl"> Description </label>
            <TextareaField
              v-model="flattenForm.description"
              name="oracle-script-description"
              :rows="4"
              :disabled="isLoading"
              placeholder="Oracle Script description"
            />
            <p v-if="flattenForm.descriptionErr" class="app-form__field-err">
              {{ flattenForm.descriptionErr }}
            </p>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl"> Schema </label>
            <TextareaField
              v-model="flattenForm.schema"
              name="oracle-script-schema"
              :rows="2"
              :disabled="isLoading"
              placeholder="Oracle Script Schema"
            />
            <p v-if="flattenForm.schemaErr" class="app-form__field-err">
              {{ flattenForm.schemaErr }}
            </p>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl"> URL for Oracle Script </label>
            <TextareaField
              v-model="flattenForm.url"
              name="oracle-script-url"
              :disabled="isLoading"
              placeholder="Oracle Script URL"
            />
            <p v-if="flattenForm.urlErr" class="app-form__field-err">
              {{ flattenForm.urlErr }}
            </p>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl">
              File with the script code
            </label>
            <InputFileField
              class="app-form__field-input"
              name="oracle-script-executable"
              accept=".wasm"
              v-model="flattenForm.codeFile"
              :disabled="isLoading"
              drag
            />
            <p v-if="flattenForm.codeFileErr" class="app-form__field-err">
              {{ flattenForm.codeFileErr }}
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
            {{ bntText }}
          </button>
        </div>
      </form>
    </template>
  </ModalBase>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { wallet } from '@/api/wallet'
import { callers } from '@/api/callers'
import { dialogs } from '@/helpers/dialogs'
import { readFile } from '@/helpers/files'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { preventIf } from '@/helpers/functions'
import { useForm, validators } from '@/composables/useForm'
import { ModalBase } from '@/components/modals'
import InputFileField from '@/components/fields/InputFileField.vue'
import TextareaField from '@/components/fields/TextareaField.vue'
import Long from 'long'

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  oracleScript?: any
}>()

const form = useForm({
  name: [
    props.oracleScript?.name || '',
    validators.required,
    validators.withOutSpaceAtStart,
    validators.maxCharacters(128),
  ],
  description: [
    props.oracleScript?.description || '',
    validators.maxCharacters(256),
  ],
  schema: [props.oracleScript?.schema || '', validators.required],
  url: [
    props.oracleScript?.sourceCodeUrl ||
      props.oracleScript?.source_code_url ||
      '',
    validators.required,
    validators.validateUrl,
  ],
  codeFile: [
    null as File | null,
    validators.required,
    validators.upTo10Mb(),
    validators.acceptFileFormat('.wasm'),
  ],
})

const bntText = computed(() => {
  return props.oracleScript ? 'Edit' : 'Create'
})

const isLoading = ref(false)
const flattenForm = form.flatten()
const onSubmit = dialogs.getHandler('onSubmit')
const onClose = preventIf(dialogs.getHandler('onClose'), isLoading)

const submit = async () => {
  if (!form.isValid.value) return
  const codeFileParsed = await _parseCodeFile()
  if (!codeFileParsed) return

  isLoading.value = true
  try {
    if (props.oracleScript) {
      await callers.editOracleScript({
        oracleScriptId: Long.fromNumber(props.oracleScript?.id),
        name: form.name.val(),
        description: form.description.val(),
        code: codeFileParsed,
        owner: wallet.account.address,
        sender: wallet.account.address,
        schema: form.schema.val(),
        sourceCodeUrl: form.url.val(),
      })
    } else {
      await callers.createOracleScript({
        name: form.name.val(),
        description: form.description.val(),
        code: codeFileParsed,
        owner: wallet.account.address,
        sender: wallet.account.address,
        schema: form.schema.val(),
        sourceCodeUrl: form.url.val(),
      })
    }

    onSubmit()
    handleNotificationInfo('Oracle Script created', TYPE_NOTIFICATION.success)
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
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
</script>

<style scoped lang="scss"></style>

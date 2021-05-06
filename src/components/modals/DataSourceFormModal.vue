<template>
  <ModalBase class="oracle-script-form-modal" @close="onClose()">
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
            v-model="fields.name"
            :disabled="isLoading"
          />
        </div>

        <div class="app-form__field">
          <label class="app-form__field-lbl"> Description </label>
          <textarea
            class="app-form__field-input"
            name="description"
            rows="5"
            v-model="fields.description"
            :disabled="isLoading"
          ></textarea>
        </div>

        <div class="app-form__field">
          <label class="app-form__field-lbl"> Executable (.py) </label>
          <InputFile
            class="app-form__field-input"
            name="executable"
            accept=".py"
            :disabled="isLoading"
            v-model="fields.executable"
          />
          <p v-if="formErrors.executable" class="app-form__field-err">
            {{ formErrors.executable }}
          </p>
        </div>

        <div class="app-form__footer">
          <button
            class="app-btn"
            type="button"
            @click="submit()"
            :disabled="!isFormValid"
          >
            Create
          </button>
        </div>
      </form>
    </template>
  </ModalBase>
</template>

<script lang="ts">
import { createDataSource } from '@/api/callers/createDataSource'
import { getWalletAccounts } from '@/api/client/wallet'
import { DialogCallback, makeDialog } from '@/helpers/dialogs'
import { coins } from '@cosmjs/launchpad'
import { computed, defineComponent, ref } from 'vue'
import { injectDialogHandler } from './modals-helper'
import Long from 'long'
import ModalBase from './ModalBase.vue'
import { readFile } from '@/helpers/files'
import { loremIpsum } from 'lorem-ipsum'
import InputFile from '@/components/inputs/InputFile.vue'
import { useForm, validators } from '@/composables/useForm'

const DataSourceFormModal = defineComponent({
  props: { dataSourceId: Long },
  components: { ModalBase, InputFile },
  setup() {
    const { fields, errors, isValid } = useForm({
      name: ['Data source', validators.required],
      description: ['Hello', validators.required],
      executable: [null as File | null, validators.required],
    })

    // const form = ref({
    //   name: 'DataSource ' + loremIpsum({ units: 'words', count: 3 }),
    //   description: loremIpsum({ units: 'sentences', count: 3 }),
    //   executable: null as File | null,
    // })
    // const formErrors = ref({
    //   executable: null as string | null,
    // })
    const isLoading = ref(false)
    // const isFormValid = computed(() => {
    //   const f = form.value
    //   return f.name.length && f.description.length && f.executable !== null
    // })

    const onSubmit = injectDialogHandler('onSubmit')

    const submit = async () => {
      const [account] = getWalletAccounts()
      const executableParsed = await _parseExecutable(
        fields.value.executable as File | null
      )
      if (!executableParsed) return

      isLoading.value = true
      try {
        console.log({
          name: fields.value.name,
          description: fields.value.description,
          executable: executableParsed,
        })
        // const response = await createDataSource({
        //   name: fields.value.name,
        //   description: fields.value.description,
        //   executable: executableParsed,
        //   fee: coins(1, 'loki'),
        //   owner: account.address,
        //   sender: account.address,
        // })

        onSubmit()
        // console.log('OK!', response)
      } catch (error) {
        console.log('NOT OK!', error)
      }
      isLoading.value = false
    }

    const _parseExecutable = async (
      file: File | null
    ): Promise<Uint8Array | null> => {
      errors.value.executable = null

      const parsed = file ? await readFile(file as File, 'uint8Array') : null
      if (!parsed) {
        errors.value.executable = 'Cannot parse the file'
        return null
      }

      return parsed
    }

    return {
      fields,
      errors,
      isValid,
      isLoading,
      submit,
      onClose: injectDialogHandler('onClose'),
    }
  },
})

export default DataSourceFormModal
export function showDataSourceFormDialog(
  callbacks: {
    onSubmit?: DialogCallback
    onClose?: DialogCallback
  },
  props?: { dataSourceId?: Long.Long }
): Promise<unknown | null> {
  return makeDialog(DataSourceFormModal, callbacks, { props })
}
</script>

<style scoped lang="scss"></style>

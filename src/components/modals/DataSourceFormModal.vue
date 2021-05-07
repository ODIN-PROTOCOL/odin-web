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
          <label class="app-form__field-lbl"> Executable (.py) </label>
          <InputFile
            class="app-form__field-input"
            name="executable"
            accept=".py"
            :disabled="isLoading"
            v-model="executable"
          />
          <p v-if="executableError" class="app-form__field-err">
            {{ executableError }}
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
import { useField, useForm, validators } from '@/composables/useForm'

const DataSourceFormModal = defineComponent({
  props: { dataSourceId: Long },
  components: { ModalBase, InputFile },
  setup() {
    const fdName = useField(
      'DataSource ' + loremIpsum({ units: 'words', count: 3 }),
      [validators.required]
    )
    const fdDescription = useField(
      loremIpsum({ units: 'sentences', count: 3 }),
      [validators.required]
    )
    const fdExecutable = useField(null as File | null, [validators.required])
    const form = useForm(fdName, fdDescription, fdExecutable)

    const isLoading = ref(false)
    const onSubmit = injectDialogHandler('onSubmit')

    const submit = async () => {
      const [account] = getWalletAccounts()
      const executableParsed = await _parseExecutable(
        fdExecutable.current.value as File | null
      )
      if (!executableParsed) return

      isLoading.value = true
      try {
        console.log({
          name: fdName.current.value,
          description: fdDescription.current.value,
          executable: executableParsed,
        })
        // const response = await createDataSource({
        //   name: value.name,
        //   description: value.description,
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
      fdExecutable.error.value = null

      const parsed = file ? await readFile(file as File, 'uint8Array') : null
      // if (!parsed) {
      fdExecutable.error.value = 'Cannot parse the file'
      return null
      // }

      // return parsed
    }

    return {
      name: fdName.current,
      nameError: fdName.errorIfDirty,
      description: fdDescription.current,
      descriptionError: fdDescription.errorIfDirty,
      executable: fdExecutable.current,
      executableError: fdExecutable.errorIfDirty,
      isValid: form.isValid,
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

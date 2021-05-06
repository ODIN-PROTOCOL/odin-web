<template>
  <ModalBase class="data-source-form-modal" @close="onClose()">
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
            v-model="form.name"
            :disabled="isLoading"
          />
        </div>

        <div class="app-form__field">
          <label class="app-form__field-lbl"> Description </label>
          <textarea
            class="app-form__field-input"
            name="description"
            rows="5"
            v-model="form.description"
            :disabled="isLoading"
          ></textarea>
        </div>

        <div class="app-form__field">
          <label class="app-form__field-lbl"> Executable (.py) </label>
          <input
            class="app-form__field-input"
            type="file"
            name="executable"
            @change="parseFile($event)"
            accept=".py"
            :disabled="isLoading"
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
import { getEventFile, readFile } from '@/helpers/files'
import { loremIpsum } from 'lorem-ipsum'

const DataSourceFormModal = defineComponent({
  props: { dataSourceId: Long },
  components: { ModalBase },
  setup() {
    const form = ref({
      name: 'DataSource ' + loremIpsum({ units: 'words', count: 3 }),
      description: loremIpsum({ units: 'sentences', count: 3 }),
      executable: null as File | null,
    })
    const formErrors = ref({
      executable: null as string | null,
    })
    const isLoading = ref(false)
    const isFormValid = computed(() => {
      const f = form.value
      return f.name.length && f.description.length && f.executable !== null
    })

    const onSubmit = injectDialogHandler('onSubmit')

    const parseFile = (event: Event | DragEvent) => {
      const file = getEventFile(event)
      if (!file) return

      form.value.executable = file
    }

    const submit = async () => {
      const [account] = getWalletAccounts()
      const executableParsed = await _parseExecutable(form.value.executable)
      if (!executableParsed) return

      isLoading.value = true
      try {
        const response = await createDataSource({
          name: form.value.name,
          description: form.value.description,
          executable: executableParsed,
          fee: coins(1, 'loki'),
          owner: account.address,
          sender: account.address,
        })

        onSubmit()
        console.log('OK!', response)
      } catch (error) {
        console.log('NOT OK!', error)
      }
      isLoading.value = false
    }

    const _parseExecutable = async (
      file: File | null
    ): Promise<Uint8Array | null> => {
      formErrors.value.executable = null

      const parsed = file ? await readFile(file as File, 'uint8Array') : null
      if (!parsed) {
        formErrors.value.executable = 'Cannot parse the file'
        return null
      }

      return parsed
    }

    return {
      form,
      formErrors,
      isFormValid,
      isLoading,
      submit,
      parseFile,
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

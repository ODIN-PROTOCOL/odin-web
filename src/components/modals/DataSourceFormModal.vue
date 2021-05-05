<template>
  <ModalBase class="data-source-form-modal" @close="onClose()">
    <template #main>
      <form class="data-source-form-modal__form" @submit.prevent>
        <label class="data-source-form-modal__form-field">
          <span class="data-source-form-modal__form-field-lbl"> Name </span>
          <input
            class="data-source-form-modal__form-field-input"
            name="name"
            type="text"
            v-model="form.name"
          />
        </label>

        <label class="data-source-form-modal__form-field">
          <span class="data-source-form-modal__form-field-lbl">
            Description
          </span>
          <textarea
            class="data-source-form-modal__form-field-input"
            name="description"
            cols="30"
            rows="10"
            v-model="form.description"
          ></textarea>
        </label>

        <label class="data-source-form-modal__form-field">
          <span class="data-source-form-modal__form-field-lbl">
            Executable (.py)
          </span>
          <input
            class="data-source-form-modal__form-field-input"
            type="file"
            name="executable"
            @change="parseFile($event)"
            accept=".py"
          />
          <p
            v-if="executableParseError"
            class="data-source-form-modal__form-field-error"
          >
            {{ executableParseError }}
          </p>
        </label>

        <button
          class="data-source-form-modal__form-submit-btn"
          type="button"
          @click="submit()"
          :disabled="!isFormValid"
        >
          Create
        </button>
      </form>
    </template>
  </ModalBase>
</template>

<script lang="ts">
import { createDataSource } from '@/api/callers/createDataSource'
import { getWalletAccounts } from '@/api/client/wallet'
import { makeDialog } from '@/helpers/dialogs'
import { coins } from '@cosmjs/launchpad'
import { computed, defineComponent, ref } from 'vue'
import { injectDialogHandler } from './modals-helper'
import Long from 'long'
import ModalBase from './ModalBase.vue'
import { getEventFile, readFile } from '@/helpers/files'

const DataSourceFormModal = defineComponent({
  props: { dataSourceId: Long },
  components: { ModalBase },
  setup() {
    const form = ref({
      name: 'Test DataSource',
      description:
        'Proident elit eiusmod incididunt reprehenderit elit nostrud nulla et veniam Lorem adipisicing esse. Deserunt aute tempor id incididunt magna enim eu esse. Ut voluptate ad occaecat cillum voluptate adipisicing est cillum. Officia cillum id id do Lorem laboris anim tempor. Exercitation mollit laboris anim quis elit consectetur cillum. Veniam culpa id aliqua pariatur deserunt ex Lorem et fugiat anim enim et duis.',
      executable: null as File | null,
    })
    const isFormValid = computed(() => {
      const f = form.value
      return f.name.length && f.description.length && f.executable !== null
    })
    const executableParseError = ref()

    const parseFile = (event: Event | DragEvent) => {
      const file = getEventFile(event)
      if (!file) return

      form.value.executable = file
    }

    const submit = async () => {
      const [account] = getWalletAccounts()
      const executableParsed = await _parseExecutable(form.value.executable)
      if (!executableParsed) return

      try {
        const response = await createDataSource({
          name: form.value.name,
          description: form.value.description,
          executable: executableParsed,
          fee: coins(1, 'loki'),
          owner: account.address,
          sender: account.address,
        })

        console.log('OK!', response.data)
      } catch (error) {
        console.log('NOT OK!', error.txCode)
      }
    }

    const _parseExecutable = async (
      file: File | null
    ): Promise<Uint8Array | null> => {
      const parsed = file ? await readFile(file as File, 'arrayBuffer') : null
      if (!parsed) {
        executableParseError.value = 'Cannot parse the file'
        return null
      }
      return new Uint8Array(parsed)
    }

    return {
      form,
      isFormValid,
      executableParseError,
      submit,
      parseFile,
      onClose: injectDialogHandler('onClose'),
    }
  },
})

export default DataSourceFormModal
export function showCreateDataSourceFormDialog(
  dataSourceId?: Long.Long
): Promise<null> {
  return makeDialog<null>(DataSourceFormModal, {}, { props: { dataSourceId } })
}
</script>

<style scoped lang="scss">
.data-source-form-modal__form-field {
  display: grid;
  grid: auto-flow auto / auto;
  gap: 8px;

  & + & {
    margin-top: 12px;
  }
}

.data-source-form-modal__form-submit-btn {
  margin-top: 16px;
}
</style>

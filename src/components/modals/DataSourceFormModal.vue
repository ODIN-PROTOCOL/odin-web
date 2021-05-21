<template>
  <ModalBase class="data-source-form-modal" @close="onClose()">
    <template #title>
      <h3>Create data source</h3>
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
            name="data-source-name"
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
            name="data-source-description"
            rows="5"
            v-model="form.description"
            :disabled="isLoading"
          ></textarea>
          <p v-if="form.descriptionErr" class="app-form__field-err">
            {{ form.descriptionErr }}
          </p>
        </div>

        <div class="app-form__field">
          <label class="app-form__field-lbl"> Executable (.py) </label>
          <InputFile
            class="app-form__field-input"
            name="data-source-executable"
            accept=".py"
            v-model="form.executable"
            :disabled="isLoading"
          />
          <p v-if="form.executableErr" class="app-form__field-err">
            {{ form.executableErr }}
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
import { coins } from '@cosmjs/launchpad'
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

const DataSourceFormModal = defineComponent({
  props: { dataSourceId: String },
  components: { ModalBase, InputFile },
  setup() {
    const form = useForm({
      name: ['', validators.required],
      description: ['', validators.required],
      executable: [null as File | null, validators.required],
    })
    const isLoading = ref(false)
    const onSubmit = dialogs.getHandler('onSubmit')

    const submit = async () => {
      const executableParsed = await _parseExecutable()
      if (!executableParsed) return

      isLoading.value = true
      try {
        await callers.createDataSource({
          name: form.name.val(),
          description: form.description.val(),
          executable: executableParsed,
          fee: coins(1, 'loki'),
          owner: wallet.account.address,
          sender: wallet.account.address,
        })

        onSubmit()
        notifySuccess('Data source created')
      } catch (error) {
        handleError(error)
      }
      isLoading.value = false
    }

    const _parseExecutable = async (): Promise<Uint8Array | null> => {
      form.executable.err(null)

      const file = form.executable.val() as File | null
      const parsed = file ? await readFile(file, 'uint8Array') : null
      if (!parsed) {
        form.executable.err('Cannot parse the file')
        return null
      }

      return parsed
    }

    // TODO: remove fakeForm
    const _fakeForm = () => {
      form.name.val('Data source ' + loremIpsum({ units: 'words', count: 3 }))
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

export default DataSourceFormModal
export function showDataSourceFormDialog(
  callbacks: {
    onSubmit?: DialogHandler
    onClose?: DialogHandler
  },
  props?: { dataSourceId?: string }
): Promise<unknown | null> {
  return dialogs.show(DataSourceFormModal, callbacks, { props })
}
</script>

<style scoped lang="scss"></style>

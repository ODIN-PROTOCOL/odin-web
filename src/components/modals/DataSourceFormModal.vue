<template>
  <ModalBase class="data-source-form-modal modal-base_right" @close="onClose()">
    <template #title>
      <h3 class="app-form__title">Data source creating</h3>
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
              name="data-source-name"
              type="text"
              v-model="form.name"
              :disabled="isLoading"
              placeholder="Data Source name"
            />
            <p v-if="form.nameErr" class="app-form__field-err">
              {{ form.nameErr }}
            </p>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl">Description</label>
            <TextareaField
              v-model="form.description"
              name="data-source-description"
              :rows="5"
              :disabled="isLoading"
              placeholder="Data Source Description"
            />
            <p v-if="form.descriptionErr" class="app-form__field-err">
              {{ form.descriptionErr }}
            </p>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl"> Price</label>
            <input
              class="app-form__field-input"
              name="data-source-price"
              v-model="form.price"
              type="text"
              :disabled="isLoading"
              placeholder="Data source price"
            />
            <p v-if="form.priceErr" class="app-form__field-err">
              {{ form.priceErr }}
            </p>
          </div>

          <div class="app-form__field">
            <InputFileField
              class="app-form__field-input"
              name="data-source-executable"
              accept=".py"
              v-model="form.executable"
              :disabled="isLoading"
              :drag="true"
            />
            <p v-if="form.executableErr" class="app-form__field-err">
              {{ form.executableErr }}
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
import { coins } from '@cosmjs/launchpad'
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

const DataSourceFormModal = defineComponent({
  props: { dataSourceId: String },
  components: { ModalBase, InputFileField, TextareaField },
  setup() {
    const form = useForm({
      name: ['', validators.required],
      description: ['', validators.required],
      price: ['', validators.required, ...validators.num(1)],
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
          fee: coins(Number(form.price.val()), 'loki'),
          owner: wallet.account.address,
          sender: wallet.account.address,
        })

        onSubmit()
        notifySuccess('Data source created')
      } catch (error) {
        handleError(error as Error)
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

    return {
      form: form.flatten(),
      isLoading,
      submit,
      onClose: preventIf(dialogs.getHandler('onClose'), isLoading),
    }
  },
})

export default DataSourceFormModal
</script>

<style scoped lang="scss"></style>

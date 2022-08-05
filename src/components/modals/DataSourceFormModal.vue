<template>
  <ModalBase
    class="data-source-form-modal modal-base--right"
    @close="onClose()"
  >
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
              v-model="flattenForm.name"
              :disabled="isLoading"
              placeholder="Data Source name"
            />
            <p v-if="flattenForm.nameErr" class="app-form__field-err">
              {{ flattenForm.nameErr }}
            </p>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl">Description</label>
            <TextareaField
              v-model="flattenForm.description"
              name="data-source-description"
              :rows="5"
              :disabled="isLoading"
              placeholder="Data Source Description"
            />
            <p v-if="flattenForm.descriptionErr" class="app-form__field-err">
              {{ flattenForm.descriptionErr }}
            </p>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl">Assets</label>
            <VuePicker
              class="_vue-picker"
              placeholder="Assets"
              v-model="flattenForm.assets"
            >
              <template #dropdownInner>
                <div class="_vue-picker__dropdown-custom">
                  <VuePickerOption
                    v-for="{ text, value } in assetsChanges"
                    :key="text"
                    :value="value"
                    :text="text"
                  >
                    {{ text }}
                  </VuePickerOption>
                </div>
              </template>
            </VuePicker>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl">Price</label>
            <div class="app-form__field-input-wrapper">
              <span>{{ flattenForm.assets.toUpperCase() }}</span>
              <input
                class="app-form__field-input"
                name="data-source-price"
                v-model="flattenForm.price"
                type="text"
                :disabled="isLoading"
                placeholder="1"
              />
            </div>
            <p v-if="flattenForm.priceErr" class="app-form__field-err">
              {{ flattenForm.priceErr }}
            </p>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl">
              File with the script code
            </label>
            <InputFileField
              class="app-form__field-input"
              name="data-source-executable"
              accept=".py"
              v-model="flattenForm.executable"
              :disabled="isLoading"
              :drag="true"
            />
            <p v-if="flattenForm.executableErr" class="app-form__field-err">
              {{ flattenForm.executableErr }}
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
            type="submit"
            @click="submit()"
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
import { coins } from '@cosmjs/launchpad'
import { wallet } from '@/api/wallet'
import { callers } from '@/api/callers'
import { dialogs } from '@/helpers/dialogs'
import { readFile } from '@/helpers/files'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { preventIf } from '@/helpers/functions'
import { assetsChanges } from '@/helpers/translators'
import { useForm, validators } from '@/composables/useForm'
import { ModalBase } from '@/components/modals'
import InputFileField from '@/components/fields/InputFileField.vue'
import TextareaField from '@/components/fields/TextareaField.vue'
import Long from 'long'
import {
  convertOdinToLoki,
  getDenom,
  setDenom,
  getLokiFromString,
  convertLokiToOdin,
} from '@/helpers/converters'
import { VuePicker, VuePickerOption } from '@invisiburu/vue-picker'

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataSource?: any
}>()

const assets = computed(() => {
  if (props.dataSource?.fee) {
    return props.dataSource.fee[0]?.denom
  } else return props.dataSource?.fee ? props.dataSource?.fee[0]?.denom : 'loki'
})

const price = computed(() => {
  if (props.dataSource) {
    return props.dataSource?.fee
      ? convertLokiToOdin(props.dataSource?.fee[0]?.amount, {
          onlyNumber: true,
        })
      : convertLokiToOdin(getLokiFromString(props.dataSource?.fee_amount), {
          onlyNumber: true,
        })
  } else return 1
})
const bntText = computed(() => {
  return props.dataSource ? 'Edit' : 'Create'
})
const form = useForm({
  name: [
    props.dataSource?.name || '',
    validators.required,
    validators.withOutSpaceAtStart,
    validators.maxCharacters(128),
  ],
  description: [
    props.dataSource?.description || '',
    validators.maxCharacters(256),
  ],
  assets: [setDenom(assets.value), validators.required],
  price: [
    Number(price.value),
    validators.required,
    validators.number,
    validators.sixDecimalNumber,
    ...validators.num(0.000001),
    validators.maxCharacters(32),
  ],
  executable: [
    null as File | null,
    validators.required,
    validators.upTo10Mb(),
    validators.acceptFileFormat('.py'),
  ],
})
const isLoading = ref(false)
const flattenForm = form.flatten()
const onClose = preventIf(dialogs.getHandler('onClose'), isLoading)
const onSubmit = dialogs.getHandler('onSubmit')

const submit = async () => {
  if (!form.isValid.value) return
  const executableParsed = await _parseExecutable()
  if (!executableParsed) return

  isLoading.value = true

  try {
    if (props.dataSource) {
      await callers.editDataSource({
        dataSourceId: Long.fromNumber(Number(props.dataSource.id)),
        name: form.name.val(),
        description: form.description.val(),
        executable: executableParsed,
        fee: coins(
          convertOdinToLoki(String(form.price.val())),
          getDenom(form.assets.val()),
        ),
        owner: wallet.account.address,
        sender: wallet.account.address,
      })
    } else {
      await callers.createDataSource({
        name: form.name.val(),
        description: form.description.val(),
        executable: executableParsed,
        fee: coins(
          convertOdinToLoki(String(form.price.val())),
          getDenom(form.assets.val()),
        ),
        owner: wallet.account.address,
        sender: wallet.account.address,
      })
    }
    onSubmit()
    handleNotificationInfo('Data source created', TYPE_NOTIFICATION.success)
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
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
</script>

<style scoped lang="scss"></style>

<template>
  <ModalBase class="exchange-form-modal" @close="onClose()">
    <template #title>
      <h3>Faucet</h3>
    </template>

    <template #main>
      <form
        class="app-form load-fog"
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent
      >
        <div class="app-form__field">
          <label class="app-form__field-lbl"> Asset </label>
          <select
            class="app-form__field-input"
            name="exchange-source-asset"
            v-model="form.asset"
            :disabled="isLoading"
          >
            <option v-for="asset in assets" :key="asset" :value="asset">
              {{ asset }}
            </option>
          </select>
          <p v-if="form.assetErr" class="app-form__field-err">
            {{ form.askCountErr }}
          </p>
        </div>

        <div class="app-form__footer">
          <button
            class="app-btn"
            type="button"
            @click="submit()"
            :disabled="!form.isValid || isLoading"
          >
            Request
          </button>
        </div>
      </form>
    </template>
  </ModalBase>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { callers } from '@/api/callers'
import { DialogHandler, dialogs } from '@/helpers/dialogs'
import { handleError } from '@/helpers/errors'
import { preventIf } from '@/helpers/functions'
import { notifySuccess } from '@/helpers/notifications'
import { useForm, validators } from '@/composables/useForm'
import ModalBase from './ModalBase.vue'

const FaucetFormModal = defineComponent({
  components: { ModalBase },
  setup() {
    const assets = ['LOKI']
    const form = useForm({
      asset: [assets[0], validators.required, validators.oneOf(assets)],
    })
    const isLoading = ref(false)
    const onSubmit = dialogs.getHandler('onSubmit')
    const onClose = preventIf(dialogs.getHandler('onClose'), isLoading)

    const submit = async () => {
      isLoading.value = true
      try {
        const r = await callers.faucetRequest({
          denom: form.asset.val().toLowerCase(),
        })

        console.log(r)

        onSubmit()
        notifySuccess('Faucet request created')
      } catch (error) {
        handleError(error)
      }
      isLoading.value = false
    }

    return {
      form: form.flatten(),
      isLoading,
      submit,
      assets,
      onClose,
    }
  },
})

export default FaucetFormModal
export function showFaucetFormDialog(callbacks?: {
  onSubmit?: DialogHandler
  onClose?: DialogHandler
}): Promise<unknown | null> {
  return dialogs.show(FaucetFormModal, callbacks)
}
</script>

<style scoped lang="scss"></style>

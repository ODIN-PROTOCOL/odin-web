<template>
  <ModalBase class="exchange-form-modal" @close="onClose()">
    <template #title>
      <h3>MetaMask | balance: {{ balance }}</h3>
    </template>

    <template #main>
      <form
        class="app-form load-fog"
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent
      >
        <div class="app-form__field">
          <label class="app-form__field-lbl"> Asset </label>
          <input
            class="app-form__field-input"
            type="text"
            v-model="form.asset"
          />
          <p v-if="form.assetErr" class="app-form__field-err">
            {{ form.askCountErr }}
          </p>
        </div>
        <div class="app-form__footer">
          <button
            class="app-btn"
            type="button"
            @click="connectMetaMask()"
            :disabled="!form.isValid || isLoading"
          >
            Connect to MetaMask
          </button>
        </div>
      </form>
    </template>
  </ModalBase>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { preventIf } from '@/helpers/functions'
import { dialogs, DialogPayloadHandler, DialogHandler } from '@/helpers/dialogs'
import { DecoratedFn } from '@/shared-types.d.ts'
import { notifySuccess } from '@/helpers/notifications'
import { handleError } from '@/helpers/errors'
import { useForm, validators } from '@/composables/useForm'
import ModalBase from '@/components/modals/ModalBase.vue'
import { useWeb3 } from '@/composables/useWeb3/useWeb3'
import { bigFromPrecise } from '@/helpers/bigMath'

const MetaMaskFormModal = defineComponent({
  name: 'MetaMaskModal',
  components: { ModalBase },
  setup(_, { emit }) {
    const assets: Array<string> = ['LOKI']
    const form = useForm({
      asset: [assets[0], validators.required, validators.oneOf(assets)],
    })

    const isLoading = ref<boolean>(false)
    const onSubmit: DecoratedFn<DialogPayloadHandler> =
      dialogs.getHandler('onSubmit')
    const onClose: DecoratedFn<DialogPayloadHandler> = preventIf(
      dialogs.getHandler('onClose'),
      isLoading
    )

    const account = ref<string | null>(null)

    const balance = ref<string>()

    // await contracts.odin.methods.approve()
    const { web3, contracts } = useWeb3({
      onAccountConnected: async (acc): Promise<void> => {
        account.value = acc

        console.log(account.value)

        // await contracts.odin.methods.balanceOf(account.value).call()
        // console.log(contracts)
        // bigFromPrecise(
        //   await contracts.odin.methods.balanceOf(account.value).call(),
        //   Number(await contracts.odin.methods.decimals().call())
        // ).toString()
      },
      onAccountDisconnected: () => {
        account.value = null
        console.log('onAccountDisconnected')
      },
    })

    const connectMetaMask = () => {
      emit('reloadTab')
      console.log(1)
      web3.eth.requestAccounts()
    }

    const submit = async (): Promise<void> => {
      isLoading.value = true
      try {
        console.log('submit')
        onSubmit()
        notifySuccess('Submit success!')
      } catch (error) {
        console.log('error', error)
        const indTime: number = error.message.indexOf('time')
        const errorStr: string = error.message.slice(10, indTime - 3)
        const newError: Error = new Error(`You ${errorStr}`)

        handleError(newError)
      }
    }
    isLoading.value = false

    onMounted(() => {
      console.log(123)
      web3.eth.requestAccounts()
    })

    return {
      form: form.flatten(),
      isLoading,
      onClose,
      submit,
      connectMetaMask,
      account,
      balance,
    }
  },
})

export default MetaMaskFormModal
export function showMetaMaskFormDialog(callbacks?: {
  onSubmit?: DialogHandler
  onClose?: DialogHandler
}): Promise<unknown | null> {
  return dialogs.show(MetaMaskFormModal, callbacks)
}
</script>

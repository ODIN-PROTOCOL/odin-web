<template>
  <ModalBase class="exchange-form-modal" @close="onClose()">
    <template #title>
      <img src="~@/assets/brand/metamask-fox.svg" alt="metamask_logo" />
    </template>

    <template #main>
      <form
        class="app-form load-fog metamask-form"
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent
      >
        <template v-if="!account || needAuth.value">
          <div class="app-form__field">
            <button
              class="app-btn"
              type="button"
              @click="connectMetaMask()"
              :disabled="!form.isValid || isLoading"
            >
              Connect to MetaMask
            </button>
          </div>
        </template>
        <template v-else>
          <div class="app-form__field" v-if="balance">
            <label class="app-form__field-lbl"> You Balance </label>
            <input
              class="app-form__field-input app-form__field-input--disabled"
              type="text"
              v-model="balanceBigFromPrecise"
              disabled
            />
          </div>
          <div class="app-form__field">
            <label class="app-form__field-lbl"> Amount </label>
            <input
              class="app-form__field-input"
              type="number"
              v-model="form.amount"
            />
            <p class="app-form__field-lbl" style="padding: 1rem 0; font-size: 1rem; color: gray">form.amount: {{ form.amount }}</p>
            <p v-if="form.amountErr" class="app-form__field-err">
              {{ form.amountErr }}
            </p>
          </div>
          <div class="app-form__footer">
            <button
              class="app-btn"
              type="button"
              @click="getExchange"
              :disabled="!form.isValid || isLoading"
            >
              Exchange
            </button>
          </div>
        </template>
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
  setup() {
    const needAuth = ref<boolean>(false)
    const account = ref<string | null>(null)
    const balance = ref<string | null>()
    const balanceBigFromPrecise = ref<string | null>()

    const form = useForm({
      amount: [
        0,
        validators.required,
        ...validators.num(0, Number(balanceBigFromPrecise)),
      ],
    })

    const isLoading = ref<boolean>(false)
    const onSubmit: DecoratedFn<DialogPayloadHandler> =
      dialogs.getHandler('onSubmit')
    const onClose: DecoratedFn<DialogPayloadHandler> = preventIf(
      dialogs.getHandler('onClose'),
      isLoading
    )

    // await contracts.odin.methods.approve()
    // contracts
    const { web3, contracts } = useWeb3({
      onAccountConnected: async (acc): Promise<void> => {
        account.value = acc
        if (account.value) await getBalance()
        console.log('onAccountConnected')
      },
      onAccountDisconnected: () => {
        account.value = null
        balance.value = null
        console.log('onAccountDisconnected')
      },
    })

    const getExchange = async (): Promise<void> => {
      isLoading.value = true
      console.log(
        await contracts.odin.methods
          .approve(account.value as string, form.amount.val())
          .call()
      )
      isLoading.value = false
    }

    const getBalance = async (): Promise<void> => {
      balance.value = await contracts.odin.methods
        .balanceOf(account.value as string)
        .call()

      const temp = bigFromPrecise(
        Number(balance.value),
        Number(await contracts.odin.methods.decimals().call())
      ).toString()

      balanceBigFromPrecise.value = temp
      if (temp) isLoading.value = false
    }

    const connectMetaMask = async () => {
      await web3.eth.requestAccounts()
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

    onMounted(async (): Promise<void> => {
      isLoading.value = true
      if ((window as any).ethereum) {
        const accounts = await web3.eth.getAccounts()
        if (accounts.length <= 0) {
          needAuth.value = true
        } else {
          needAuth.value = false
          await getBalance()
        }
      }
    })

    return {
      form: form.flatten(),
      isLoading,
      onClose,
      submit,
      connectMetaMask,
      account,
      balance,
      balanceBigFromPrecise,
      needAuth,
      getExchange,
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

<style lang="scss">
.metamask-form {
  margin-top: 3rem;
}
</style>

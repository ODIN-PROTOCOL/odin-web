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
              :disabled="isLoading"
            >
              Connect to MetaMask
            </button>
          </div>
        </template>
        <template v-else>
          <template v-if="balance">
            <div class="app-form__field">
              <label class="app-form__field-lbl"> You Balance </label>
              <input
                class="app-form__field-input app-form__field-input--disabled"
                type="text"
                v-model="balanceBigFromPrecise"
                disabled
              />
            </div>
            <div class="app-form__field">
              <label class="app-form__field-lbl">
                Max withdrawal amount per time
              </label>
              <input
                class="app-form__field-input app-form__field-input--disabled"
                type="text"
                v-model="maxWithdrawalPerTime"
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
        </template>
      </form>
    </template>
  </ModalBase>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { preventIf } from '@/helpers/functions'
import { dialogs, DialogPayloadHandler, DialogHandler } from '@/helpers/dialogs'
import { DecoratedFn } from '@/shared-types'
import { notifySuccess } from '@/helpers/notifications'
import { handleError } from '@/helpers/errors'
import { useForm, validators } from '@/composables/useForm'
import ModalBase from '@/components/modals/ModalBase.vue'
import { useWeb3 } from '@/composables/useWeb3/useWeb3'
import { bigFromPrecise, bigToPrecise } from '@/helpers/bigMath'

const MetaMaskFormModal = defineComponent({
  name: 'MetaMaskModal',
  components: { ModalBase },
  setup() {
    const getError = (error: Error): void => {
      console.log('Error', error)
      const indTime: number = error.message.indexOf('time')
      const errorStr: string = error.message.slice(10, indTime - 3)
      const newError: Error = new Error(`You ${errorStr}`)
      handleError(newError)
    }

    const needAuth = ref<boolean>(false)
    const account = ref<string | null>(null)
    const maxWithdrawalPerTime = ref<string | null>(null)
    const balance = ref<string | null>()
    const balanceDecimals = ref<string | null>()
    const balanceBigFromPrecise = ref<string | null>()

    const form = useForm({
      amount: [
        0,
        validators.required,
        ...validators.num(0, Number(maxWithdrawalPerTime)),
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

    const { web3, contracts } = useWeb3()

    useWeb3({
      onAccountConnected: async (acc): Promise<void> => {
        account.value = acc
        if (account.value) {
          try {
            await getBalance() // Uncaught (in promise) TypeError: getBalance is not a function
          } catch (error) {
            getError(error)
          }
        }
        isLoading.value = false
        console.log('onAccountConnected')
      },
      onAccountDisconnected: (): void => {
        account.value = null
        balance.value = null
        console.log('onAccountDisconnected')
      },
      onProviderDetected: async (): Promise<void> => {
        try {
          await isNeedAuth() // Uncaught (in promise) TypeError: isNeedAuth is not a function
        } catch (error) {
          getError(error)
        }
      },
      onProviderUndetected: async (): Promise<void> => {
        console.log('onProviderUndetected')
      },
    })

    const isNeedAuth = async () => {
      const accounts = await web3.eth.getAccounts() // Uncaught (in promise) TypeError: Cannot read property 'eth' of undefined
      needAuth.value = accounts.length <= 0
    }
    const getBalance = async (): Promise<void> => {
      maxWithdrawalPerTime.value = bigFromPrecise(
        Number(await contracts.odin.methods.totalSupply().call()),
        Number(balanceDecimals.value)
      ).toString()

      balance.value = await contracts.odin.methods
        .balanceOf(account.value as string)
        .call()
      balanceDecimals.value = await contracts.odin.methods.decimals().call()

      const temp = bigFromPrecise(
        Number(balance.value),
        Number(balanceDecimals.value)
      ).toString()

      balanceBigFromPrecise.value = temp
      if (temp) isLoading.value = false
    }

    const getExchange = async (): Promise<void> => {
      isLoading.value = true

      try {
        console.log(
          'amount bigToPrecise',
          bigToPrecise(
            form.amount.val(),
            Number(balanceDecimals.value)
          ).toString()
        )
        console.log(
          'approve',
          await contracts.odin.methods
            .approve(
              account.value as string,
              bigToPrecise(
                form.amount.val(),
                Number(balanceDecimals.value)
              ).toString()
            )
            .call()
        )
      } catch (error) {
        getError(error)
      }
      isLoading.value = false
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
        getError(error)
      }
    }

    onMounted(async (): Promise<void> => {
      isLoading.value = true
    })

    return {
      form: form.flatten(),
      isLoading,
      onClose,
      submit,
      connectMetaMask,
      account,
      maxWithdrawalPerTime,
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

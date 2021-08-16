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
            <div class="app-form__field" v-if="maxWithdrawalPerTime">
              <label class="app-form__field-lbl">
                Max withdrawal amount per time {{ maxWithdrawalPerTime.denom }}
              </label>
              <input
                class="app-form__field-input app-form__field-input--disabled"
                type="text"
                :value="maxWithdrawalPerTime.amount"
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
                @click="exchange"
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
import { defineComponent, ref } from 'vue'
import { preventIf } from '@/helpers/functions'
import { dialogs, DialogPayloadHandler, DialogHandler } from '@/helpers/dialogs'
import { DecoratedFn } from '@/shared-types'
import { notifySuccess } from '@/helpers/notifications'
import { handleError } from '@/helpers/errors'
import { useForm, validators } from '@/composables/useForm'
import ModalBase from '@/components/modals/ModalBase.vue'
import { useWeb3 } from '@/composables/useWeb3/useWeb3'
import { bigFromPrecise, bigToPrecise, bigToStrStrict } from '@/helpers/bigMath'
import { wallet } from '@/api/wallet'

const MetaMaskFormModal = defineComponent({
  name: 'MetaMaskModal',
  components: { ModalBase },
  props: {
    maxWithdrawalPerTime: { type: Object, required: true },
    odinToLokiRate: { type: Object, required: true },
  },
  setup(props) {
    const needAuth = ref<boolean>(false)
    const account = ref<string | null>(null)
    const balance = ref<string | null>()
    const balanceDecimals = ref<string | null>()
    const balanceBigFromPrecise = ref<string | null>()

    // TODO: this
    // Add the validation for the amount to exchange.
    // actual amount = amount_to_exchange - _getBurnFee() / 10000  * amount_to_exchange;
    // converted_amount =  actual_amount / 18 (it is Odin token precision) * rate (odin/loki);
    // max_withdrawal_amount (mint/params) >= converted_amount > 0

    const form = useForm({
      amount: [
        0,
        validators.required,
        ...validators.num(0, Number(props.maxWithdrawalPerTime.amount)),
      ],
    })

    const isLoading = ref<boolean>(false)
    const onSubmit: DecoratedFn<DialogPayloadHandler> = dialogs.getHandler(
      'onSubmit'
    )
    const onClose: DecoratedFn<DialogPayloadHandler> = preventIf(
      dialogs.getHandler('onClose'),
      isLoading
    )

    // await contracts.odin.methods.approve()
    // contracts

    const { web3, contracts } = useWeb3()

    const isNeedAuth = async () => {
      const accounts = await web3.eth.getAccounts() // Uncaught (in promise) TypeError: Cannot read property 'eth' of undefined
      needAuth.value = accounts.length <= 0
    }
    const getBalance = async (): Promise<void> => {
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

    const exchange = async (): Promise<void> => {
      isLoading.value = true
      try {
        const amount = bigToStrStrict(
          bigToPrecise(form.amount.val(), Number(balanceDecimals.value))
        )
        await contracts.odin.methods
          .approve(account.value as string, amount)
          .send()
          .on('receipt', (_) => console.log(_))
          .on('error', (err) => handleError(err))
        await contracts.bridge.methods
          .deposit(
            wallet.account.address,
            contracts.odin.options.address,
            amount
          )
          .send()
          .on('receipt', (_) => console.log('deposit receipt', _))
          .on('error', (err) => handleError(err))
      } catch (error) {
        handleError(error)
      }
      isLoading.value = false
    }

    const connectMetaMask = async () => {
      await web3.eth.requestAccounts()
    }

    useWeb3({
      onAccountConnected: async (acc): Promise<void> => {
        account.value = acc
        if (account.value) {
          try {
            await getBalance() // Uncaught (in promise) TypeError: getBalance is not a function
          } catch (error) {
            handleError(error)
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
          handleError(error)
        }
      },
      onProviderUndetected: async (): Promise<void> => {
        console.log('onProviderUndetected')
      },
    })

    const submit = async (): Promise<void> => {
      isLoading.value = true
      try {
        console.log('submit')
        onSubmit()
        notifySuccess('Submit success!')
      } catch (error) {
        handleError(error)
      }
    }

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
      exchange,
    }
  },
})

export default MetaMaskFormModal
export function showMetaMaskFormDialog(
  callbacks?: {
    onSubmit?: DialogHandler
    onClose?: DialogHandler
  },
  props?: any
): Promise<unknown | null> {
  return dialogs.show(MetaMaskFormModal, callbacks, { props })
}
</script>

<style lang="scss">
.metamask-form {
  margin-top: 3rem;
}
</style>

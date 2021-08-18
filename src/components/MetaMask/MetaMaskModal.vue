<template>
  <ModalBase class="exchange-form-modal" @close="onClose()">
    <template #title>
      <img src="~@/assets/brand/metamask-fox.svg" alt="metamask_logo" />
    </template>

    <template #main>
      <form
        class="app-form load-fog metamask-form"
        :class="{ 'load-fog_show': isLoading }"
      >
        <template v-if="!account || needAuth.value">
          <div class="app-form__field metamask-form__field--centered">
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
            <div class="app-form__field" v-if="converted_amount">
              <label class="app-form__field-lbl"> Converted amount </label>
              <input
                class="app-form__field-input app-form__field-input--disabled"
                type="text"
                :value="converted_amount"
                disabled
              />
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
import { defineComponent, ref, watch } from 'vue'
import { preventIf } from '@/helpers/functions'
import { dialogs, DialogPayloadHandler, DialogHandler } from '@/helpers/dialogs'
import { DecoratedFn } from '@/shared-types'
import { TransactionReceipt } from 'web3-core/types'
import { handleError } from '@/helpers/errors'
import { useForm, validators } from '@/composables/useForm'
import ModalBase from '@/components/modals/ModalBase.vue'
import { useWeb3 } from '@/composables/useWeb3/useWeb3'
import { bigFromPrecise, bigMath } from '@/helpers/bigMath'
import { wallet } from '@/api/wallet'
import { QueryRateResponse } from '@provider/codec/coinswap/query'
import { Coin } from '@provider/codec/cosmos/base/v1beta1/coin'

const MetaMaskFormModal = defineComponent({
  name: 'MetaMaskModal',
  components: { ModalBase },
  props: {
    maxWithdrawalPerTime: { type: Object, required: true },
    odinToLokiRate: { type: Object, required: true },
    burnFee: { required: true },
  },
  setup(props) {
    const needAuth = ref<boolean>(false)
    const account = ref<string | null>(null)
    const balance = ref<string | null>()
    const balanceDecimals = ref<string | null>()
    const balanceBigFromPrecise = ref<string | null>()
    const converted_amount = ref<string>('0')
    const actual_amount = ref<string>('0')

    const { web3, contracts } = useWeb3()

    const form = useForm({
      amount: [
        0,
        validators.required,
        validators.bigMathCompare(
          Number(props.burnFee),
          props.maxWithdrawalPerTime.amount,
          props.odinToLokiRate.rate
        ),
      ],
    })

    const changeAmount = async () => {
      const actual_temp = bigMath.subtract(
        Number(form.amount.val()),
        bigMath.multiply(
          bigMath.divide(Number(props.burnFee), 10000),
          Number(form.amount.val())
        )
      )

      actual_amount.value = bigMath.toStrStrict(
        bigMath.subtract(
          Number(form.amount.val()),
          bigMath.multiply(
            bigMath.divide(Number(props.burnFee), 10000),
            Number(form.amount.val())
          )
        )
      )

      converted_amount.value = bigMath.toStrStrict(
        bigMath.multiply(
          bigMath.toPrecise(actual_temp),
          bigMath._bn(props.odinToLokiRate.rate)
        )
      )
    }
    watch(() => Number(form.amount.val()), changeAmount)

    const isLoading = ref<boolean>(false)
    const onSubmit: DecoratedFn<DialogPayloadHandler> =
      dialogs.getHandler('onSubmit')
    const onClose: DecoratedFn<DialogPayloadHandler> = preventIf(
      dialogs.getHandler('onClose'),
      isLoading
    )

    const isNeedAuth = async () => {
      const accounts = await web3.eth.getAccounts()
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

    const sendApprove = async (
      amount: string
    ): Promise<TransactionReceipt | void> => {
      return new Promise((resolve, reject) => {
        contracts.odin.methods
          .approve(account.value as string, amount.toString())
          .send()
          .on('receipt', (_) => resolve(_))
          .on('error', (err) => reject(err))
      })
    }
    const sendDeposit = async (
      amount: string
    ): Promise<TransactionReceipt | void> => {
      return new Promise((resolve, reject) => {
        contracts.bridge.methods
          .deposit(
            wallet.account.address,
            contracts.odin.options.address,
            amount.toString()
          )
          .send()
          .on('receipt', (event) => resolve(event))
          .on('error', (err) => reject(err))
      })
    }
    const exchange = async (): Promise<void> => {
      isLoading.value = true
      try {
        await sendApprove(actual_amount.value)
        await sendDeposit(actual_amount.value)
      } catch (error) {
        handleError(error)
      } finally {
        isLoading.value = false
      }
    }

    const connectMetaMask = async (): Promise<void> => {
      await web3.eth.requestAccounts()
    }

    useWeb3({
      onAccountConnected: async (acc: string): Promise<void> => {
        account.value = acc
        if (account.value) {
          try {
            await getBalance()
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
          await isNeedAuth()
        } catch (error) {
          handleError(error)
        }
      },
      onProviderUndetected: async (): Promise<void> => {
        console.log('onProviderUndetected')
      },
    })


    return {
      form: form.flatten(),
      isLoading,
      onClose,
      connectMetaMask,
      account,
      balance,
      balanceBigFromPrecise,
      converted_amount,
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
  props?: {
    maxWithdrawalPerTime: Coin
    odinToLokiRate: QueryRateResponse
    burnFee: number | string | undefined | null
  }
): Promise<unknown | null> {
  return dialogs.show(MetaMaskFormModal, callbacks, { props })
}
</script>

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
          <template v-if="odinBalanceOnProvider">
            <div class="app-form__field">
              <label class="app-form__field-lbl"> You Balance (ODIN) </label>
              <input
                class="app-form__field-input app-form__field-input--disabled"
                type="text"
                v-model="odinBalanceOnProvider"
                disabled
              />
            </div>
            <div class="app-form__field" v-if="maxWithdrawalPerTime">
              <label class="app-form__field-lbl">
                Max deposit amount per time ({{
                  maxWithdrawalPerTime?.denom.toUpperCase()
                }})
              </label>
              <input
                class="app-form__field-input app-form__field-input--disabled"
                type="text"
                :value="maxWithdrawalPerTime.amount"
                disabled
              />
            </div>
            <div class="app-form__field">
              <label class="app-form__field-lbl"> Amount (ODIN) </label>
              <input
                class="app-form__field-input"
                type="number"
                v-model="form.amount"
              />
              <p v-if="form.amountErr" class="app-form__field-err">
                {{ form.amountErr }}
              </p>
            </div>
            <div class="app-form__field" v-if="expectedAmount">
              <label class="app-form__field-lbl">
                Expected amount (LOKI)
              </label>
              <input
                class="app-form__field-input app-form__field-input--disabled"
                type="text"
                :value="expectedAmount"
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
import { defineComponent, PropType, ref, watch } from 'vue'
import { memoize, preventIf } from '@/helpers/functions'
import { DialogHandler, DialogPayloadHandler, dialogs } from '@/helpers/dialogs'
import { DecoratedFn } from '@/shared-types'
import { TransactionReceipt } from 'web3-core/types'
import { handleError } from '@/helpers/errors'
import { useForm, validators } from '@/composables/useForm'
import ModalBase from '@/components/modals/ModalBase.vue'
import { useWeb3 } from '@/composables/useWeb3/useWeb3'
import { big, bigFromPrecise } from '@/helpers/bigMath'
import { wallet } from '@/api/wallet'
import { QueryRateResponse } from '@provider/codec/coinswap/query'
import { Coin } from '@provider/codec/cosmos/base/v1beta1/coin'
import { NumLike, NumLikeTypes } from '@/helpers/casts'
import BigNumber from 'bignumber.js'

const MetaMaskFormModal = defineComponent({
  name: 'MetaMaskModal',
  components: { ModalBase },
  props: {
    maxWithdrawalPerTime: { type: Object, required: true },
    odinToLokiRate: { type: Object, required: true },
    burnFee: { type: NumLikeTypes as PropType<NumLike>, required: true },
  },
  setup(props) {
    const needAuth = ref<boolean>(false)
    const account = ref<string | null>(null)
    const odinBalanceOnProvider = ref<string | null>()
    const expectedAmount = ref<string>('0')

    const { web3, contracts } = useWeb3()

    const _calcAmount = (value: string | null): BigNumber | null => {
      if (!value) return null
      const decimals = big.pow(10, 18)
      return big.multiply(value, decimals)
    }

    const _calcNet = memoize((value: string | null): BigNumber | null => {
      if (!value) return null

      const feeFactor = big.divide(props.burnFee, 10000, { decimals: 2 })
      const fee = big.multiply(value, feeFactor)
      return big.subtract(value, fee)
    })

    const _calcExpected = memoize((value: NumLike | null): BigNumber | null => {
      if (!value) return null
      return big.multiply(value, big.fromPrecise(props.odinToLokiRate.rate))
    })

    const form = useForm({
      amount: [
        '0',
        validators.required,
        validators.valueMapper(
          (v) => _calcExpected(_calcNet(v as string)),
          validators.bigMin(
            undefined,
            props.maxWithdrawalPerTime?.denom?.toUpperCase()
          ),
          validators.bigMax(
            props.maxWithdrawalPerTime.amount,
            props.maxWithdrawalPerTime?.denom?.toUpperCase()
          )
        ),
      ],
    })

    const _reCalcNetAndExpected = async () => {
      const amount = form.amount.val()
      const netAmountRaw = _calcNet(amount)
      const expectedRaw = _calcExpected(netAmountRaw)
      if (!amount || !netAmountRaw || !expectedRaw) {
        expectedAmount.value = '0'
        return
      }

      expectedAmount.value = big.toStrStrict(expectedRaw)
    }

    watch(() => form.amount.val(), _reCalcNetAndExpected)

    const isLoading = ref<boolean>(false)
    const onClose: DecoratedFn<DialogPayloadHandler> = preventIf(
      dialogs.getHandler('onClose'),
      isLoading
    )

    const isNeedAuth = async () => {
      const accounts = await web3.eth.getAccounts()
      needAuth.value = accounts.length <= 0
    }
    const getBalance = async (): Promise<void> => {
      const balance = await contracts.odin.methods
        .balanceOf(account.value as string)
        .call()
      const decimals = await contracts.odin.methods.decimals().call()

      const temp = bigFromPrecise(balance, decimals).toString()

      odinBalanceOnProvider.value = temp
      if (temp) isLoading.value = false
    }

    const sendApprove = async (
      amount: string | BigNumber
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
      amount: string | BigNumber
    ): Promise<TransactionReceipt | void> => {
      return new Promise((resolve, reject) => {
        console.log(amount)
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
        await sendApprove(_calcAmount(form.amount.val()) as BigNumber)
        await sendDeposit(_calcAmount(form.amount.val()) as BigNumber)
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
        odinBalanceOnProvider.value = null
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
      odinBalanceOnProvider,
      expectedAmount,
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

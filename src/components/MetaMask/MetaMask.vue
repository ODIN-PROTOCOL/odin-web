<template>
  <button
    :disabled="!burnFee"
    class="app-nav-btn app-nav-btn_white"
    type="submit"
    @click.prevent="connectMetaMask"
    v-if="errorAbiNet"
  >
    <img src="~@/assets/brand/metamask-fox.svg" alt="metamask_logo" />
  </button>
  <button
    v-else
    :disabled="!errorText"
    class="app-nav-btn app-nav-btn_white"
    type="submit"
    :title="errorText"
    @click.prevent="openErrorForm"
  >
    <img src="~@/assets/brand/metamask-fox.svg" alt="metamask_logo" />
  </button>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useWeb3 } from '@/composables/useWeb3/useWeb3'
import { callers } from '@/api/callers'
import { showMetaMaskErrorModal } from '@/components/MetaMask/handlers/metaMaskErrorModalHandler'
import { showMetaMaskModal } from './handlers/metaMaskModalHandler'

export default defineComponent({
  name: 'MetaMask',
  setup() {
    const maxWithdrawalPerTime = ref()
    const errorText = ref<string | null>()
    const odinToLokiRate = ref()
    const burnFee = ref<number | string | null>(null)
    const errorAbiNet = ref<boolean>(false)
    const connectMetaMask = (): void => {
      if (burnFee.value) {
        showMetaMaskModal(
          {},
          {
            maxWithdrawalPerTime: maxWithdrawalPerTime.value,
            odinToLokiRate: odinToLokiRate.value,
            burnFee: burnFee.value,
          }
        )
      }
    }
    const openErrorForm = (): void => {
      showMetaMaskErrorModal(
        {},
        {
          message: errorText.value,
        }
      )
    }
    const getOdinToLokiRate = async (): Promise<void> => {
      odinToLokiRate.value = await callers.getRate('odin', 'loki')
    }
    const getMaxWithdrawalPerTime = async (): Promise<void> => {
      const res = await callers.getParams()
      maxWithdrawalPerTime.value = res?.params?.maxWithdrawalPerTime[0]
    }
    const { contracts } = useWeb3()
    const getBurnFee = async (): Promise<void> => {
      burnFee.value = await contracts.odin.methods._getBurnFee().call()
    }
    useWeb3({
      onProviderDetected: async (): Promise<void> => {
        try {
          errorAbiNet.value = true
          await getBurnFee()
        } catch (error) {
          errorAbiNet.value = false
          errorText.value =
            'You need to switch your MetaMask to the BSC network. Recommended RPC: https://bsc-dataseed.binance.org'
        }
      },
    })
    onMounted(async (): Promise<void> => {
      await getMaxWithdrawalPerTime()
      await getOdinToLokiRate()
    })
    return { connectMetaMask, burnFee, errorText, errorAbiNet, openErrorForm }
  },
})
</script>

<style lang="scss" scoped></style>

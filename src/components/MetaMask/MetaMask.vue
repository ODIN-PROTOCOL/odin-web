<template>
  <button
    :disabled="!burnFee"
    class="metamask-btn"
    type="submit"
    @click.prevent="connectMetaMask"
  >
    <img src="~@/assets/brand/metamask-fox.svg" alt="metamask_logo" />
    <span>MetaMask</span>
  </button>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { showMetaMaskFormDialog } from './MetaMaskModal.vue'
import { useWeb3 } from '@/composables/useWeb3/useWeb3'
import { callers } from '@/api/callers'
import { handleError } from '@/helpers/errors'

export default defineComponent({
  name: 'MetaMask',
  setup() {
    const maxWithdrawalPerTime = ref()
    const odinToLokiRate = ref()
    const burnFee = ref<number | string | null>(null)

    const connectMetaMask = (): void => {
      if (burnFee.value) {
        showMetaMaskFormDialog(
          {},
          {
            maxWithdrawalPerTime: maxWithdrawalPerTime.value,
            odinToLokiRate: odinToLokiRate.value,
            burnFee: burnFee.value,
          }
        )
      }
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
          await getBurnFee()
        } catch (error) {
          handleError(error)
        }
      },
    })

    onMounted(async (): Promise<void> => {
      await getMaxWithdrawalPerTime()
      await getOdinToLokiRate()
    })

    return { connectMetaMask, burnFee }
  },
})
</script>

<style scoped></style>

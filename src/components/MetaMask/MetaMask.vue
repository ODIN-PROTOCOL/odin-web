<template>
  <button class="metamask-btn" type="submit" @click.prevent="connectMetaMask">
    <img src="~@/assets/brand/metamask-fox.svg" alt="metamask_logo" />
    <span>MetaMask</span>
  </button>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { showMetaMaskFormDialog } from './MetaMaskModal.vue'
import { callers } from '@/api/callers'

export default defineComponent({
  name: 'MetaMask',
  setup() {
    const maxWithdrawalPerTime = ref()
    const odinToLokiRate = ref()

    const connectMetaMask = (): void => {
      showMetaMaskFormDialog(
        {},
        {
          maxWithdrawalPerTime: maxWithdrawalPerTime.value,
          odinToLokiRate: odinToLokiRate.value,
        }
      )
    }

    const getOdinToLokiRate = async (): Promise<void> => {
      odinToLokiRate.value = await callers.getRate('odin', 'loki')
      console.log('odinToLokiRate', odinToLokiRate.value)
    }

    const getMaxWithdrawalPerTime = async (): Promise<void> => {
      const res = await callers.getParams()
      maxWithdrawalPerTime.value = res?.params?.maxWithdrawalPerTime[0]
    }

    onMounted(
      async (): Promise<void> => {
        await getMaxWithdrawalPerTime()
        await getOdinToLokiRate()
      }
    )

    return { connectMetaMask }
  },
})
</script>

<style scoped></style>

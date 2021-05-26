<template>
  <div class="user-widget fx-row fx-row_gap-8">
    <button class="user-widget__balance-btn" type="button" @click="exchange()">
      Balance: {{ $fCoin(lokiCoins) }}
    </button>

    <button class="app-btn" type="button" @click="logOutAndLeave()">
      Log Out
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import { useAuthorization } from '@/composables/useAuthorization'
import { useBalances } from '@/composables/useBalances'
import { usePoll } from '@/composables/usePoll'
import router from '@/router'
import { showExchangeFormDialog } from './modals/ExchangeFormModal.vue'

export default defineComponent({
  setup() {
    const auth = useAuthorization()
    const {
      coins: [lokiCoins],
      load: loadBalances,
    } = useBalances(['loki'])

    const logOutAndLeave = () => {
      auth.logOut()
      router.push({ name: 'Auth' })
    }

    const exchange = () => {
      showExchangeFormDialog()
    }

    const lokiPoll = usePoll(loadBalances, 5000)
    lokiPoll.start()
    onUnmounted(lokiPoll.stop)

    return { lokiCoins, logOutAndLeave, exchange }
  },
})
</script>

<style scoped>
.user-widget__balance-btn {
  display: block;
  border-radius: 10rem;
  border: 1px solid currentColor;
  white-space: nowrap;
  padding: 0.4rem 0.8rem;
}
</style>

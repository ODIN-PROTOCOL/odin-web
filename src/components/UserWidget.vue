<template>
  <div class="user-widget fx-row fx-row_gap-8">
    <button class="user-widget__balance-btn" type="button" @click="exchange()">
      Balance: {{ $formatCoin(lokiCoins) }}
    </button>

    <button class="app-btn" type="button" @click="logOutAndLeave()">
      Log Out
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAuthorization } from '@/composables/useAuthorization'
import { useBalances } from '@/composables/useBalances'
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
      showExchangeFormDialog({
        onSubmit: (d) => {
          d.kill()
          loadBalances()
        },
      })
    }

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

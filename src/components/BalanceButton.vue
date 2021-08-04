<template>
  <div class="balance-button">
    <button class="balance-button__balance-btn" type="button">
      Balance: <strong>{{ $fCoin(lokiCoins) }}</strong>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import { useBalances } from '@/composables/useBalances'
import { usePoll } from '@/composables/usePoll'

export default defineComponent({
  setup() {
    const {
      coins: [lokiCoins],
      load: loadBalances,
    } = useBalances(['loki'])

    const lokiPoll = usePoll(loadBalances, 5000)
    lokiPoll.start()
    onUnmounted(lokiPoll.stop)

    return { lokiCoins }
  },
})
</script>

<style lang="scss" scoped>
.balance-button {
  position: relative;
}

.balance-button__balance-btn {
  display: block;
  border-radius: 1.2rem;
  border: 1px solid var(--clr__action);
  white-space: nowrap;
  padding: 0.4rem 0.8rem;
}
</style>

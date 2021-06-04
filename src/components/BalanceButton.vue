<template>
  <div class="balance-button">
    <button
      class="balance-button__balance-btn"
      type="button"
      @click.stop="dropdown.show()"
    >
      Balance: <strong>{{ $fCoin(lokiCoins) }}</strong>
    </button>

    <div
      v-show="dropdown.isShown.value"
      class="balance-button__dropdown"
      ref="dropdownEl"
    >
      <p class="fs-c-muted fs-p14 mg-t8 mg-l24 mg-b8">Deposit from:</p>
      <button
        class="balance-button__dropdown-btn"
        type="button"
        @click="dropdown.hide() & exchange()"
      >
        Exchange
      </button>
      <button
        class="balance-button__dropdown-btn"
        type="button"
        @click="dropdown.hide() & faucet()"
      >
        Faucet
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, ref } from 'vue'
import { useBalances } from '@/composables/useBalances'
import { useDropdown } from '@/composables/useDropdown'
import { usePoll } from '@/composables/usePoll'
import { showExchangeFormDialog } from './modals/ExchangeFormModal.vue'
import { showFaucetFormDialog } from './modals/FaucetFormModal.vue'

export default defineComponent({
  setup() {
    const {
      coins: [lokiCoins],
      load: loadBalances,
    } = useBalances(['loki'])

    const exchange = () => {
      showExchangeFormDialog()
    }

    const faucet = () => {
      showFaucetFormDialog()
    }

    const lokiPoll = usePoll(loadBalances, 5000)
    lokiPoll.start()
    onUnmounted(lokiPoll.stop)

    const dropdownEl = ref<HTMLElement>()
    const dropdown = useDropdown(dropdownEl)

    return { lokiCoins, exchange, faucet, dropdown, dropdownEl }
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

.balance-button__dropdown {
  display: block;
  position: absolute;
  top: calc(100% + 1rem);
  left: 0;
  border-radius: 0.8rem;
  background: var(--clr__main-bg);
  padding: 0.8rem 0;
  z-index: 1;
  box-shadow: 0 0 1rem 1rem var(--clr__dropdown-shadow);
  min-width: 16rem;
}

.balance-button__dropdown-btn {
  display: block;
  width: 100%;
  padding: 0.8rem 2.4rem;
  text-align: start;

  &:hover {
    background-color: var(--clr__action-extra-muted);
  }
}
</style>

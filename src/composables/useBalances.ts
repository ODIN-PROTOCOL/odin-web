import { callers } from '@/api/callers'
import { Coin } from '@provider/codec/cosmos/base/v1beta1/coin'
import { computed, ComputedRef, Ref, ref } from 'vue'

const _balances: Ref<Coin[]> = ref([])

async function loadBalances(): Promise<void> {
  const balances = await callers.getBalances()
  console.debug('Balances:', balances)
  _balances.value = balances
}

async function clearBalances() {
  _balances.value = []
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useBalances(coinNames?: string[]) {
  let coins: Array<ComputedRef<Coin | undefined>> = []
  if (Array.isArray(coinNames) && coinNames.length) {
    coins = coinNames.map((n) =>
      computed(() => _balances.value.find((el) => el.denom === n))
    )
  }

  return {
    coins,
    load: loadBalances,
    clear: clearBalances,
  }
}

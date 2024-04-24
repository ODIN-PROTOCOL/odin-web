import { callers } from '@/api/callers'
import { COINS_LIST } from '@/api/api-config'
import { big } from '@/helpers/bigMath'
import { TallyResult } from '@provider/codec/cosmos/gov/v1beta1/gov'
import { computed, ComputedRef, onUnmounted, Ref, ref } from 'vue'

// TODO: use usePoll

const _powerConst = ref<string | null>(null)
let _subsCount = 0
let _updateInterval = -1

const _loadPowerConst = async () => {
  const [supply, { data }] = await Promise.all([
    callers.getTotalSupply(),
    callers.getTreasuryPool(),
  ])

  const lokiSupply = supply.supply
    .filter(el => el.denom === COINS_LIST.LOKI)
    .reduce((acc, cur) => big.add(acc, cur.amount), big.zero)
  const treasuryPool = data.treasuryPool[0] || []
  const lokiPool = treasuryPool.coins.find(
    el => el.denom === COINS_LIST.LOKI,
  )?.amount

  if (!lokiSupply || !lokiPool) {
    _powerConst.value = null
  } else {
    _powerConst.value = big.subtract(lokiSupply, lokiPool).toString()
  }
}

const _runUpdater = () => {
  _subsCount += 1
  if (_updateInterval === -1) {
    _updateInterval = window.setInterval(() => _loadPowerConst(), 10000)
    _loadPowerConst()
  }
}

const _stopUpdater = () => {
  _subsCount -= 1
  if (_subsCount <= 0) {
    clearInterval(_updateInterval)
    _updateInterval = -1
  }
}

export function useVoteProgress(
  tally: Ref<TallyResult>,
  field: keyof TallyResult,
): ComputedRef<string> {
  const percentage = computed(() => {
    if (_powerConst.value === null) return 'N/A'

    const vp = tally.value[field]
    const divided = big.divide(vp, _powerConst.value, { decimals: 2 })
    const percents = big.multiply(divided, 100)
    return `${big.format(percents)}%` // TODO: translate
  })

  _runUpdater()
  onUnmounted(() => _stopUpdater())

  return percentage
}

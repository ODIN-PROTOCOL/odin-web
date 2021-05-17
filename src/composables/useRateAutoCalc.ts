import { callers } from '@/api/callers'
import { onUnmounted, ref, Ref, unref, watch } from 'vue'
import debounce from 'lodash-es/debounce'
import { formatCoin } from '@/helpers/formatters'
import { bigMath } from '@/helpers/bigMath'

// TODO: translate

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useRateAutoCalc(
  from: Ref<string> | string,
  fromAmount: Ref<string | number> | string | number,
  to: Ref<string> | string
) {
  const result = ref<string>('')

  const _reload = () => {
    if (!unref(from) || !unref(to) || !fromAmount) {
      _fallback()
    } else {
      result.value = 'Loading…'
      _loadRateDebounced()
    }
  }

  const _fallback = () => {
    result.value = formatCoin('0', unref(to))
  }

  const _loadRateDebounced = debounce(async () => {
    const src = unref(from)
    const srcAmount = unref(fromAmount)
    const dst = unref(to)
    if (!src || !dst || !srcAmount) {
      return _fallback()
    }

    const response = await callers.getRate(src, dst)
    if (!response || !response.rate) {
      return _fallback()
    }

    const factor = bigMath.divide(response.rate, '1000000000000000000')
    const approx = bigMath.multiply(unref(srcAmount), factor)
    result.value = formatCoin(approx, dst)
  }, 1000)

  const unwatch = watch([from, fromAmount, to], _reload, { immediate: true })
  onUnmounted(unwatch)

  return result
}

import { callers } from '@/api/callers'
import { isRef, onUnmounted, ref, Ref, unref, watch } from 'vue'
import debounce from 'lodash-es/debounce'
import { formatCoin } from '@/helpers/formatters'
import { bigMath } from '@/helpers/bigMath'
import { NumLike } from '@/helpers/casts'

// TODO: translate

function _calcFactor(rate: string): NumLike {
  return bigMath.multiply(rate, '0.00000000000000000001')
}

function _calcToAmount(
  fromAmount: NumLike,
  factor: NumLike,
  toDenom: string
): string {
  const approx = bigMath.multiply(fromAmount, factor)
  return formatCoin(approx, toDenom)
}

function _getPair(from: Ref<string> | string, to: Ref<string> | string) {
  const src = unref(from)
  const dst = unref(to)
  return { src, dst, pair: `${src}-${dst}` }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useRateAutoCalc(
  from: Ref<string> | string,
  fromAmount: Ref<NumLike> | NumLike,
  to: Ref<string> | string
) {
  const result = ref<string>('')
  let _prevPair: NumLike = ''
  let _prevFactor: NumLike = ''

  const _reCalc = () => {
    const { src, dst, pair } = _getPair(from, to)
    if (!src || !dst || !unref(fromAmount)) {
      _fallback()
    } else if (_prevPair === pair) {
      result.value = _calcToAmount(unref(fromAmount), _prevFactor, dst)
    } else {
      result.value = 'Loading…'
      _loadAndCalcDebounced()
    }
  }

  const _fallback = () => {
    result.value = formatCoin('0', unref(to))
  }

  const _loadAndCalcDebounced = debounce(async () => {
    const { src, dst, pair } = _getPair(from, to)
    const srcAmount = unref(fromAmount)
    if (!src || !dst || !srcAmount) {
      return _fallback()
    }

    const response = await callers.getRate(src, dst)
    if (!response || !response.rate) {
      return _fallback()
    }

    _prevPair = pair
    _prevFactor = _calcFactor(response.rate)
    result.value = _calcToAmount(srcAmount, _prevFactor, dst)
    console.debug(`Rate ${src}-${dst}:`, response.rate, _prevFactor.toString())
  }, 1000)

  _reCalc()
  const unwatch = watch([from, fromAmount, to].filter(isRef), _reCalc)
  onUnmounted(unwatch)

  return result
}

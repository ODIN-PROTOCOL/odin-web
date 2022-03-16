import { BigNumber } from 'bignumber.js'
import { big } from './bigMath'

type ConverterOptions = {
  withDenom?: boolean
  withPrecise?: boolean
}

const FORMAT_OPTIONS = {
  decimals: 2,
  decimalSeparator: '.',
}
const ODIN_MULTIPLIER = 0.000001
const ODIN_DENOM = 'ODIN'
const LOKI_MULTIPLIER = 1000000

export function convertLokiToOdin(
  amount: string | undefined,
  options?: ConverterOptions
): string | BigNumber {
  if (!amount) return '- ' + ODIN_DENOM

  let res = null
  if (options && options.withPrecise) {
    res = big.fromPrecise(big.multiply(amount, ODIN_MULTIPLIER))
  } else {
    res = big.multiply(amount, ODIN_MULTIPLIER)
  }

  if (options && options.withDenom) {
    return big.format(res, FORMAT_OPTIONS) + ' ' + ODIN_DENOM
  } else {
    return res
  }
}

export function convertOdinToLoki(amount: string): number {
  const num = Number(amount)
  if (isNaN(num)) throw ReferenceError('Invalid number')

  return big.multiply(num, LOKI_MULTIPLIER).toNumber()
}

import { BigNumber } from 'bignumber.js'
import { big } from './bigMath'

type ConverterOptions = {
  withDenom?: boolean
  withPrecise?: boolean
  onlyNumber?: boolean
}

const FORMAT_OPTIONS = {
  decimals: 2,
  decimalSeparator: '.',
}
const ODIN_MULTIPLIER = 0.000001
const ODIN_DENOM = 'ODIN'
const LOKI_DENOM = 'LOKI'
const GEO_DENOM = 'GEO'
const MINIGEO_DENOM = 'MINIGEO'
const LOKI_MULTIPLIER = 1000000

export function convertLokiToOdin(

  amount: string | BigNumber | undefined,
  options?: ConverterOptions,
  denom = ODIN_DENOM
): string | BigNumber {
  if (!amount) return '-'
  if (Number.isNaN(Number(amount))) return '0'
  if (denom.toUpperCase() === LOKI_DENOM || denom === ODIN_DENOM) {
    denom = ODIN_DENOM
  } else {
    denom = GEO_DENOM
  }

  let res: BigNumber
  if (options && options.withPrecise) {
    res = big.fromPrecise(big.multiply(amount, ODIN_MULTIPLIER))
  } else {
    res = big.multiply(amount, ODIN_MULTIPLIER)
  }

  if (options && options.withDenom) {
    return big.format(res, FORMAT_OPTIONS) + ' ' + denom
  } else if (options && options.onlyNumber) {
    return res
  } else {
    return res + ' ' + denom
  }
}

export function convertOdinToLoki(amount: string): number {
  const num = Number(amount)
  if (isNaN(num)) throw ReferenceError('Invalid number')

  return big.multiply(num, LOKI_MULTIPLIER).toNumber()
}

export function getDenom(denom: string): string {
  if (denom.toUpperCase() === ODIN_DENOM) {
    return LOKI_DENOM.toLowerCase()
  } else {
    return MINIGEO_DENOM.toLowerCase()
  }
}

export function setDenom(denom: string): string {
  if (denom.toUpperCase() === LOKI_DENOM) {
    return ODIN_DENOM.toLowerCase()
  } else {
    return GEO_DENOM.toLowerCase()
  }
}
export function getLokiFromString(value: string | undefined): string {
  if (!value) {
    return ''
  }
  return value.split('loki')[0]
}

export function getDenom(denom: string): string {
  if (denom.toUpperCase() === ODIN_DENOM) {
    return LOKI_DENOM.toLowerCase()
  } else {
    return MINIGEO_DENOM.toLowerCase()
  }
}

export function setDenom(denom: string): string {
  if (denom.toUpperCase() === LOKI_DENOM) {
    return ODIN_DENOM.toLowerCase()
  } else {
    return GEO_DENOM.toLowerCase()
  }
}

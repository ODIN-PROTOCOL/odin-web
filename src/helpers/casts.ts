import BigNumber from 'bignumber.js'
import Long from 'long'
import { BigCfg } from '@/helpers/bigMath'

export type NumLike = string | number | Long | BigNumber
export const NumLikeTypes = [String, Number, Long, BigNumber]

export function toBigNumber(value: NumLike, config?: BigCfg): BigNumber {
  let ctor = BigNumber
  if (config) {
    ctor = ctor.clone()
    ctor.config({
      ...('decimals' in config ? { DECIMAL_PLACES: config.decimals } : {}),
      ...('rounding' in config ? { ROUNDING_MODE: config.rounding } : {}),
    })
  }

  if (Long.isLong(value)) {
    return new ctor(value.toString())
  }

  if (BigNumber.isBigNumber(value)) {
    return value
  }

  return new ctor(value)
}

export function toLong(value: NumLike): Long {
  if (Long.isLong(value)) {
    return value
  }

  if (BigNumber.isBigNumber(value)) {
    return Long.fromString(BigNumber.toString())
  }

  return Long.fromValue(value)
}

export function toStr(
  value: NumLike | undefined | null,
  fallback = ''
): string {
  if (!value) return fallback

  if (Long.isLong(value) || BigNumber.isBigNumber(value)) {
    return value.toString()
  }

  return String(value)
}

export function toNum(value: NumLike): number {
  if (Long.isLong(value) || BigNumber.isBigNumber(value)) {
    return value.toNumber()
  }

  return Number(value)
}

export function uint8ArrayToStr(arr?: Uint8Array): string {
  return new TextDecoder().decode(arr)
}

export function strToUnit8Array(str?: string): Uint8Array {
  return new TextEncoder().encode(str)
}

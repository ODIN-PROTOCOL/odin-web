import BigNumber from 'bignumber.js'
import Long from 'long'

export type NumLike = string | number | Long | BigNumber
export const NumLikeTypes = [String, Number, Long, BigNumber]

export function toBigNumber(value: NumLike): BigNumber {
  if (Long.isLong(value)) {
    return new BigNumber(value.toString())
  }

  if (BigNumber.isBigNumber(value)) {
    return value
  }

  return new BigNumber(value)
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

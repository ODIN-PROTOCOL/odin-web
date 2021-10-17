import BigNumber from 'bignumber.js'
import { NumLike, toBigNumber } from './casts'

export enum ROUNDING {
  DEFAULT = 4,
  UP = 0,
  DOWN = 1,
  CEIL = 2,
  FLOOR = 3,
  HALF_UP = 4,
  HALF_DOWN = 5,
  HALF_EVEN = 6,
  HALF_CEIL = 7,
  HALF_FLOOR = 8,
}

export enum COMPARE_RESULT {
  bigger = 1,
  lower = -1,
  equal = 0,
}

export interface BigCfg {
  decimals?: number
  rounding?: ROUNDING
}

export type BigFormatCfg = BigNumber.Format & BigCfg

BigNumber.config({
  DECIMAL_PLACES: 0,
  ROUNDING_MODE: ROUNDING.DEFAULT,
  FORMAT: {
    // TODO: translate
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
  },
})

const _bn = toBigNumber

function bigMultiply(a: NumLike, b: NumLike, cfg?: BigCfg): BigNumber {
  return _bn(a, cfg).multipliedBy(_bn(b))
}

function bigDivide(a: NumLike, b: NumLike, cfg?: BigCfg): BigNumber {
  return _bn(a, cfg).dividedBy(_bn(b))
}

function bigAdd(a: NumLike, b: NumLike, cfg?: BigCfg): BigNumber {
  return _bn(a, cfg).plus(_bn(b))
}

function bigSubtract(a: NumLike, b: NumLike, cfg?: BigCfg): BigNumber {
  return _bn(a, cfg).minus(_bn(b))
}

function bigRound(a: NumLike, precision: number, mode?: ROUNDING): string {
  return _bn(a).toPrecision(precision, mode)
}

function bigFormat(a: NumLike, format?: BigFormatCfg): string {
  try {
    const {
      decimals = BigNumber.config({}).DECIMAL_PLACES as number,
      rounding = BigNumber.config({}).ROUNDING_MODE as ROUNDING,
      ...fmt
    } = format || {}
    Object.assign(fmt, BigNumber.config({}).FORMAT)
    return _bn(a).toFormat(decimals, rounding, fmt)
  } catch (error) {
    console.error(error)
    return '—'
  }
}

function bigPower(a: NumLike, b: NumLike, cfg?: BigCfg): BigNumber {
  return _bn(a, cfg).pow(_bn(b))
}

function bigCompare(a: NumLike, b: NumLike): COMPARE_RESULT | null {
  return _bn(a).comparedTo(_bn(b))
}

const TO_FRACTION_PRECISION = bigPower(10, 18)
export function bigToPrecise(num: NumLike, decimals?: NumLike): BigNumber {
  const factor = decimals ? bigPower(10, decimals) : TO_FRACTION_PRECISION
  return bigMultiply(num, factor)
}

const FROM_FRACTION_PRECISION = bigPower(0.1, 18)
export function bigFromPrecise(num: NumLike, decimals?: NumLike): BigNumber {
  const factor = decimals ? bigPower(0.1, decimals) : FROM_FRACTION_PRECISION
  return bigMultiply(num, factor)
}

export function bigToStrStrict(num: NumLike): string {
  return _bn(num).toFormat({
    groupSeparator: '',
    decimalSeparator: '.',
    fractionGroupSeparator: '',
  })
}

export const bigMath = {
  multiply: bigMultiply,
  divide: bigDivide,
  add: bigAdd,
  subtract: bigSubtract,
  round: bigRound,
  format: bigFormat,
  toPrecise: bigToPrecise,
  compare: bigCompare,
  fromPrecise: bigFromPrecise,
  pow: bigPower,
  toStrStrict: bigToStrStrict,
  zero: _bn(0),
  _bn,
}

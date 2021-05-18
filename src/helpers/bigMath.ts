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

type BigFormatCfg = BigNumber.Format & {
  decimals?: number
  rounding?: ROUNDING
}

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

function bigMultiply(a: NumLike, b: NumLike): BigNumber {
  return _bn(a).multipliedBy(_bn(b))
}

function bigDivide(a: NumLike, b: NumLike): BigNumber {
  return _bn(a).dividedBy(_bn(b))
}

function bigRound(a: NumLike, precision: number, mode?: ROUNDING): string {
  return _bn(a).toPrecision(precision, mode)
}

function bigFormat(a: NumLike, format?: BigFormatCfg): string {
  const {
    decimals = BigNumber.config({}).DECIMAL_PLACES as number,
    rounding = BigNumber.config({}).ROUNDING_MODE as ROUNDING,
    ...fmt
  } = format || {}
  Object.assign(fmt, BigNumber.config({}).FORMAT)
  const res = _bn(a).toFormat(decimals, rounding, fmt)
  return res
}

const _bn = toBigNumber

export const bigMath = {
  multiply: bigMultiply,
  divide: bigDivide,
  round: bigRound,
  format: bigFormat,
}

import BigNumber from 'bignumber.js'
import { NumLike, toBigNumber } from './casts'

BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_HALF_UP })

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

function bigMultiply(a: NumLike, b: NumLike): BigNumber {
  return _bn(a).multipliedBy(_bn(b))
}

function bigDivide(a: NumLike, b: NumLike): BigNumber {
  return _bn(a).dividedBy(_bn(b))
}

function bigRound(a: NumLike, precision: number, mode?: ROUNDING): string {
  return _bn(a).toPrecision(precision, mode)
}

const _bn = toBigNumber

export const bigMath = {
  multiply: bigMultiply,
  divide: bigDivide,
  round: bigRound,
}

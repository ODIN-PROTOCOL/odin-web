import { Coin } from '@provider/codec/cosmos/base/v1beta1/coin'
import { bigMath } from './bigMath'
import { NumLike, toNum, toStr } from './casts'
import {
  isToday,
  isTomorrow,
  isYesterday,
  isThisMonth,
  isThisYear,
} from './dates'
import { format as _formatDate } from 'date-fns'

const NBSP = '\u00A0'

// TODO: translate

export function cropAddress(value: string): string {
  return `${value.slice(0, 4)}…${value.slice(-4)}`
}

export function abbreviateNumber(value: NumLike): string {
  value = toNum(value)

  let res = String(value)
  if (value >= 1000) {
    const suffixes = ['', 'k', 'm', 'b', 't', 'q', 'Q', 's']
    const suffixNum = Math.floor(('' + value).length / 3)
    let shortValue = ''
    for (let precision = 2; precision >= 1; precision--) {
      shortValue = String(
        parseFloat(
          (suffixNum != 0
            ? value / Math.pow(1000, suffixNum)
            : value
          ).toPrecision(precision)
        )
      )
      const dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '')
      if (dotLessShortValue.length <= 2) {
        break
      }
    }
    if (Number(shortValue) % 1 !== 0) {
      shortValue = Number(shortValue).toFixed(1)
    }
    res = `${shortValue}${suffixes[suffixNum]}`
  }
  return res
}

export function formatCoin(coin: Coin): string
export function formatCoin(value: NumLike, denom: string): string
export function formatCoin(input: NumLike | Coin, denom?: string): string {
  let value: string | number
  if (input && typeof input === 'object' && 'amount' in input) {
    value = input.amount
    denom = input.denom
  } else {
    value = toStr(input)
  }
  denom = denom || ''
  return `${bigMath.format(value)}${NBSP}${denom.toUpperCase()}`
}

export interface DateFormatObject {
  default: string
  thisDay?: string
  thisMonth?: string
  thisYear?: string
}

export function formatDate(
  input: Date | number,
  format: string | DateFormatObject
): string {
  format = _chooseFormat(input, format)
  format = _tryInsertToday(input, format)
  return _formatDate(input, format)
}

function _chooseFormat(
  input: Date | number,
  format: string | DateFormatObject
): string {
  if (typeof format === 'object') {
    if (format.thisDay && isToday(input)) {
      return format.thisDay
    } else if (format.thisMonth && isThisMonth(input)) {
      return format.thisMonth
    } else if (format.thisYear && isThisYear(input)) {
      return format.thisYear
    } else {
      return format.default
    }
  } else {
    return format
  }
}

function _tryInsertToday(input: Date | number, format: string): string {
  let relDay: string
  if (isToday(input)) relDay = "'Today'"
  else if (isYesterday(input)) relDay = "'Yesterday'"
  else if (isTomorrow(input)) relDay = "'Tomorrow'"
  else return format

  // TODO: currently matches only en format
  const dayTokenRe = /M{1,}\s?d[od]?,/
  return format.replace(dayTokenRe, relDay)
}

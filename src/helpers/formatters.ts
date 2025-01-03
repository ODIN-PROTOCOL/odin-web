import { Coin } from '@provider/codec/cosmos/base/v1beta1/coin'
import { big as bigMath } from './bigMath'
import { NumLike, toNum } from './casts'
import {
  isToday,
  isTomorrow,
  isYesterday,
  isThisMonth,
  isThisYear,
} from './dates'
import {
  format as _formatDate,
  differenceInHours,
  differenceInDays,
  differenceInMinutes,
  differenceInSeconds,
} from 'date-fns'
import Long from 'long'
import { Moment } from 'moment'
import * as moment from 'moment'

const NBSP = '\u00A0'

// TODO: translate

export function cropAddress(value?: string): string {
  if (!value) return ''
  return `${value.slice(0, 4)}…${value.slice(-4)}`
}

export function abbreviateNumber(value: NumLike): string {
  const suffixes = ['', 'k', 'm', 'b', 't', 'q', 'Q', 's', 'S', 'o', 'n', 'd']

  let newValue = toNum(value)
  let suffixNum = 0
  while (newValue >= 1000) {
    newValue /= 1000
    suffixNum++
  }

  return newValue.toPrecision(3) + suffixes[suffixNum]
}

export function preciseAsPercents(amount: string): string {
  const percents = bigMath
    .format(bigMath.fromPrecise(amount), { decimals: 2 })
    .replace(/.00$/, '')
  return `${percents}%` // TODO: translate
}

export function preciseAsFormatedCoin(coin: Coin): string {
  const amount = bigMath.format(bigMath.fromPrecise(coin.amount))
  return `${amount} ${coin.denom.toUpperCase()}`
}

export function formatCoin(coin: Coin, abbr?: boolean): string
export function formatCoin(
  amount: NumLike,
  denom: string,
  abbr?: boolean,
): string
export function formatCoin(
  in1: NumLike | Coin,
  in2?: string | boolean,
  abbr?: boolean,
): string {
  let amount: NumLike, denom: string
  if (in1 && typeof in1 === 'object' && 'amount' in in1) {
    amount = in1.amount
    denom = in1.denom
    abbr = in2 as boolean
  } else {
    amount = in1
    denom = in2 as string
  }
  const fmt = abbr ? abbreviateNumber(amount) : bigMath.format(amount)
  return `${fmt}${NBSP}${(denom || '').toUpperCase()}`
}

export interface DateFormatObject {
  default: string
  thisDay?: string
  thisMonth?: string
  thisYear?: string
}

export function formatDate(
  input: Long.Long | Date | number,
  format: string | DateFormatObject = {
    default: 'MMM d, yyyy, HH:mm',
    thisYear: 'HH:mm dd.MM.yy',
  },
): string {
  try {
    if (Long.isLong(input)) input = input.toNumber() * 1000
    format = _chooseFormat(input, format)
    format = _tryInsertToday(input, format)
    return _formatDate(input, format)
  } catch (error) {
    console.error(error)
    return '—'
  }
}

function _chooseFormat(
  input: Date | number,
  format: string | DateFormatObject,
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

export function formatDateDifference(
  dateLeft: Long.Long | Date | number,
): string {
  try {
    if (Long.isLong(dateLeft)) dateLeft = dateLeft.toNumber() * 1000
    return _getDateDifference(dateLeft)
  } catch (err) {
    console.error(err)
    return '—'
  }
}

function _getDateDifference(dateLeft: Date | number): string {
  const nowUTC = moment.utc()
  // const hourRange = Math.abs(differenceInHours(dateLeft, new Date()))
  const hourRange = moment.duration(nowUTC.diff(dateLeft)).asHours()
  if (hourRange <= 1) {
    return `${hourRange} hour ago`
  } else if (hourRange < 48) {
    return `${hourRange} hours ago`
  } else {
    const dayRange = Math.abs(differenceInDays(dateLeft, new Date()))
    return `${dayRange} days ago`
  }
}

export function preciseFormatOdinCoin(amount: string): string {
  const res = bigMath.format(
    bigMath.divide(bigMath.fromPrecise(amount), 1000000),
  )
  return `${res} ODIN`
}

export function getPrecisePercents(amount: string): string {
  const percents = bigMath.fromPrecise(bigMath.multiply(amount, 100))
  return `${percents}%`
}

export function preciseFormatCoin(amount: string, denom: string): string {
  const res = bigMath.format(bigMath.fromPrecise(amount))
  return `${res} ${denom.toUpperCase()}`
}

export function getPercentOutOfNumber(
  number: string,
  ofNumber: string,
): string {
  const percent = bigMath.fromPrecise(
    bigMath.multiply(bigMath.divide(number, ofNumber), 100),
  )
  return `${percent}%`
}
export function capitalizeFirstLetter(value: string): string {
  if (!value) return value
  return value[0].toUpperCase() + value.slice(1)
}

export function trimLeadingZeros(
  data: string | number,
  fractionDigits = 6,
): number {
  if (typeof data === 'string') {
    return Number(Number(data).toFixed(fractionDigits))
  } else {
    return Number(data.toFixed(fractionDigits))
  }
}

export function diffDays(dateLeft: Date, dateRight: Date): string {
  if (differenceInDays(dateLeft, dateRight) >= 1)
    return `${differenceInDays(dateLeft, dateRight)} days ago`

  if (differenceInHours(dateLeft, dateRight) >= 1)
    return `${differenceInHours(dateLeft, dateRight)} hours ago`

  if (differenceInMinutes(dateLeft, dateRight) >= 1)
    return `${differenceInMinutes(dateLeft, dateRight)} minutes ago`

  return `${differenceInSeconds(dateLeft, dateRight)} secs ago`
}

export function diffMoment(dateLeft: Moment, dateRight: Moment): string {
  const diff = moment.duration(dateRight.diff(dateLeft))
  if (diff.asDays() >= 1) return `${diff.asDays()} days ago`
  if (diff.asHours() >= 1) return `${diff.asHours()} hours ago`
  if (diff.asMinutes() >= 1) return `${diff.asMinutes()} minutes ago`
  if (diff.asSeconds() >= 1) return `${diff.asSeconds()} seconds ago`
  return 'just now'
}

export function cropText(value?: string): string {
  if (!value) return ''
  if (value.length > 11) return `${value.slice(0, 11)}…`
  return value
}

export function getDay(time: string | number): Date {
  return new Date(time)
}

export function formatTxString(input: string, substract = 6) {
  if (input.length < substract * 2 + 1) {
    return input
  }
  const preString = input.substring(0, substract)
  const postString = input.substring(input.length - substract)

  return preString + '...' + postString
}

export function priceFormatter(
  price: number,
  options?: Intl.NumberFormatOptions,
) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
    ...options,
  })

  return formatter.format(price)
}

export function convertToDecimal(number: number, decimal: number, precise = 2) {
  const numberString = number.toString()
  const resultString =
    numberString.substring(0, decimal) +
    '.' +
    numberString.substring(decimal, decimal + precise)

  return parseFloat(resultString)
}

export function numberFormatter(
  number: number,
  options?: Intl.NumberFormatOptions,
) {
  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  })
  return formatter.format(number)
}

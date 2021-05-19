import { Coin } from '@provider/codec/cosmos/base/v1beta1/coin'
import { bigMath } from './bigMath'
import { NumLike, toNum, toStr } from './casts'

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

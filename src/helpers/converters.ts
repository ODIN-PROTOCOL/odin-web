import { bigMath } from './bigMath'

type ConverterOptions = {
  withDenom?: boolean
  withPrecise?: boolean
}

const FORMAT_OPTIONS = {
  decimals: 6,
  decimalSeparator: '.',
}

const ROUND_RE = /(0+|\.0+)$/
const MULTIPLIER = 0.000001
const ODIN_DENOM = 'ODIN'

export function convertLokiToOdin(
  amount: string | undefined,
  options?: ConverterOptions
): string {
  if (!amount) return '- ' + ODIN_DENOM

  let res = null
  if (options && options.withPrecise) {
    res = _multiplyWithPrecise(amount)
  } else {
    res = _multiplyWithoutPrecise(amount)
  }

  return options && options.withDenom ? res + ' ' + ODIN_DENOM : res
}

const _multiplyWithPrecise = (v: string): string => {
  return bigMath
    .format(
      bigMath.fromPrecise(bigMath.multiply(v, MULTIPLIER)),
      FORMAT_OPTIONS
    )
    .replace(ROUND_RE, '')
}

const _multiplyWithoutPrecise = (v: string): string => {
  return bigMath
    .format(bigMath.multiply(v, MULTIPLIER), FORMAT_OPTIONS)
    .replace(ROUND_RE, '')
}

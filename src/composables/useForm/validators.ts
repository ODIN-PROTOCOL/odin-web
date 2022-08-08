/* eslint-disable no-useless-escape */
import { big } from '@/helpers/bigMath'
import { NumLike } from '@/helpers/casts'
import { Ref, unref } from 'vue'

export type FormFieldValidator = (...args: unknown[]) => string | null
export type FormFieldValidatorResult = ReturnType<FormFieldValidator>

// TODO: translate validation errors

export const required: FormFieldValidator = (val: unknown) => {
  if (!val && val !== 0) return 'The field is required'
  return null
}

export const withOutSpaceAtStart: FormFieldValidator = (val: unknown) => {
  if (typeof val === 'string' && val.trim().length === 0) {
    return 'The field must contain any characters, including alphanumeric values (A-Z, a-z, 0-9), special characters and spaces (not in first character).'
  }
  return null
}

const NUMBER_RE = /^[+-]?\d*\.?\d+(?:[Ee][+-]?\d+)?$/
export const number: FormFieldValidator = (val: unknown) => {
  if (
    (typeof val === 'string' && !NUMBER_RE.test(val)) ||
    (typeof val === 'number' && Number.isNaN(val))
  ) {
    return 'The value should represent a number'
  }
  return null
}

const SIX_DECIMAL_RE = /^(?=.*\d)\d*(?:\.\d{1,6})?$/
export const sixDecimalNumber: FormFieldValidator = (val: unknown) => {
  if (typeof val === 'string' && !SIX_DECIMAL_RE.test(val)) {
    return 'The number must have a maximum of six decimal places'
  }
  return null
}

const INTEGER_RE = /^[0-9]+$/
export const integer: FormFieldValidator = (val: unknown) => {
  if (typeof val === 'string' && !INTEGER_RE.test(val)) {
    return 'The value should be integer'
  }
  return null
}

export function num(minimum?: number, maximum?: number): FormFieldValidator[] {
  const validators: FormFieldValidator[] = [number]

  const gotMin = minimum || minimum === 0
  const gotMax = maximum || maximum === 0
  if (gotMin && gotMax) {
    validators.push(range(minimum as number, maximum as number))
  } else if (gotMin) {
    validators.push(min(minimum as number))
  } else if (gotMax) {
    validators.push(max(maximum as number))
  }
  return validators
}

export function min(minimum: Ref<number> | number): FormFieldValidator {
  return (val: unknown): FormFieldValidatorResult => {
    minimum = Number(unref(minimum))
    const num = Number(val)
    if (!Number.isNaN(num) && num < minimum) {
      return `The value should be larger than ${minimum}`
    }
    return null
  }
}
export function max(maximum: Ref<number> | number): FormFieldValidator {
  return (val: unknown): FormFieldValidatorResult => {
    const num = Number(val)
    maximum = Number(unref(maximum))
    if (!Number.isNaN(num) && num > maximum) {
      return `The value should be lower than ${maximum}`
    }
    return null
  }
}
export function maxReactive(maximum: Ref<number>): FormFieldValidator {
  return (val: unknown): FormFieldValidatorResult => {
    const num = Number(val)
    // maximum = Number(unref(maximum))
    if (!Number.isNaN(num) && num > maximum.value) {
      return `The value should be lower than ${maximum.value}`
    }
    return null
  }
}
export function maxCharacters(maximum: number): FormFieldValidator {
  return (val: unknown): FormFieldValidatorResult => {
    if (String(val).length > maximum) {
      return `The value should be lower than ${maximum} characters`
    }
    return null
  }
}
export function minCharacters(minimum: number): FormFieldValidator {
  return (val: unknown): FormFieldValidatorResult => {
    if (String(val).length < minimum) {
      return `The value should be more than ${minimum} characters`
    }
    return null
  }
}

export function range(minimum: number, maximum: number): FormFieldValidator {
  const _min = min(minimum)
  const _max = max(maximum)
  return (val: unknown): FormFieldValidatorResult => {
    return _min(val) || _max(val)
  }
}

export function minItems(minNum: number): FormFieldValidator {
  return (val: unknown): FormFieldValidatorResult => {
    if (
      (val instanceof Set && val.size < minNum) ||
      (Array.isArray(val) && val.length < minNum)
    ) {
      return `Select at least ${minNum} item(s)`
    }
    return null
  }
}

export function oneOf(subset: unknown[]): FormFieldValidator {
  return (val: unknown): FormFieldValidatorResult => {
    if ((val || val === 0) && !subset.includes(val)) {
      return `Value is out of allowed subset: ${subset}`
    }
    return null
  }
}

// TODO: real validator
export const erc20Address: FormFieldValidator = (val: unknown) => {
  if (val && typeof val === 'string' && val.length < 8) {
    return 'Invalid address'
  }
  return null
}
const CHECK_URL =
  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/

export const validateUrl: FormFieldValidator = (val: unknown) => {
  if (typeof val === 'string' && !CHECK_URL.test(val)) {
    return 'Invalid URL'
  }
  return null
}

export function bigMax(maximum: NumLike, suffix?: string): FormFieldValidator {
  return (val: unknown): FormFieldValidatorResult => {
    const res = big.compare(val as NumLike, maximum)
    if (res === null || res > 0) {
      return suffix
        ? `The value should be lower than ${maximum} ${suffix}`
        : `The value should be lower than ${maximum}`
    }
    return null
  }
}

export function bigMin(
  minimum: NumLike = 1,
  suffix?: string,
): FormFieldValidator {
  return (val: unknown): FormFieldValidatorResult => {
    const res = big.compare(val as NumLike, minimum)
    if (res === -1 || res === null)
      return suffix
        ? `The value should be larger than ${minimum} ${suffix}`
        : `The value should be larger than ${minimum}`
    return null
  }
}

export function valueMapper(
  mapper: (val: unknown) => unknown,
  ...validators: FormFieldValidator[]
): FormFieldValidator {
  return (val: unknown): FormFieldValidatorResult => {
    const mappedValue = mapper(val)

    for (const validator of validators) {
      const result = validator(mappedValue)
      if (result !== null) return result
    }

    return null
  }
}

export function exceptValue(
  exValue: string | number,
  additionalMessage = '',
): FormFieldValidator {
  return (val: unknown): FormFieldValidatorResult => {
    return exValue === val ? `Invalid value! ${additionalMessage}` : null
  }
}

export function upTo10Mb(): FormFieldValidator {
  return (val: unknown): FormFieldValidatorResult => {
    return (val as File).size > 10000000
      ? 'The file is too large. Size must be less than 10MB'
      : null
  }
}

export function acceptFileFormat(format: string): FormFieldValidator {
  return (val: unknown): FormFieldValidatorResult => {
    if (!(val as File).name) return null
    return (val as File).name.endsWith(format)
      ? null
      : `Please upload file with type ${format}`
  }
}

const ADDRESS_RE = /^odin1/
export const odinAddress: FormFieldValidator = (val: unknown) => {
  if (typeof val === 'string' && !ADDRESS_RE.test(val)) {
    return 'Invalid address'
  }
  return null
}
const PREFIX_VALIDATOR = /^odinvaloper1/
export const odinValidator: FormFieldValidator = (val: unknown) => {
  if (typeof val === 'string' && !PREFIX_VALIDATOR.test(val)) {
    return 'Invalid address'
  }
  return null
}

export function requiredIf(
  condition: unknown | (() => unknown),
): FormFieldValidator {
  return (val: unknown): FormFieldValidatorResult => {
    const cond = typeof condition === 'function' ? condition() : condition
    if (cond) return required(val)
    return null
  }
}

export function shouldMatch(
  expected: unknown | (() => unknown),
  errMsg?: string,
): FormFieldValidator {
  return (val: unknown): FormFieldValidatorResult => {
    const exp = typeof expected === 'function' ? expected() : expected
    if (val !== exp) {
      return errMsg ?? 'Validators should match err'
    }
    return null
  }
}

const EMAIL_RE = /.+@.+\..+/
export const email: FormFieldValidator = (val: unknown) => {
  if (!val || typeof val !== 'string' || !EMAIL_RE.test(val)) {
    return 'Email err'
  }
  return null
}

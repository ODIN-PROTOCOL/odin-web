export type FormFieldValidator = (...args: unknown[]) => string | null
export type FormFieldValidatorResult = ReturnType<FormFieldValidator>

// TODO: translate validation errors

export const required: FormFieldValidator = (val: unknown) => {
  if (!val && val !== 0) return 'The field is required'
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

export function min(minimum: number): FormFieldValidator {
  return (val: unknown): FormFieldValidatorResult => {
    const num = Number(val)
    if (!Number.isNaN(num) && num < minimum) {
      return `The value should be larger than ${minimum}`
    }
    return null
  }
}

export function max(maximum: number): FormFieldValidator {
  return (val: unknown): FormFieldValidatorResult => {
    const num = Number(val)
    if (!Number.isNaN(num) && num > maximum) {
      return `The value should be lower than ${maximum}`
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

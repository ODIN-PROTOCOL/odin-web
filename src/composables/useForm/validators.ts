export type FormFieldValidator = (...args: unknown[]) => string | null
export type FormFieldValidatorResult = ReturnType<FormFieldValidator>

export const required: FormFieldValidator = (val: unknown) => {
  if (!val && val !== 0) return 'The field is required'
  return null
}

export const min = (minimum: number): FormFieldValidator => {
  return (val: unknown): FormFieldValidatorResult => {
    const num = Number(val)
    if (!Number.isNaN(num) && num < minimum) {
      return `The value should be larger than ${minimum}`
    }
    return null
  }
}

export const max = (maximum: number): FormFieldValidator => {
  return (val: unknown): FormFieldValidatorResult => {
    const num = Number(val)
    if (!Number.isNaN(num) && num > maximum) {
      return `The value should be lower than ${maximum}`
    }
    return null
  }
}

export const range = (minimum: number, maximum: number): FormFieldValidator => {
  const _min = min(minimum)
  const _max = max(maximum)
  return (val: unknown): FormFieldValidatorResult => {
    return _min(val) || _max(val)
  }
}

export const minItems = (minNum: number): FormFieldValidator => {
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

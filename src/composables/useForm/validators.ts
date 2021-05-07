export type FormFieldValidator = (...args: unknown[]) => string | null
export type FormFieldValidatorResult = ReturnType<FormFieldValidator>

export const required: FormFieldValidator = (val: unknown) => {
  if (!val) return 'The field is required'
  return null
}

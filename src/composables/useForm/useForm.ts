import { computed, ComputedRef } from 'vue'
import { FormField, useField } from './useField'
import { FormFieldValidator } from './validators'
import mapValues from 'lodash-es/mapValues'

export type FormFieldDefinition = [
  value: unknown,
  ...validators: FormFieldValidator[]
]

export function useForm<T extends Record<string, FormFieldDefinition>>(
  fieldDefinitions: T
): { [P in keyof T]: FormField<T[P][0]> } & {
  isValid: ComputedRef<boolean>
  validateAll(): string | null
} {
  const fields = mapValues(fieldDefinitions, (fdDef) => {
    return useField(fdDef[0], <FormFieldValidator[]>fdDef.slice(1))
  })

  const _fieldsArr = Object.values(fields)

  const isValid = computed(() => {
    return _fieldsArr.reduce(
      (valid, field) => valid && field.error.value === null,
      true
    )
  })

  const validateAll = () => {
    return _fieldsArr.reduce(
      (error, field) => error || field.validate(),
      null as string | null
    )
  }

  return { ...fields, isValid, validateAll }
}

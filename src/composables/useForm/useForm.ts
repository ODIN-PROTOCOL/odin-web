import { computed, ComputedRef, reactive } from 'vue'
import { FormField, useField } from './useField'
import { FormFieldValidator } from './validators'
import mapValues from 'lodash-es/mapValues'

export type FormFieldDefinition = [
  value: unknown,
  ...validators: FormFieldValidator[]
]

/* prettier-ignore */
type FormFlattened<T extends Record<string, FormFieldDefinition>> =
  { [P in keyof T]: FormField<T[P][0]>['current'] } &
  { [P in keyof T as `${string & P}Err`]: FormField<T[P][0]>['errorIfDirty'] } &
  { isValid: ComputedRef<boolean> }

export function useForm<T extends Record<string, FormFieldDefinition>>(
  fieldDefinitions: T
): { [P in keyof T]: FormField<T[P][0]> } & {
  isValid: ComputedRef<boolean>
  validateAll(): string | null
  flatten(): FormFlattened<T>
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

  const flatten = (): FormFlattened<T> => {
    const unwrapped = {} as Record<string, unknown>
    for (const [key, val] of Object.entries(fields)) {
      unwrapped[key] = val.current
      unwrapped[key + 'Err'] = val.errorIfDirty
      unwrapped.isValid = isValid
    }
    return reactive(unwrapped) as FormFlattened<T>
  }

  return { ...fields, isValid, validateAll, flatten }
}

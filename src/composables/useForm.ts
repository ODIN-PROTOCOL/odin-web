import { ref, computed, Ref, ComputedRef } from 'vue'
import mapValues from 'lodash-es/mapValues'

export type FormFieldValidator = (...args: unknown[]) => null | string
export type FormFieldDefinition<T extends unknown> = [
  value: T,
  ...validators: FormFieldValidator[]
]

export const validators = {
  required: <FormFieldValidator>((val: unknown) => {
    if (!val) return 'The field is required'
    return null
  }),
}

export function useForm<T extends Record<string, FormFieldDefinition<unknown>>>(
  formDefinition: T
): {
  fields: Ref<{ [P in keyof T]: unknown }>
  errors: ComputedRef<{ [P in keyof T]: string | null }>
  isValid: Ref<boolean>
} {
  const fields = <Ref<{ [P in keyof T]: unknown }>>(
    ref(mapValues(formDefinition, (def) => def[0]))
  )

  const _validatorsMap: { [P in keyof T]: FormFieldValidator[] } = mapValues(
    formDefinition,
    (def) => <FormFieldValidator[]>def.slice(1)
  )
  const errors = computed(() => {
    return mapValues(fields.value, (value, key) => {
      return _validatorsMap[key].reduce(
        (error, validator) => (!error ? validator(value) : error),
        null as string | null
      )
    })
  })

  const isValid = computed(() => {
    return Object.values(errors.value).every((err) => err === null)
  })

  return {
    fields,
    errors,
    isValid,
  }
}

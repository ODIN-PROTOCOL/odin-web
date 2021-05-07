import { computed, ComputedRef } from 'vue'
import { FormField } from './useField'

export function useForm(
  ...fields: FormField<unknown>[]
): {
  isValid: ComputedRef<boolean>
  validateAll: () => string | null
} {
  const isValid = computed(() => {
    return fields.reduce(
      (valid, field) => valid && field.error.value === null,
      true
    )
  })

  const validateAll = () => {
    return fields.reduce(
      (error, field) => error || field.validate(),
      null as string | null
    )
  }

  return { isValid, validateAll }
}

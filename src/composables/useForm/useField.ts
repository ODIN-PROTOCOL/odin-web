import {
  computed,
  ComputedRef,
  onBeforeUnmount,
  ref,
  Ref,
  UnwrapRef,
  watch,
} from 'vue'
import { FormFieldValidator, FormFieldValidatorResult } from './validators'

export interface FormField<T> {
  current: Ref<UnwrapRef<T>>
  error: Ref<FormFieldValidatorResult>
  errorIfDirty: ComputedRef<FormFieldValidatorResult | null>
  isDirty: Ref<boolean>
  val: (newValue?: T) => T
  err: (newError?: string | null) => string | null
  validate: () => FormFieldValidatorResult
}

export function useField<T>(
  initialValue: T,
  validators: FormFieldValidator[] = []
): FormField<T> {
  const current = ref(initialValue)
  const val = (newValue?: T) => {
    if (newValue !== undefined) {
      current.value = newValue as UnwrapRef<T>
    }
    return current.value as T
  }

  const error = ref(_runValidators(val(), validators))
  const err = (newError?: string | null) => {
    if (newError !== undefined) {
      error.value = newError
    }
    return error.value
  }

  const isDirty = ref(false)
  const errorIfDirty = computed(() => (isDirty.value ? error.value : null))

  const validate = (): FormFieldValidatorResult => {
    error.value = _runValidators(val(), validators)
    return error.value
  }

  const unwatchChange = watch(current, () => {
    validate()
  })

  const unwatchFirstChange = watch(current, () => {
    isDirty.value = true
    unwatchFirstChange()
  })

  onBeforeUnmount(() => {
    unwatchChange()
    unwatchFirstChange()
  })

  return { current, error, errorIfDirty, isDirty, validate, val, err }
}

function _runValidators(value: unknown, validators: FormFieldValidator[]) {
  return validators.reduce(
    (error, validator) => error || validator(value),
    null as FormFieldValidatorResult
  )
}

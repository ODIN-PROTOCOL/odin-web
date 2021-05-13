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
  val: () => UnwrapRef<T>
  validate: () => FormFieldValidatorResult
}

export function useField<T>(
  initialValue: T,
  validators: FormFieldValidator[] = []
): FormField<T> {
  const current = ref(initialValue)
  const val = () => current.value

  const isDirty = ref(false)
  const error = ref(_runValidators(val(), validators))
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

  return { current, error, errorIfDirty, isDirty, validate, val }
}

function _runValidators(value: unknown, validators: FormFieldValidator[]) {
  return validators.reduce(
    (error, validator) => error || validator(value),
    null as FormFieldValidatorResult
  )
}

import { ResumableWatcher, watchResumable } from '@/helpers/watchResumable'
import { computed, ComputedRef, ref, Ref, UnwrapRef } from 'vue'
import { FormFieldValidator, FormFieldValidatorResult } from './validators'

export interface FormField<T> {
  current: Ref<UnwrapRef<T>>
  error: Ref<FormFieldValidatorResult>
  errorIfDirty: ComputedRef<FormFieldValidatorResult | null>
  isDirty: Ref<boolean>
  addValidator: (validator: FormFieldValidator, watchRef?: Ref) => void
  removeValidator: (validator: FormFieldValidator) => void
  validate: () => FormFieldValidatorResult
  reset: () => void
  val: (newValue?: T) => T
  err: (newError?: string | null) => string | null
}

// TODO: split code to functions
export function useField<T>(
  initialValue: T,
  validators: FormFieldValidator[] = []
): FormField<T> {
  validators = [...validators] // shallow clone

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
  const validate = (): FormFieldValidatorResult => {
    error.value = _runValidators(val(), validators)
    return error.value
  }

  const isDirty = ref(false)
  const errorIfDirty = computed(() => (isDirty.value ? error.value : null))

  const watcherValidator = watchResumable(current, () => {
    validate()
  })
  const watcherDirtySetter = watchResumable(current, () => {
    isDirty.value = true
    watcherDirtySetter.stop()
  })

  const validatorWatchers = new Map<FormFieldValidator, ResumableWatcher>()
  const addValidator = (validator: FormFieldValidator, watchRef?: Ref) => {
    validators.push(validator)
    validate()

    if (watchRef) {
      const watcher = watchResumable(watchRef, () => validate())
      validatorWatchers.set(validator, watcher)
    }
  }

  const removeValidator = (validator: FormFieldValidator) => {
    validators = validators.filter((el) => el !== validator)
    validate()

    const watcher = validatorWatchers.get(validator)
    if (watcher) {
      watcher.stop()
      validatorWatchers.delete(validator)
    }
  }

  const reset = () => {
    watcherValidator.stop()
    watcherDirtySetter.stop()
    for (const w of validatorWatchers.values()) w.stop()

    current.value = initialValue as UnwrapRef<T>
    isDirty.value = false
    validate()

    watcherValidator.resume()
    watcherDirtySetter.resume()
    for (const w of validatorWatchers.values()) w.resume()
  }

  return {
    current,
    error,
    errorIfDirty,
    isDirty,
    addValidator,
    removeValidator,
    validate,
    reset,
    val,
    err,
  }
}

function _runValidators(value: unknown, validators: FormFieldValidator[]) {
  return validators.reduce(
    (error, validator) => error || validator(value),
    null as FormFieldValidatorResult
  )
}

import { AnyFn, DecoratedFn } from '@/shared-types'
import { Ref } from '@vue/reactivity'

type ConditionArg = Ref<boolean> | AnyFn<boolean>

export function preventIf<F extends AnyFn>(
  fn: F,
  condition: ConditionArg
): DecoratedFn<F> {
  return ((...args: Parameters<F>) => {
    if (_check(condition)) return null
    return fn(...args)
  }) as DecoratedFn<F>
}

export function preventUnless<F extends AnyFn>(
  fn: F,
  condition: ConditionArg
): DecoratedFn<F> {
  return ((...args: Parameters<F>) => {
    if (!_check(condition)) return null
    return fn(...args)
  }) as DecoratedFn<F>
}

function _check(condition: ConditionArg) {
  if (typeof condition === 'function') {
    return condition()
  }
  return condition.value
}

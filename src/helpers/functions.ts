import { AnyFn, DecoratedFn } from '@/shared-types'
import { Ref } from '@vue/reactivity'
import axios, { AxiosResponse } from 'axios'

export type ConditionArg = Ref<boolean> | AnyFn<boolean>

export function preventIf<F extends AnyFn>(
  fn: F,
  condition: ConditionArg,
): DecoratedFn<F> {
  return ((...args: Parameters<F>) => {
    if (_check(condition)) return null
    return fn(...args)
  }) as DecoratedFn<F>
}

export function preventUnless<F extends AnyFn>(
  fn: F,
  condition: ConditionArg,
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

// Memoizes the function. Only works for the 1st param at the moment.
export function memoize<T extends AnyFn>(func: T): DecoratedFn<T> {
  const memo = new Map<Parameters<T>[0], ReturnType<T>>()

  return (...args: Parameters<T>): ReturnType<T> => {
    const memoKey = args[0]
    if (memo.has(memoKey)) return memo.get(memoKey) as ReturnType<T>

    const res = func(...args)
    memo.set(memoKey, res as ReturnType<T>)
    return res as ReturnType<T>
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getRequest(value: string): Promise<AxiosResponse<any>> {
  return await axios.get(value)
}

export const axiosWrapper = {
  get: getRequest,
}

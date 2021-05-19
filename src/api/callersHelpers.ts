import { AnyFn, AnyObj, Unpacked } from '@/shared-types'
import mapValues from 'lodash-es/mapValues'
import Long from 'long'

interface ResponseMapper<I extends AnyFn, O extends unknown> {
  (response: Unpacked<ReturnType<I>>): O
}

export function mapResponse<T extends AnyFn, R = unknown>(
  caller: T,
  mapper: ResponseMapper<T, R>
) {
  return async (...args: Parameters<T>): Promise<R> => {
    const res = await caller(...args)
    return mapper(res as Unpacked<ReturnType<T>>)
  }
}

type UnwrappedLongs<T> = T extends Record<string, unknown> | Array<unknown>
  ? { [P in keyof T]: UnwrappedLongs<T[P]> }
  : T extends Long.Long
  ? string
  : T

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function longsToStrings<T>(anything: T): UnwrappedLongs<T> {
  if (Array.isArray(anything)) {
    return (anything.map(longsToStrings) as unknown) as UnwrappedLongs<T>
  } else if (Long.isLong(anything)) {
    return (anything.toString() as unknown) as UnwrappedLongs<T>
  } else if (_isPlainObject(anything)) {
    return (mapValues(anything, longsToStrings) as unknown) as UnwrappedLongs<T>
  } else {
    return anything as UnwrappedLongs<T>
  }
}

function _isPlainObject(value: unknown): value is AnyObj {
  if (!value) return false
  return (value as AnyObj)?.constructor === Object
}

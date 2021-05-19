import { AnyFn, AnyObj, Unpacked } from '@/shared-types'
import mapValues from 'lodash-es/mapValues'
import Long from 'long'

export function mapResponse<
  Caller extends AnyFn,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Mapper extends (response: Unpacked<ReturnType<Caller>>) => any
>(
  caller: Caller,
  mapper: Mapper
): (...args: Parameters<Caller>) => Promise<ReturnType<Mapper>> {
  return async (...args: Parameters<Caller>) => {
    const res = (await caller(...args)) as Unpacked<ReturnType<Caller>>
    return mapper(res)
  }
}

/* prettier-ignore */
type UnwrappedLongs<T> = T extends Long.Long
  ? string : T extends Array<infer U>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ? Array<UnwrappedLongs<U>> : T extends Record<string, any>
  ? { [P in keyof T]: UnwrappedLongs<T[P]> } : T

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function longsToStrings<T>(anything: T): UnwrappedLongs<T> {
  if (Array.isArray(anything)) {
    return anything.map(longsToStrings) as UnwrappedLongs<T>
  } else if (Long.isLong(anything)) {
    return anything.toString() as UnwrappedLongs<T>
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

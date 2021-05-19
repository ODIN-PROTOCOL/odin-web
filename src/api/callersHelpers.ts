import { AnyFn, Unpacked } from '@/shared-types'
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

/* prettier-ignore */
type UnwrappedLongs<T> = {
  [P in keyof T]: T[P] extends Long.Long
    ? string : T[P] extends Record<string, unknown>
    ? UnwrappedLongs<T[P]> : T[P] extends Array<unknown>
    ? UnwrappedLongs<T[P]> : T[P]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function longsToStrings<T>(obj: T): UnwrappedLongs<T> {
  return Array.isArray(obj)
    ? ((obj.map(longsToStrings) as unknown) as UnwrappedLongs<T>)
    : ((mapValues(obj as Record<string, unknown>, (value) => {
        if (Long.isLong(value)) {
          return value.toString()
        } else if (Array.isArray(value)) {
          return value.map(longsToStrings)
        } else if (value && typeof value === 'object') {
          return longsToStrings(value)
        } else {
          return value
        }
      }) as unknown) as UnwrappedLongs<T>)
}

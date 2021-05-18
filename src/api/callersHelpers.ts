import { AnyFn, Unpacked } from '@/shared-types'

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

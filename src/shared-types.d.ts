export type AnyFn<R = unknown> = (...args: unknown[]) => R
export interface DecoratedFn<F extends AnyFn> {
  (...args: Parameters<F>): ReturnType<F>
}

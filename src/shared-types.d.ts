export type GetterFn<R = unknown> = () => R
export interface AnyFn<R = unknown> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (...args: Array<any>): R
}
export interface DecoratedFn<F extends AnyFn> {
  (...args: Parameters<F>): ReturnType<F>
}
/* prettier-ignore */
export type Unpacked<T> = T extends (infer U)[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ? U : T extends (...args: any[]) => infer U
  ? U : T extends Promise<infer U>
  ? U : T

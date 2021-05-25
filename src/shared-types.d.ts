/* eslint-disable @typescript-eslint/no-explicit-any */

export type AnyFn<R = unknown> = (...args: any[]) => R
export interface DecoratedFn<F extends AnyFn> {
  (...args: Parameters<F>): ReturnType<F>
}
/* prettier-ignore */
export type Unpacked<T> = T extends (infer U)[]
  ? U : T extends (...args: any[]) => infer U
  ? U : T extends Promise<infer U>
  ? U : T
export type AnyObj = { [P in keyof T]: T[P] }
export type Modify<T, R> = Omit<T, keyof R> & R
export type MapObj<TObj, TField> = { [P in keyof TObj]: TField }

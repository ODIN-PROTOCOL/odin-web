import { GeneratedType } from '@cosmjs/proto-signing'
import { BroadcastTxResponse } from '@cosmjs/stargate'

/* eslint-disable @typescript-eslint/no-explicit-any */

type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R
  ? (...args: P) => R
  : never

interface BroadcastCallerFn {
  (typeUrl: string, ...args: any[]): Promise<BroadcastTxResponse>
}

interface BroadcastCallerFnTyped<T extends BroadcastCallerFn> {
  (...args: Parameters<OmitFirstArg<T>>): Promise<BroadcastTxResponse>
  typeUrl: string
  type: GeneratedType
}

export function makeBroadcastCaller<T extends BroadcastCallerFn>(
  typeUrl: string,
  type: GeneratedType,
  caller: T
): BroadcastCallerFnTyped<T> {
  const callerTyped: BroadcastCallerFnTyped<T> = Object.assign(
    caller.bind(undefined, typeUrl),
    { typeUrl, type }
  )
  return callerTyped
}

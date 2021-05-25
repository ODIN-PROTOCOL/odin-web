// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ObiStruct } from '@bandprotocol/obi.js'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Buffer } from 'buffer'

import { AnyObj } from '@/shared-types'

export function obiPhoneModels(models: string[]): Uint8Array {
  return new ObiStruct('{models:[string]}').encode({ models })
}

export interface ObiCoin {
  symbol: string
  multiplier: string // u64
}

export const obiCoin = _makeEncoder<ObiCoin>(
  '{symbol:string,multiplier:u64}',
  (input) => ({
    symbol: input.symbol,
    multiplier: BigInt(input.multiplier),
  }),
  (output) => ({
    symbol: output.symbol as string,
    multiplier: (output.multiplier as BigInt).toString(),
  })
)

function _makeEncoder<T extends AnyObj>(
  type: string,
  encodeInputMapper: (input: T) => AnyObj,
  decodeOutputMapper: (output: AnyObj) => T
) {
  const struct = new ObiStruct(type)
  const encode = (input: T): Uint8Array =>
    struct.encode(encodeInputMapper(input))
  const decode = (input: Uint8Array): T =>
    decodeOutputMapper(struct.decode(Buffer.from(input))[0])
  return { encode, decode }
}

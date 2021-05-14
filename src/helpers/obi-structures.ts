// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ObiStruct } from '@bandprotocol/obi.js'

export function obiPhoneModels(models: string[]): Uint8Array {
  return new ObiStruct('{models:[string]}').encode({ models })
}

export function obiCoinMultiplier(sym: string, multiplier: number): Uint8Array {
  return new ObiStruct('{symbol:string,multiplier:u64}').encode({
    symbol: sym,
    multiplier,
  })
}

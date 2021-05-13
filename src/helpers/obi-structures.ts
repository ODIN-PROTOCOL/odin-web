// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ObiStruct } from '@bandprotocol/obi.js'

export function obiPhoneModels(models: string[]): Uint8Array {
  return new ObiStruct('{models:[string]}').encode({ models })
}

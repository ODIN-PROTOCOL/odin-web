import {
  OracleResponsePacketData,
  RequestResult,
} from '@provider/codec/oracle/v1/oracle'
import { uint8ArrayToStr } from '@/helpers/casts'
import { Modify } from '@/shared-types'

export type RequestResultDecoded = Modify<
  RequestResult,
  { responsePacketData?: OracleResponsePacketDataDecoded }
>
export function decodeRequestResults(
  requests: RequestResult[]
): RequestResultDecoded[] {
  return requests.map((request) => {
    return {
      ...request,
      responsePacketData: decodeOracleResponsePacketData(
        request.responsePacketData
      ),
    }
  })
}

export type OracleResponsePacketDataDecoded =
  | Modify<OracleResponsePacketData, { result: string }>
  | undefined
export function decodeOracleResponsePacketData(
  packet?: OracleResponsePacketData
): OracleResponsePacketDataDecoded {
  if (!packet) return
  return {
    ...packet,
    result: uint8ArrayToStr(packet.result),
  }
}

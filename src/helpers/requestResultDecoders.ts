import {
  OracleResponsePacketData,
  RequestResult,
} from '@provider/codec/oracle/v1/oracle'
import { uint8ArrayToStr } from '@/helpers/casts'

export type RequestResultDecoded = Omit<RequestResult, 'responsePacketData'> & {
  responsePacketData?: OracleResponsePacketDataDecoded
}
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
  | (Omit<OracleResponsePacketData, 'result'> & { result: string })
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

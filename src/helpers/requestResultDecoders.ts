import {
  OracleRequestPacketData,
  OracleResponsePacketData,
  RequestResult,
} from '@provider/codec/oracle/v1/oracle'
import { uint8ArrayToStr } from '@/helpers/casts'
import { Modify } from '@/shared-types'
import { ObiCoin, obiCoin } from './obi-structures'

export type RequestResultDecoded = Modify<
  RequestResult,
  {
    requestPacketData?: OracleRequestPacketDataDecoded
    responsePacketData?: OracleResponsePacketDataDecoded
  }
>
export function decodeRequestResults(
  requests: RequestResult[]
): RequestResultDecoded[] {
  return requests.map((request) => {
    return {
      requestPacketData: decodeOracleRequestPacketData(
        request.requestPacketData
      ),
      responsePacketData: decodeOracleResponsePacketData(
        request.responsePacketData
      ),
    }
  })
}

export type OracleRequestPacketDataDecoded =
  | Modify<OracleRequestPacketData, { calldata: ObiCoin }>
  | undefined
export function decodeOracleRequestPacketData(
  packet?: OracleRequestPacketData
): OracleRequestPacketDataDecoded {
  if (!packet) return
  return {
    ...packet,
    calldata: obiCoin.decode(packet.calldata),
  }
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

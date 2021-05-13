import { MsgRequestData } from '@provider/codec/oracle/v1/tx'
import { signAndBroadcast } from '@/api/callers/signAndBroadcast'
import { BroadcastTxResponse } from '@cosmjs/stargate'
import { makeBroadcastCaller } from './makeBroadcastCaller'

export const createRequest = makeBroadcastCaller(
  '/oracle.v1.MsgRequestData',
  MsgRequestData,
  (typeUrl, msg: MsgRequestData): Promise<BroadcastTxResponse> => {
    const encode = { typeUrl, value: msg }
    return signAndBroadcast([encode])
  }
)

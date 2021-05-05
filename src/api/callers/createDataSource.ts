import { MsgCreateDataSource } from '@/api/codec/oracle/v1/tx'
import { signAndBroadcast } from '@/api/callers/signAndBroadcast'
import { BroadcastTxResponse } from '@cosmjs/stargate'
import { makeBroadcastCaller } from './makeBroadcastCaller'

export const createDataSource = makeBroadcastCaller(
  '/oracle.v1.MsgCreateDataSource',
  MsgCreateDataSource,
  (typeUrl, msg: MsgCreateDataSource): Promise<BroadcastTxResponse> => {
    const encode = { typeUrl, value: msg }
    return signAndBroadcast([encode])
  }
)

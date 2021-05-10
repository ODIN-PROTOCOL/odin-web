import { MsgCreateOracleScript } from '@provider/codec/oracle/v1/tx'
import { signAndBroadcast } from '@/api/callers/signAndBroadcast'
import { BroadcastTxResponse } from '@cosmjs/stargate'
import { makeBroadcastCaller } from './makeBroadcastCaller'

export const createOracleScript = makeBroadcastCaller(
  '/oracle.v1.MsgCreateOracleScript',
  MsgCreateOracleScript,
  (typeUrl, msg: MsgCreateOracleScript): Promise<BroadcastTxResponse> => {
    const encode = { typeUrl, value: msg }
    return signAndBroadcast([encode])
  }
)

import { coins, StdFee } from '@cosmjs/launchpad'
import { EncodeObject } from '@cosmjs/proto-signing'
import { BroadcastTxFailure, BroadcastTxResponse } from '@cosmjs/stargate'
import { getSigningStargateClient } from '@/api/client/signingStargateClient'
import { getWalletAccounts } from '@/api/client/wallet'

export class BroadcastError extends Error {
  txCode: number
  txHash: string
  txRawLog?: string

  constructor(txFailure: BroadcastTxFailure) {
    super(txFailure.rawLog || 'unknown error')
    this.name = 'Broadcast Tx Error'
    this.txCode = txFailure.code
    this.txRawLog = txFailure.rawLog
    this.txHash = txFailure.transactionHash
  }
}

export async function signAndBroadcast(
  messages: EncodeObject[]
): Promise<BroadcastTxResponse> {
  const stargate = getSigningStargateClient()
  const [account] = getWalletAccounts()
  if (!stargate || !account || !account.address) {
    throw new ReferenceError('Cannot get sStargate client or wallet account!')
  }

  const fee: StdFee = {
    amount: coins(0, 'odin'),
    gas: '2000000',
  }

  const res = await stargate.signAndBroadcast(account.address, messages, fee)

  if (!res || ('code' in res && res.code !== 0)) {
    throw new BroadcastError(res)
  }

  return res
}

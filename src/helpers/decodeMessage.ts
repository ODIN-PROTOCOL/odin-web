import { MsgWithdrawCoinsToAccFromTreasury } from '@provider/codec/mint/tx'
import {
  MsgSubmitProposal,
  MsgVote,
} from '@provider/codec/cosmos/gov/v1beta1/tx'
import {
  MsgCreateValidator,
  MsgDelegate,
  MsgEditValidator,
  MsgUndelegate,
} from '@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/tx'
import { MsgWithdrawDelegatorReward } from '@cosmjs/stargate/build/codec/cosmos/distribution/v1beta1/tx'
import { MsgSend } from '@cosmjs/stargate/build/codec/cosmos/bank/v1beta1/tx'
import {
  MsgActivate,
  MsgAddReporter,
  MsgCreateDataSource,
  MsgCreateOracleScript,
} from '@provider/codec/oracle/v1/tx'
import { callers } from '@/api/callers'
import { Tx } from '@cosmjs/stargate/build/codec/cosmos/tx/v1beta1/tx'
import { ReadonlyDateWithNanoseconds } from '@cosmjs/tendermint-rpc/build/dates'
import { TxResponse } from '@cosmjs/tendermint-rpc/build/tendermint34/responses'
import { adjustedData } from '@/helpers/Types'

export const getDecodeTx = (tx: TxResponse['tx']): Tx => Tx.decode(tx)

const getTime = async (
  height: number
): Promise<ReadonlyDateWithNanoseconds> => {
  const res = await callers.getBlockchain(height, height)
  return res.blockMetas[0].header.time
}

export function humanizeMessageType(type: string): string {
  switch (type) {
    case '/mint.MsgWithdrawCoinsToAccFromTreasury':
      return 'Withdraw'

    case '/cosmos.MsgVote':
      return 'Vote'

    case '/cosmos.gov.v1beta1.MsgVote':
      return 'Vote'

    case '/cosmos.gov.v1beta1.MsgSubmitProposal':
      return 'Submit proposal'

    case '/cosmos.staking.v1beta1.MsgCreateValidator':
      return 'Create Validator'

    case '/cosmos.staking.v1beta1.MsgEditValidator':
      return 'Edit Validator'

    case '/cosmos.staking.v1beta1.MsgDelegate':
      return 'Delegate'

    case '/cosmos.bank.v1beta1.MsgSend':
      return 'Send'

    case '/cosmos.staking.v1beta1.MsgUndelegate':
      return 'Undelegate'

    case '/oracle.v1.MsgActivate':
      return 'Activate'

    case '/oracle.v1.MsgCreateDataSource':
      return 'Create Data Source'

    case '/oracle.v1.MsgCreateOracleScript':
      return 'Create Oracle Script'

    case '/oracle.v1.MsgAddReporter':
      return 'Add Reporter'

    case '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward':
      return 'Withdraw delegator reward'

    default:
      throw new ReferenceError(`Unknown type ${type}`)
  }
}

function decodeMessage(obj: {
  typeUrl: string
  value: Uint8Array
}):
  | MsgWithdrawCoinsToAccFromTreasury
  | MsgCreateValidator
  | MsgEditValidator
  | MsgDelegate
  | MsgUndelegate
  | MsgSend
  | MsgVote
  | MsgSubmitProposal
  | MsgAddReporter
  | MsgActivate
  | MsgCreateOracleScript
  | MsgCreateDataSource {
  switch (obj.typeUrl) {
    case '/mint.MsgWithdrawCoinsToAccFromTreasury':
      return MsgWithdrawCoinsToAccFromTreasury.decode(obj.value)

    case '/cosmos.staking.v1beta1.MsgCreateValidator':
      return MsgCreateValidator.decode(obj.value)

    case '/cosmos.staking.v1beta1.MsgEditValidator':
      return MsgEditValidator.decode(obj.value)

    case '/cosmos.staking.v1beta1.MsgDelegate':
      return MsgDelegate.decode(obj.value)

    case '/cosmos.staking.v1beta1.MsgUndelegate':
      return MsgUndelegate.decode(obj.value)

    case '/cosmos.gov.v1beta1.MsgVote':
      return MsgVote.decode(obj.value)

    case '/cosmos.gov.v1beta1.MsgSubmitProposal':
      return MsgSubmitProposal.decode(obj.value)

    case '/cosmos.bank.v1beta1.MsgSend':
      return MsgSend.decode(obj.value)

    case '/oracle.v1.MsgActivate':
      return MsgActivate.decode(obj.value)

    case '/oracle.v1.MsgCreateDataSource':
      return MsgCreateDataSource.decode(obj.value)

    case '/oracle.v1.MsgCreateOracleScript':
      return MsgCreateOracleScript.decode(obj.value)

    case '/oracle.v1.MsgAddReporter':
      return MsgAddReporter.decode(obj.value)

    case '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward':
      return MsgWithdrawDelegatorReward.decode(obj.value)

    default:
      throw new ReferenceError(`Unknown type ${obj.typeUrl}`)
  }
}

export async function getDateFromMessage(
  tx: TxResponse
): Promise<adjustedData> {
  const obj = getDecodeTx(tx.tx)?.body?.messages[0] as {
    typeUrl: string
    value: Uint8Array
  }
  const message = decodeMessage(obj)
  const adjustedData: adjustedData = {
    type: humanizeMessageType(obj.typeUrl),
    time: (await getTime(Number(tx.height))) as Date,
    fee: getDecodeTx(tx.tx)?.authInfo?.fee?.amount[0]?.amount,
  }
  if ('amount' in message) {
    if (typeof message.amount === 'object') {
      if ('denom' in message.amount && 'amount' in message.amount) {
        adjustedData.amount = `${message.amount?.amount} ${message.amount?.denom}`
      } else {
        adjustedData.amount = `${message.amount[0]?.amount} ${message.amount[0]?.denom}`
      }
    }
  }
  if ('voter' in message) {
    adjustedData.sender = message?.voter
  }
  if (adjustedData.type === 'Delegate') {
    if ('delegatorAddress' in message) {
      adjustedData.sender = message?.delegatorAddress
    }
    if ('validatorAddress' in message) {
      adjustedData.receiver = message?.validatorAddress
    }
  }
  if (adjustedData.type === 'Undelegate') {
    if ('delegatorAddress' in message) {
      adjustedData.sender = message?.delegatorAddress
    }
    if ('validatorAddress' in message) {
      adjustedData.receiver = ''
    }
  }
  if (adjustedData.type === 'Send') {
    if ('fromAddress' in message) {
      adjustedData.sender = message?.fromAddress
    }
    if ('toAddress' in message) {
      adjustedData.receiver = message?.toAddress
    }
  }
  if (adjustedData.type === 'Withdraw') {
    if ('sender' in message) {
      adjustedData.sender = message?.sender
    }
    if ('receiver' in message) {
      adjustedData.receiver = message?.receiver
    }
  }

  console.debug(adjustedData.type)

  return adjustedData
}

import { MsgWithdrawCoinsToAccFromTreasury } from '@provider/codec/mint/tx'
import {
  MsgSubmitProposal,
  MsgVote,
  MsgDeposit,
} from '@provider/codec/cosmos/gov/v1beta1/tx'
import {
  MsgBeginRedelegate,
  MsgCreateValidator,
  MsgDelegate,
  MsgEditValidator,
  MsgUndelegate,
} from 'cosmjs-types/cosmos/staking/v1beta1/tx'
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx'
import { MsgStoreCode } from 'cosmjs-types/cosmwasm/wasm/v1/tx'
import { MsgCreateVestingAccount } from 'cosmjs-types/cosmos/vesting/v1beta1/tx.js'
import {
  MsgActivate,
  MsgAddReporter,
  MsgCreateDataSource,
  MsgCreateOracleScript,
  MsgReportData,
  MsgRequestData,
  MsgEditOracleScript,
  MsgEditDataSource,
  MsgRemoveReporter,
} from '@provider/codec/oracle/v1/tx'
import {
  MsgWithdrawDelegatorReward,
  MsgWithdrawValidatorCommission,
  MsgFundCommunityPool,
} from 'cosmjs-types/cosmos/distribution/v1beta1/tx'
import { callers } from '@/api/callers'
import { Tx } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { ReadonlyDateWithNanoseconds } from '@cosmjs/tendermint-rpc/build/dates'
import { TxResponse } from '@cosmjs/tendermint-rpc/build/tendermint34/responses'
import { DecodedTxData } from '@/helpers/Types'
import {
  MsgCreateClient,
  MsgUpdateClient,
} from 'cosmjs-types/ibc/core/client/v1/tx'
import { MsgConnectionOpenInit } from 'cosmjs-types/ibc/core/connection/v1/tx'
import { MsgChannelOpenInit } from 'cosmjs-types/ibc/core/channel/v1/tx'
import { MsgTransfer } from 'cosmjs-types/ibc/applications/transfer/v1/tx'
import { MsgUnjail } from 'cosmjs-types/cosmos/slashing/v1beta1/tx'
import { fromBase64 } from '@cosmjs/encoding'

import { TxTelemetry } from '@/helpers/Types'
import { getLokiFromString } from '@/helpers/converters'

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

    case '/cosmos.gov.v1beta1.MsgDeposit':
      return 'Deposit'

    case '/cosmos.gov.v1beta1.MsgVote':
      return 'Vote'

    case '/cosmos.gov.v1beta1.MsgSubmitProposal':
      return 'Submit Proposal'

    case '/cosmos.staking.v1beta1.MsgCreateValidator':
      return 'Create Validator'

    case '/cosmos.staking.v1beta1.MsgDelegate':
      return 'Delegate'

    case '/cosmos.bank.v1beta1.MsgSend':
      return 'Send'

    case '/cosmos.staking.v1beta1.MsgUndelegate':
      return 'Undelegate'

    case '/cosmos.staking.v1beta1.MsgEditValidator':
      return 'Edit Validator'

    case '/cosmos.staking.v1beta1.MsgBeginRedelegate':
      return 'Begin Redelegate'

    case '/oracle.v1.MsgActivate':
      return 'Activate'

    case '/oracle.v1.MsgCreateDataSource':
      return 'Create Data Source'

    case '/oracle.v1.MsgCreateOracleScript':
      return 'Create Oracle Script'

    case '/oracle.v1.MsgAddReporter':
      return 'Add Reporter'

    case '/oracle.v1.MsgRequestData':
      return 'Request Data'

    case '/oracle.v1.MsgReportData':
      return 'Report Data'

    case '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward':
      return 'Withdraw delegator reward'

    case '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission':
      return 'Withdraw validator commission'

    case '/cosmos.slashing.v1beta1.MsgUnjail':
      return 'Unjail'

    case '/ibc.core.client.v1.MsgCreateClient':
      return 'Create IBC Client'

    case '/ibc.core.connection.v1.MsgConnectionOpenInit':
      return 'Connection Open Init'

    case '/ibc.core.client.v1.MsgUpdateClient':
      return 'Update IBC Client'

    case '/ibc.core.channel.v1.MsgChannelOpenInit':
      return 'Chanel Open Init'

    case '/ibc.applications.transfer.v1.MsgTransfer':
      return 'IBC Transfer'

    case '/cosmos.vesting.v1beta1.MsgCreateVestingAccount':
      return 'Create Vesting Account'

    case '/oracle.v1.MsgEditDataSource':
      return 'Edit Data Source'

    case '/oracle.v1.MsgEditOracleScript':
      return 'Edit OracleScript'

    case '/oracle.v1.MsgRemoveReporter':
      return 'Remove Reporter'

    case '/mint.MsgMintCoins':
      return 'Mint Coins'

    case '/cosmos.distribution.v1beta1.MsgFundCommunityPool':
      return 'Fund Community Pool'

    case '/cosmwasm.wasm.v1.MsgStoreCode':
      return 'Store Code'

    default:
      throw new ReferenceError(`Unknown type ${type}`)
  }
}

export function decodeMessage(obj: {
  typeUrl: string
  value: Uint8Array
}):
  | MsgWithdrawCoinsToAccFromTreasury
  | MsgCreateValidator
  | MsgEditValidator
  | MsgDelegate
  | MsgUndelegate
  | MsgBeginRedelegate
  | MsgSend
  | MsgVote
  | MsgDeposit
  | MsgSubmitProposal
  | MsgAddReporter
  | MsgActivate
  | MsgCreateOracleScript
  | MsgCreateDataSource
  | MsgRequestData
  | MsgReportData
  | MsgCreateClient
  | MsgConnectionOpenInit
  | MsgUpdateClient
  | MsgChannelOpenInit
  | MsgTransfer
  | MsgWithdrawValidatorCommission
  | MsgUnjail
  | MsgCreateVestingAccount
  | MsgEditDataSource
  | MsgEditOracleScript
  | MsgFundCommunityPool
  | MsgRemoveReporter
  | MsgStoreCode {
  switch (obj.typeUrl) {
    case '/mint.MsgWithdrawCoinsToAccFromTreasury':
      return MsgWithdrawCoinsToAccFromTreasury.decode(obj.value)

    case '/mint.MsgMintCoins':
      return MsgWithdrawCoinsToAccFromTreasury.decode(obj.value)

    case '/cosmos.staking.v1beta1.MsgCreateValidator':
      return MsgCreateValidator.decode(obj.value)

    case '/cosmos.staking.v1beta1.MsgDelegate':
      return MsgDelegate.decode(obj.value)

    case '/cosmos.staking.v1beta1.MsgUndelegate':
      return MsgUndelegate.decode(obj.value)

    case '/cosmos.gov.v1beta1.MsgVote':
      return MsgVote.decode(obj.value)

    case '/cosmos.gov.v1beta1.MsgDeposit':
      return MsgDeposit.decode(obj.value)

    case '/cosmos.gov.v1beta1.MsgSubmitProposal':
      return MsgSubmitProposal.decode(obj.value)

    case '/cosmos.bank.v1beta1.MsgSend':
      return MsgSend.decode(obj.value)

    case '/cosmos.staking.v1beta1.MsgEditValidator':
      return MsgEditValidator.decode(obj.value)

    case '/cosmos.staking.v1beta1.MsgBeginRedelegate':
      return MsgBeginRedelegate.decode(obj.value)

    case '/oracle.v1.MsgActivate':
      return MsgActivate.decode(obj.value)

    case '/oracle.v1.MsgCreateDataSource':
      return MsgCreateDataSource.decode(obj.value)

    case '/oracle.v1.MsgEditDataSource':
      return MsgEditDataSource.decode(obj.value)

    case '/oracle.v1.MsgRemoveReporter':
      return MsgRemoveReporter.decode(obj.value)

    case '/oracle.v1.MsgCreateOracleScript':
      return MsgCreateOracleScript.decode(obj.value)

    case '/oracle.v1.MsgEditOracleScript':
      return MsgEditOracleScript.decode(obj.value)

    case '/oracle.v1.MsgAddReporter':
      return MsgAddReporter.decode(obj.value)

    case '/oracle.v1.MsgRequestData':
      return MsgRequestData.decode(obj.value)

    case '/oracle.v1.MsgReportData':
      return MsgReportData.decode(obj.value)

    case '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward':
      return MsgWithdrawDelegatorReward.decode(obj.value)

    case '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission':
      return MsgWithdrawValidatorCommission.decode(obj.value)

    case '/cosmos.slashing.v1beta1.MsgUnjail':
      return MsgUnjail.decode(obj.value)

    case '/ibc.core.client.v1.MsgCreateClient':
      return MsgCreateClient.decode(obj.value)

    case '/ibc.core.connection.v1.MsgConnectionOpenInit':
      return MsgConnectionOpenInit.decode(obj.value)

    case '/ibc.core.client.v1.MsgUpdateClient':
      return MsgUpdateClient.decode(obj.value)

    case '/ibc.core.channel.v1.MsgChannelOpenInit':
      return MsgChannelOpenInit.decode(obj.value)

    case '/ibc.applications.transfer.v1.MsgTransfer':
      return MsgTransfer.decode(obj.value)

    case '/cosmos.vesting.v1beta1.MsgCreateVestingAccount':
      return MsgCreateVestingAccount.decode(obj.value)

    case '/cosmwasm.wasm.v1.MsgStoreCode':
      return MsgStoreCode.decode(obj.value)

    case '/cosmos.distribution.v1beta1.MsgFundCommunityPool':
      return MsgFundCommunityPool.decode(obj.value)
    default:
      throw new ReferenceError(`Unknown type ${obj.typeUrl}`)
  }
}

export async function getDateFromMessage(
  tx: TxTelemetry
): Promise<DecodedTxData> {
  const DecodedTxData: DecodedTxData = {
    type: '',
    time: (await getTime(Number(tx.height))) as Date,
    fee: '0',
    amount: '0',
    block: tx.height,
    memo: '',
    status: 0,
    gasWanted: '',
    gasUsed: '',
  }
  if (tx.tx) {
    const decodedTx = getDecodeTx(fromBase64(tx.tx))
    const obj = decodedTx?.body?.messages[0] as {
      typeUrl: string
      value: Uint8Array
    }
    const message = decodeMessage(obj)
    DecodedTxData.type = humanizeMessageType(obj.typeUrl)
    DecodedTxData.fee = decodedTx?.authInfo?.fee?.amount[0]?.amount
    DecodedTxData.feeDenom = decodedTx?.authInfo?.fee?.amount[0]?.denom
    DecodedTxData.memo = decodedTx.body?.memo
      ? decodedTx.body?.memo
      : '<No Memo>'
    DecodedTxData.status = tx.tx_result.code
    DecodedTxData.gasWanted = tx.tx_result.gas_wanted
    DecodedTxData.gasUsed = tx.tx_result.gas_used

    if ('amount' in message) {
      if (typeof message.amount === 'object') {
        if ('denom' in message.amount && 'amount' in message.amount) {
          DecodedTxData.amount = message.amount?.amount
          DecodedTxData.denom = message.amount?.denom
        } else {
          DecodedTxData.amount = message.amount[0]?.amount
          DecodedTxData.denom = message.amount[0]?.denom
        }
      }
    } else {
      const amount = tx.tx_result.events
        .find((item) => {
          DecodedTxData.type.toLowerCase().includes(item.type.split('_')[0])
        })
        ?.attributes?.map((item) =>
          item.value ? new TextDecoder().decode(fromBase64(item.value)) : ''
        )
      console.log(tx.tx_result.events)

      DecodedTxData.amount = getLokiFromString(
        amount?.find((item: string) => item?.includes('loki'))
      )
    }

    if (DecodedTxData.type === 'Vote') {
      if ('voter' in message) {
        DecodedTxData.sender = message?.voter
      }
    }
    if (DecodedTxData.type === 'Delegate') {
      if ('delegatorAddress' in message) {
        DecodedTxData.sender = message?.delegatorAddress
      }
      if ('validatorAddress' in message) {
        DecodedTxData.receiver = message?.validatorAddress
      }
    }
    if (DecodedTxData.type === 'Undelegate') {
      if ('delegatorAddress' in message) {
        DecodedTxData.sender = message?.delegatorAddress
      }
      if ('validatorAddress' in message) {
        DecodedTxData.receiver = ''
      }
    }
    if (DecodedTxData.type === 'Send') {
      if ('fromAddress' in message) {
        DecodedTxData.sender = message?.fromAddress
      }
      if ('toAddress' in message) {
        DecodedTxData.receiver = message?.toAddress
      }
    }
    if (DecodedTxData.type === 'Withdraw') {
      if ('sender' in message) {
        DecodedTxData.sender = message?.sender
      }
      if ('receiver' in message) {
        DecodedTxData.receiver = message?.receiver
      }
    }
    if (DecodedTxData.type === 'Withdraw delegator reward') {
      if ('delegatorAddress' in message) {
        DecodedTxData.sender = message?.delegatorAddress
      }
      if ('validatorAddress' in message) {
        DecodedTxData.receiver = message?.validatorAddress
      }
    }
    if (DecodedTxData.type === 'Withdraw validator commission') {
      if ('delegatorAddress' in message) {
        DecodedTxData.sender = message?.delegatorAddress
      }
      if ('validatorAddress' in message) {
        DecodedTxData.receiver = message?.validatorAddress
      }
    }
    if (DecodedTxData.type === 'Edit OracleScript') {
      if ('sender' in message) {
        DecodedTxData.sender = message.sender
      }
    }
    if (DecodedTxData.type === 'Edit Data Source') {
      if ('sender' in message) {
        DecodedTxData.sender = message.sender
      }
    }
    if (DecodedTxData.type === 'Edit Validator') {
      if ('delegatorAddress' in message) {
        DecodedTxData.sender = message.delegatorAddress
      }
      if ('validatorAddress' in message) {
        DecodedTxData.receiver = message.validatorAddress
      }
    }
    if (DecodedTxData.type === 'Begin Redelegate') {
      if ('delegatorAddress' in message) {
        DecodedTxData.sender = message.delegatorAddress
      }
      if ('validatorDstAddress' in message) {
        DecodedTxData.receiver = message.validatorDstAddress
      }
    }
    if (DecodedTxData.type === 'IBC Transfer') {
      if ('sender' in message) {
        DecodedTxData.sender = message.sender
      }
      if ('receiver' in message) {
        DecodedTxData.receiver = message.receiver
      }
    }
    if (DecodedTxData.type === 'Create Validator') {
      if ('delegatorAddress' in message) {
        DecodedTxData.sender = message.delegatorAddress
      }
      if ('validatorAddress' in message) {
        DecodedTxData.receiver = message.validatorAddress
      }
    }
    if (DecodedTxData.type === 'Submit Proposal') {
      if ('proposer' in message) {
        DecodedTxData.sender = message.proposer
      }
      if ('initialDeposit' in message) {
        DecodedTxData.amount = message.initialDeposit[0]?.amount
        DecodedTxData.denom = message.initialDeposit[0]?.denom
      }
    }
    if (DecodedTxData.type === 'Report Data') {
      if ('reporter' in message) {
        DecodedTxData.sender = message.reporter
      }
      if ('validator' in message) {
        DecodedTxData.receiver = message.validator
      }
    }
    if (DecodedTxData.type === 'Request Data') {
      if ('sender' in message) {
        DecodedTxData.sender = message.sender
      }
      if ('validator' in message) {
        DecodedTxData.receiver = message.validator
      }
    }
    if (DecodedTxData.type === 'Update IBC Client') {
      if ('signer' in message) {
        DecodedTxData.sender = message.signer
      }
      if ('validatorAddress' in message) {
        DecodedTxData.receiver = message.validatorAddress
      }
    }
    if (DecodedTxData.type === 'Create Oracle Script') {
      if ('sender' in message) {
        DecodedTxData.sender = message.sender
      }
    }
    if (DecodedTxData.type === 'Create Data Source') {
      if ('sender' in message) {
        DecodedTxData.sender = message.sender
      }
    }
    if (DecodedTxData.type === 'Create IBC Client') {
      if ('signer' in message) {
        DecodedTxData.sender = message.signer
      }
    }
    if (DecodedTxData.type === 'Connection Open Init') {
      if ('signer' in message) {
        DecodedTxData.sender = message.signer
      }
    }
    if (DecodedTxData.type === 'Create Vesting Account') {
      if ('fromAddress' in message) {
        DecodedTxData.sender = message.fromAddress
      }
      if ('toAddress' in message) {
        DecodedTxData.receiver = message.toAddress
      }
    }
    if (DecodedTxData.type === 'Unjail') {
      if ('validatorAddr' in message) {
        DecodedTxData.receiver = message.validatorAddr
      }
    }
    if (DecodedTxData.type === 'Chanel Open Init') {
      if ('signer' in message) {
        DecodedTxData.sender = message.signer
      }
    }
    if (DecodedTxData.type === 'Activate') {
      if ('validator' in message) {
        DecodedTxData.receiver = message.validator
      }
    }
    if (DecodedTxData.type === 'Deposit') {
      if ('depositor' in message) {
        DecodedTxData.receiver = message.depositor
      }
    }
    if (DecodedTxData.type === 'Mint Coins') {
      if ('sender' in message) {
        DecodedTxData.sender = message?.sender
      }
      if ('receiver' in message) {
        DecodedTxData.receiver = message?.receiver
      }
    }

    if (DecodedTxData.type === 'Fund Community Pool') {
      if ('depositor' in message) {
        DecodedTxData.sender = message?.depositor
      }
    }

    if (DecodedTxData.type === 'Remove Reporter') {
      if ('validator' in message) {
        DecodedTxData.receiver = message.validator
      }
      if ('reporter' in message) {
        DecodedTxData.sender = message.reporter
      }
    }

    if (DecodedTxData.type === 'Store Code') {
      if ('sender' in message) {
        DecodedTxData.sender = message.sender
      }
    }

    console.debug(DecodedTxData.type)
  }
  return DecodedTxData
}

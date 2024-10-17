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

import { parseISO } from 'date-fns'
import { MsgExec, MsgGrant } from 'cosmjs-types/cosmos/authz/v1beta1/tx'
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
import {
  Transaction as TxMessage,
  ValidatorDetailedInfo,
} from '@/graphql/types/responses'

export const getDecodeTx = (tx: TxResponse['tx']): Tx => Tx.decode(tx)

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

    case '/cosmos.authz.v1beta1.MsgExec':
      return 'Authz MsgExec'

    case '/cosmos.authz.v1beta1.MsgGrant':
      return 'Authz MsgGrant'
    case '/cosmwasm.wasm.v1.MsgExecuteContract':
      return 'Execute Contract'
    default:
      throw new ReferenceError(`Unknown type ${type}`)
  }
}

export type SupportedMsg =
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
  | MsgStoreCode
  | MsgExec
  | MsgGrant

export function decodeMessage(
  obj: any,
):
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
  | MsgStoreCode
  | MsgExec
  | MsgGrant {
  const object = {
    ...obj,
    type: obj['@type'],
  }
  switch (object['type']) {
    case '/mint.MsgWithdrawCoinsToAccFromTreasury':
      return object as MsgWithdrawCoinsToAccFromTreasury

    case '/mint.MsgMintCoins':
      return object as MsgWithdrawCoinsToAccFromTreasury

    case '/cosmos.staking.v1beta1.MsgCreateValidator':
      return object as MsgCreateValidator

    case '/cosmos.staking.v1beta1.MsgDelegate':
      return object as MsgDelegate

    case '/cosmos.staking.v1beta1.MsgUndelegate':
      return object as MsgUndelegate

    case '/cosmos.gov.v1beta1.MsgVote':
      return object as MsgVote

    case '/cosmos.gov.v1beta1.MsgDeposit':
      return object as MsgDeposit

    case '/cosmos.gov.v1beta1.MsgSubmitProposal':
      return object as MsgSubmitProposal

    case '/cosmos.bank.v1beta1.MsgSend':
      return object as MsgSend

    case '/cosmos.staking.v1beta1.MsgEditValidator':
      return object as MsgEditValidator

    case '/cosmos.staking.v1beta1.MsgBeginRedelegate':
      return object as MsgBeginRedelegate

    case '/oracle.v1.MsgActivate':
      return object as MsgActivate

    case '/oracle.v1.MsgCreateDataSource':
      return object as MsgCreateDataSource

    case '/oracle.v1.MsgEditDataSource':
      return object as MsgEditDataSource

    case '/oracle.v1.MsgRemoveReporter':
      return object as MsgRemoveReporter

    case '/oracle.v1.MsgCreateOracleScript':
      return object as MsgCreateOracleScript

    case '/oracle.v1.MsgEditOracleScript':
      return object as MsgEditOracleScript

    case '/oracle.v1.MsgAddReporter':
      return object as MsgAddReporter

    case '/oracle.v1.MsgRequestData':
      return object as MsgRequestData

    case '/oracle.v1.MsgReportData':
      return object as MsgReportData

    case '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward':
      return object as MsgWithdrawDelegatorReward

    case '/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission':
      return object as MsgWithdrawValidatorCommission

    case '/cosmos.slashing.v1beta1.MsgUnjail':
      return object as MsgUnjail

    case '/ibc.core.client.v1.MsgCreateClient':
      return object as MsgCreateClient

    case '/ibc.core.connection.v1.MsgConnectionOpenInit':
      return object as MsgConnectionOpenInit

    case '/ibc.core.client.v1.MsgUpdateClient':
      return object as MsgUpdateClient

    case '/ibc.core.channel.v1.MsgChannelOpenInit':
      return object as MsgChannelOpenInit

    case '/ibc.applications.transfer.v1.MsgTransfer':
      return object as MsgTransfer

    case '/cosmos.vesting.v1beta1.MsgCreateVestingAccount':
      return object as MsgCreateVestingAccount

    case '/cosmwasm.wasm.v1.MsgStoreCode':
      return object as MsgStoreCode

    case '/cosmos.distribution.v1beta1.MsgFundCommunityPool':
      return object as MsgFundCommunityPool

    case '/cosmos.authz.v1beta1.MsgExec':
      return object as MsgExec

    case '/cosmos.authz.v1beta1.MsgGrant':
      return object as MsgGrant

    default:
      throw new ReferenceError(`Unknown type ${object.type}`)
  }
}

export function decodeRPCMessage(obj: {
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
  | MsgStoreCode
  | MsgExec
  | MsgGrant {
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

    case '/cosmos.authz.v1beta1.MsgExec':
      return MsgExec.decode(obj.value)

    case '/cosmos.authz.v1beta1.MsgGrant':
      return MsgGrant.decode(obj.value)

    default:
      throw new ReferenceError(`Unknown type ${obj.typeUrl}`)
  }
}

function getValidator(
  validatorAddress: string,
  validators: ValidatorDetailedInfo[],
) {
  return validators.find(
    v => v.validator.validator_info.operator_address === validatorAddress,
  )
}

export function getDateFromMessage(
  tx: TxMessage,
  validators: ValidatorDetailedInfo[],
): DecodedTxData {
  const decodedTxData: DecodedTxData = {
    type: '',
    time: new Date(tx.block.timestamp),
    fee: '0',
    amount: '0',
    block: tx.height,
    memo: tx.memo ? tx.memo : '<No Memo>',
    status: Number(tx.success),
    gasWanted: tx.gas_wanted,
    gasUsed: tx.gas_used,
    sender: tx.sender,
  }

  if (tx.messages && (tx.messages[0] as any)['msgs']) {
    const message = (tx.messages[0] as any)['msgs'][0]

    decodedTxData.type = humanizeMessageType(message['@type'])
    decodedTxData.fee = tx.fee[0]?.amount
    decodedTxData.feeDenom = tx?.fee[0]?.denom

    if ('amount' in message) {
      if (typeof message.amount === 'object') {
        if ('denom' in message.amount && 'amount' in message.amount) {
          decodedTxData.amount = message.amount?.amount
          decodedTxData.denom = message.amount?.denom
        } else {
          decodedTxData.amount = message.amount[0]?.amount
          decodedTxData.denom = message.amount[0]?.denom
        }
      }
    }

    if (decodedTxData.type === 'Vote') {
      if ('voter' in message) {
        decodedTxData.sender = message?.voter
      }
    }
    if (decodedTxData.type === 'Delegate') {
      if ('delegator_address' in message) {
        decodedTxData.sender = message?.delegator_address
      }
      if ('validator_address' in message) {
        const validator = getValidator(message?.validator_address, validators)

        if (validator && validator.moniker) {
          decodedTxData.receiver_name = validator.moniker
        }
        decodedTxData.receiver = message?.validator_address
      }
    }
    if (decodedTxData.type === 'Undelegate') {
      if ('delegator_address' in message) {
        decodedTxData.sender = message?.delegator_address
      }
      if ('validator_address' in message) {
        decodedTxData.receiver = ''
      }
    }
    if (decodedTxData.type === 'Send') {
      if ('fromAddress' in message) {
        decodedTxData.sender = message?.from_address
      }
      if ('toAddress' in message) {
        decodedTxData.receiver = message?.to_address
      }
    }
    if (decodedTxData.type === 'Withdraw') {
      if ('sender' in message) {
        decodedTxData.sender = message?.sender
      }
      if ('receiver' in message) {
        decodedTxData.receiver = message?.receiver
      }
    }
    if (decodedTxData.type === 'Withdraw delegator reward') {
      if ('delegator_address' in message) {
        decodedTxData.sender = message?.delegator_address
      }
      if ('validator_address' in message) {
        const validator = getValidator(message?.validator_address, validators)
        if (validator && validator.moniker) {
          decodedTxData.receiver_name = validator.moniker
        }
        decodedTxData.receiver = message?.validator_address
      }
    }
    if (decodedTxData.type === 'Withdraw validator commission') {
      if ('delegator_address' in message) {
        decodedTxData.sender = message?.delegator_address
      }
      if ('validator_address' in message) {
        const validator = getValidator(message?.validator_address, validators)
        if (validator && validator.moniker) {
          decodedTxData.receiver_name = validator.moniker
        }
        decodedTxData.receiver = message?.validator_address
      }
    }
    if (decodedTxData.type === 'Edit OracleScript') {
      if ('sender' in message) {
        decodedTxData.sender = message.sender
      }
    }
    if (decodedTxData.type === 'Edit Data Source') {
      if ('sender' in message) {
        decodedTxData.sender = message.sender
      }
    }
    if (decodedTxData.type === 'Edit Validator') {
      if ('delegator_address' in message) {
        decodedTxData.sender = message.delegator_address
      }
      if ('validator_address' in message) {
        const validator = getValidator(message?.validator_address, validators)
        if (validator && validator.moniker) {
          decodedTxData.receiver_name = validator.moniker
        }
        decodedTxData.receiver = message.validator_address
      }
    }
    if (decodedTxData.type === 'Begin Redelegate') {
      if ('delegator_address' in message) {
        decodedTxData.sender = message.delegator_address
      }
      if ('validatorDstAddress' in message) {
        decodedTxData.receiver = message.validatorDstAddress
      }
    }
    if (decodedTxData.type === 'IBC Transfer') {
      if ('sender' in message) {
        decodedTxData.sender = message.sender
      }
      if ('receiver' in message) {
        decodedTxData.receiver = message.receiver
      }
    }
    if (decodedTxData.type === 'Create Validator') {
      if ('delegator_address' in message) {
        decodedTxData.sender = message.delegator_address
      }
      if ('validator_address' in message) {
        const validator = getValidator(message?.validator_address, validators)
        if (validator && validator.moniker) {
          decodedTxData.receiver_name = validator.moniker
        }
        decodedTxData.receiver = message.validator_address
      }
    }
    if (decodedTxData.type === 'Submit Proposal') {
      if ('proposer' in message) {
        decodedTxData.sender = message.proposer
      }
      if ('initialDeposit' in message) {
        decodedTxData.amount = message.initialDeposit[0]?.amount
        decodedTxData.denom = message.initialDeposit[0]?.denom
      }
    }
    if (decodedTxData.type === 'Report Data') {
      if ('reporter' in message) {
        decodedTxData.sender = message.reporter
      }
      if ('validator' in message) {
        decodedTxData.receiver = message.validator
      }
    }
    if (decodedTxData.type === 'Request Data') {
      if ('sender' in message) {
        decodedTxData.sender = message.sender
      }
      if ('validator' in message) {
        decodedTxData.receiver = message.validator
      }
    }
    if (decodedTxData.type === 'Update IBC Client') {
      if ('signer' in message) {
        decodedTxData.sender = message.signer
      }
      if ('validator_address' in message) {
        const validator = getValidator(message?.validator_address, validators)
        if (validator && validator.moniker) {
          decodedTxData.receiver_name = validator.moniker
        }
        decodedTxData.receiver = message.validator_address
      }
    }
    if (decodedTxData.type === 'Create Oracle Script') {
      if ('sender' in message) {
        decodedTxData.sender = message.sender
      }
    }
    if (decodedTxData.type === 'Create Data Source') {
      if ('sender' in message) {
        decodedTxData.sender = message.sender
      }
    }
    if (decodedTxData.type === 'Create IBC Client') {
      if ('signer' in message) {
        decodedTxData.sender = message.signer
      }
    }
    if (decodedTxData.type === 'Connection Open Init') {
      if ('signer' in message) {
        decodedTxData.sender = message.signer
      }
    }
    if (decodedTxData.type === 'Create Vesting Account') {
      if ('fromAddress' in message) {
        decodedTxData.sender = message.fromAddress
      }
      if ('toAddress' in message) {
        decodedTxData.receiver = message.toAddress
      }
    }
    if (decodedTxData.type === 'Unjail') {
      if ('validatorAddr' in message) {
        decodedTxData.receiver = message.validatorAddr
      }
    }
    if (decodedTxData.type === 'Chanel Open Init') {
      if ('signer' in message) {
        decodedTxData.sender = message.signer
      }
    }
    if (decodedTxData.type === 'Activate') {
      if ('validator' in message) {
        decodedTxData.receiver = message.validator
      }
    }
    if (decodedTxData.type === 'Deposit') {
      if ('depositor' in message) {
        decodedTxData.receiver = message.depositor
      }
    }
    if (decodedTxData.type === 'Mint Coins') {
      if ('sender' in message) {
        decodedTxData.sender = message?.sender
      }
      if ('receiver' in message) {
        decodedTxData.receiver = message?.receiver
      }
    }

    if (decodedTxData.type === 'Fund Community Pool') {
      if ('depositor' in message) {
        decodedTxData.sender = message?.depositor
      }
    }

    if (decodedTxData.type === 'Remove Reporter') {
      if ('validator' in message) {
        decodedTxData.receiver = message.validator
      }
      if ('reporter' in message) {
        decodedTxData.sender = message.reporter
      }
    }

    if (decodedTxData.type === 'Store Code') {
      if ('sender' in message) {
        decodedTxData.sender = message.sender
      }
    }
  }
  return decodedTxData
}

const getTime = async (height: number): Promise<Date> => {
  const res = await callers.getBlock('', height)
  return parseISO(res.data.blockMetas[0].timestamp)
}

export async function getDateFromRPCMessage(
  tx: TxTelemetry,
  validators: ValidatorDetailedInfo[],
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
    const message = decodeRPCMessage(obj)
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
        .find(item => {
          DecodedTxData.type.toLowerCase().includes(item.type.split('_')[0])
        })
        ?.attributes?.map(item =>
          item.value ? new TextDecoder().decode(fromBase64(item.value)) : '',
        )

      DecodedTxData.amount = getLokiFromString(
        amount?.find((item: string) => item?.includes('loki')),
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
        const validator = getValidator(message?.validatorAddress, validators)
        if (validator && validator.moniker) {
          DecodedTxData.receiver_name = validator.moniker
        }

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
        const validator = getValidator(message?.validatorAddress, validators)
        if (validator && validator.moniker) {
          DecodedTxData.receiver_name = validator.moniker
        }
        DecodedTxData.receiver = message?.validatorAddress
      }
    }
    if (DecodedTxData.type === 'Withdraw validator commission') {
      if ('delegatorAddress' in message) {
        DecodedTxData.sender = message?.delegatorAddress
      }
      if ('validatorAddress' in message) {
        const validator = getValidator(message?.validatorAddress, validators)
        if (validator && validator?.moniker) {
          DecodedTxData.receiver_name = validator.moniker
        }
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
        const validator = getValidator(message?.validatorAddress, validators)
        if (validator && validator.moniker) {
          DecodedTxData.receiver_name = validator.moniker
        }
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
        const validator = getValidator(message?.validatorAddress, validators)
        if (validator && validator.moniker) {
          DecodedTxData.receiver_name = validator?.moniker
        }
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
        const validator = getValidator(message?.validatorAddress, validators)
        if (validator && validator.moniker) {
          DecodedTxData.receiver_name = validator.moniker
        }
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
  }
  return DecodedTxData
}

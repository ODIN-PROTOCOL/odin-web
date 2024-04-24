import {
  getDateFromMessage,
  getDateFromRPCMessage,
} from '@/helpers/decodeMessage'
import { toHex } from '@cosmjs/encoding'
import {
  DecodedTxData,
  IAttributesItem,
  IEventsItem,
  TxTelemetry,
} from '@/helpers/Types'
import { convertLokiToOdin } from './converters'
import { Transaction, ValidatorDetailedInfo } from '@/graphql/types/responses'
import { detect } from 'detect-browser'

export const isIos = (): boolean | null => {
  const res = detect()
  return res && res.os === 'iOS'
}

export const isAndroid = (): boolean | null => {
  const res = detect()
  return res && res.os === 'Android OS'
}

export const isMobile = (): boolean | null => {
  return isAndroid() || isIos()
}
export const toHexFunc: (data: Uint8Array) => string = toHex

export const copyValue = (text: string): void => {
  window.navigator.clipboard.writeText(text)
}

export const prepareRPCTransaction = async (
  txs: readonly TxTelemetry[],
  validators: ValidatorDetailedInfo[],
): Promise<Array<DecodedTxData>> => {
  let tempArr: Array<DecodedTxData> = []
  for (const tx of txs) {
    const {
      receiver,
      sender,
      type,
      amount,
      denom,
      time,
      fee,
      memo,
      status,
      gasUsed,
      gasWanted,
      receiver_name,
    } = await getDateFromRPCMessage(tx, validators)
    tempArr = [
      ...tempArr,
      {
        type: type ? type : '-',
        hash: tx.hash ? tx.hash.toLowerCase() : '-',
        block: tx.height ? tx.height : '-',
        time: time,
        sender: sender ? sender : '',
        receiver: receiver ? receiver : '',
        receiver_name: receiver_name ? receiver_name : '',
        amount: convertLokiToOdin(String(amount), { withDenom: true }, denom),
        fee: convertLokiToOdin(String(fee), { onlyNumber: true, toFixed: 2 }),
        memo: memo ? memo : '-',
        status: Number(status) > -1 ? 'Success' : 'Failed',
        gasUsed: gasUsed ? gasUsed : '-',
        gasWanted: gasWanted ? gasWanted : '-',
      },
    ]
  }
  return tempArr
}

export const prepareTransaction = (
  txs: readonly Transaction[],
  validators: ValidatorDetailedInfo[],
): Array<DecodedTxData> => {
  let tempArr: Array<DecodedTxData> = []
  for (const tx of txs) {
    const {
      receiver,
      sender,
      type,
      amount,
      denom,
      time,
      fee,
      memo,
      status,
      gasUsed,
      gasWanted,
      receiver_name,
    } = getDateFromMessage(tx, validators)
    tempArr = [
      ...tempArr,
      {
        type: type ? type : '-',
        hash: tx.hash ? tx.hash.toLowerCase() : '-',
        block: tx.height ? tx.height : '-',
        time: time,
        sender: sender ? sender : '',
        receiver: receiver ? receiver : '',
        receiver_name: receiver_name ? receiver_name : '',
        amount: convertLokiToOdin(String(amount), { withDenom: true }, denom),
        fee: convertLokiToOdin(String(fee), { onlyNumber: true, toFixed: 2 }),
        memo: memo ? memo : '-',
        status: Number(status) > -1 ? 'Success' : 'Failed',
        gasUsed: gasUsed ? gasUsed : '-',
        gasWanted: gasWanted ? gasWanted : '-',
      },
    ]
  }
  return tempArr
}

const LOKI_STRING_LENGTH = 4

export const parseLogsToGetRewardsAmount = (
  eventType: string,
  logs: string | undefined,
): string | null => {
  if (!logs) return null
  try {
    const logsObj = JSON.parse(logs)
    const amount = logsObj[0].events
      .find((item: IEventsItem) => item.type === eventType)
      .attributes.find((item: IAttributesItem) => item.key === 'amount')

    return amount.value.slice(0, amount.value.length - LOKI_STRING_LENGTH)
  } catch (error) {
    return null
  }
}

export enum TYPE_TX_SORT {
  all = '%%',
  delegate = 'cosmos.staking.v1beta1.MsgDelegate',
  send = 'cosmos.bank.v1beta1.MsgSend',
  withdraw = 'cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
}

export const sortingTypeTx = [
  {
    text: 'All',
    value: TYPE_TX_SORT.all,
  },
  {
    text: 'Delegated',
    value: TYPE_TX_SORT.delegate,
  },
  {
    text: 'Send',
    value: TYPE_TX_SORT.send,
  },
  {
    text: 'Withdraw',
    value: TYPE_TX_SORT.withdraw,
  },
]

export enum TYPE_ACCOUNTS_SORT {
  odinBalance = 'loki',
  txs = 'txs',
  delegations = 'delegations',
  totalAmount = 'total_amount',
}

export const sortingTypeAccounts = [
  {
    text: 'Total Amount',
    value: TYPE_ACCOUNTS_SORT.totalAmount,
  },
  {
    text: 'ODIN Balance',
    value: TYPE_ACCOUNTS_SORT.odinBalance,
  },
  {
    text: 'Delegated Amount',
    value: TYPE_ACCOUNTS_SORT.delegations,
  },
  {
    text: 'Transaction Count',
    value: TYPE_ACCOUNTS_SORT.txs,
  },
]

export const sortingDaysForChart = {
  lastDay: {
    text: 'Last day',
    value: '1',
  },
  lastWeek: {
    text: 'Last week',
    value: '7',
  },
  lastTwoWeek: {
    text: 'Last 14 days',
    value: '14',
  },
  lastMonth: {
    text: 'Last month',
    value: '31',
  },
  lastYear: {
    text: 'Last year',
    value: '365',
  },
}

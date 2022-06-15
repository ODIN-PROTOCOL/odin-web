import { getDateFromMessage } from '@/helpers/decodeMessage'
import { toHex } from '@cosmjs/encoding'
import { adjustedData, IAttributesItem, IEventsItem } from '@/helpers/Types'
import { convertLokiToOdin } from './converters'
import { TxTelemetry } from '@/helpers/Types'
import { formatDate } from '@/helpers/formatters'
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

export const prepareTransaction = async (
  txs: readonly TxTelemetry[]
): Promise<Array<adjustedData>> => {
  let tempArr: Array<adjustedData> = []
  for (const tx of txs) {
    const {
      receiver,
      sender,
      type,
      amount,
      time,
      fee,
      memo,
      status,
      gasUsed,
      gasWanted,
    } = await getDateFromMessage(tx)
    tempArr = [
      ...tempArr,
      {
        type: type ? type : '-',
        hash: tx.hash ? tx.hash.toLowerCase() : '-',
        block: tx.height ? tx.height : '-',
        time: time ? formatDate(Number(time), 'HH:mm dd.MM.yy') : '-',
        sender: sender ? sender : '',
        receiver: receiver ? receiver : '',
        amount: convertLokiToOdin(amount),
        fee: convertLokiToOdin(fee),
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
  logs: string | undefined
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
export enum VALIDATOR_STATUS_TYPE {
  inactive = 'inactive',
  success = 'success',
  error = 'error',
}

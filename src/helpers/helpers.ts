import { getDateFromMessage } from '@/helpers/decodeMessage'
import { toHex } from '@cosmjs/encoding'
import { adjustedData, IAttributesItem, IEventsItem } from '@/helpers/Types'
import { TxResponse } from '@cosmjs/tendermint-rpc/build/tendermint34/responses'
import { convertLokiToOdin } from './converters'

export const _allowedTypes = [
  'Send',
  'Receive',
  'Report',
  'Request',
  'Delegate',
  'Undelegate',
  'Redelegate',
  'Withdraw',
]

export const toHexFunc: (data: Uint8Array) => string = toHex

export const copyValue = (text: string): void => {
  window.navigator.clipboard.writeText(text)
}

export const prepareTransaction = async (
  txs: readonly TxResponse[]
): Promise<Array<adjustedData>> => {
  const transformedTxs = await Promise.all(
    txs.map(async (item) => {
      const { receiver, sender, type, amount, time, fee } =
        await getDateFromMessage(item)

      const odinAmount = convertLokiToOdin(amount, { withDenom: true })
      const odinFee = convertLokiToOdin(fee, { withDenom: true })
      return {
        type: type ? type : '-',
        hash: item.hash ? toHexFunc(item.hash) : '-',
        block: item.height ? item.height : '-',
        time: time ? time : null,
        sender: sender ? sender : '',
        receiver: receiver ? receiver : '',
        amount: amount ? String(odinAmount) : '',
        fee: fee ? String(odinFee) : '-',
      }
    })
  )
  return transformedTxs.filter((item) => _allowedTypes.includes(item.type))
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

import { getDateFromMessage } from '@/helpers/decodeMessage'
import { toHex } from '@cosmjs/encoding'
import { adjustedData } from '@/helpers/Types'
import { TxResponse } from '@cosmjs/tendermint-rpc/build/tendermint34/responses'

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
      return {
        type: type ? type : '-',
        hash: item.hash ? toHexFunc(item.hash) : '-',
        block: item.height ? item.height : '-',
        time: time ? time : null,
        sender: sender ? sender : '',
        receiver: receiver ? receiver : '',
        amount: amount ? amount : '',
        fee: fee ? fee : '-',
      }
    })
  )
  return transformedTxs.filter((item) => _allowedTypes.includes(item.type))
}

import { BlockMeta } from '@cosmjs/tendermint-rpc'
import { toHex } from '@cosmjs/encoding'
import { callers } from '@/api/callers'
import { TransformedBlocks } from '@/helpers/Types'

export const prepareBlocks = async (
  blocks: readonly BlockMeta[],
): Promise<TransformedBlocks[]> => {
  const transformedBlocks = await Promise.all(
    blocks.map(async (item: BlockMeta) => {
      const addData = await callers.getBlock(item.header.height)
      const validatorData = await callers.getValidatorByConsensusKey(
        toHex(item.header.proposerAddress),
      )
      return {
        ...item,
        validator: validatorData.data.result.result.operator_address,
        txs: addData.block.txs.length,
      }
    }),
  )

  return transformedBlocks
}

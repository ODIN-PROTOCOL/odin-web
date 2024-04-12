import {
  BlockInfo,
  ValidatorDetailedInfo,
  TransformedBlockInfo,
} from '@/graphql/types/responses'

export const prepareBlockMetas = (
  blocks: readonly BlockInfo[],
  validators: readonly ValidatorDetailedInfo[],
): TransformedBlockInfo[] => {
  return blocks.map((item: BlockInfo) => {
    return {
      ...item,
      validatorDetails:
        validators.find(
          v =>
            v.validator.validator_info.operator_address ===
            item.validator.validator_info.operator_address,
        ) || null,
    }
  })
}

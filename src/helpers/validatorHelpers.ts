import { big } from '@/helpers/bigMath'
import { callers } from '@/api/callers'
import { ValidatorDecoded } from './validatorDecoders'

export enum VALIDATOR_STATUS {
  inactive = 1,
  bounding = 2,
  active = 3,
}

export const isActiveValidator = async (
  validatorAddress: string
): Promise<boolean> => {
  const response = await callers
    .getValidatorStatus(validatorAddress)
    .then((req) => req.status?.isActive)
  return Boolean(response)
}

const _sortValidatorsByDelegated = (
  validators: ValidatorDecoded[]
): ValidatorDecoded[] => {
  return validators.sort((a, b) => {
    return (
      Number(big.fromPrecise(b.delegatorShares)) -
      Number(big.fromPrecise(a.delegatorShares))
    )
  })
}

export const getTransformedValidators = async (
  validators: ValidatorDecoded[]
): Promise<ValidatorDecoded[]> => {
  const _validators = _sortValidatorsByDelegated(validators)
  const transformedValidators = await Promise.all(
    _validators.map(async (item, idx) => {
      return {
        ...item,
        rank: idx + 1,
      }
    })
  )

  return transformedValidators
}

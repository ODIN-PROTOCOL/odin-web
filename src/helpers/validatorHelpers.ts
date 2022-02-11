import { bigMath } from '@/helpers/bigMath'
import { callers } from '@/api/callers'
import { ValidatorDecoded } from './validatorDecoders'

export const isOracleValidator = async (
  validatorAddress: string
): Promise<boolean> => {
  const response = await callers.getReports(validatorAddress)
  return response.reporter.length ? true : false
}

export const isActiveValidator = async (
  validatorAddress: string
): Promise<boolean> => {
  const response = await callers.getValidatorStatus(validatorAddress)
  return response.status?.isActive ? true : false
}

const _sortValidatorsByDelegated = (
  validators: ValidatorDecoded[]
): ValidatorDecoded[] => {
  return validators.sort((a, b) => {
    return (
      Number(bigMath.fromPrecise(b.delegatorShares)) -
      Number(bigMath.fromPrecise(a.delegatorShares))
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
        isOracleValidator: await isOracleValidator(item.operatorAddress),
      }
    })
  )

  return transformedValidators
}

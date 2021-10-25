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

export const getTransformedValidators = async (
  validators: ValidatorDecoded[]
): Promise<ValidatorDecoded[]> => {
  const transformedValidators = await Promise.all(
    validators.map(async (item, idx) => {
      return {
        ...item,
        rank: idx + 1,
        isOracleValidator: await isOracleValidator(item.operatorAddress),
      }
    })
  )

  return transformedValidators
}

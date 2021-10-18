import { callers } from '@/api/callers'

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

import { OdinApiBroadcastError } from '@/api/api'
import { notifyError } from './notifications'

export function handleError(error: Error): void {
  if (error instanceof OdinApiBroadcastError) {
    _handleBroadcastError(error)
  } else {
    console.error(error)
    notifyError(error.message)
  }
}

function _handleBroadcastError(error: OdinApiBroadcastError): void {
  console.error(error)
  notifyError(error.message)
}
export const STAKE_TRANSFER_WARNING_VALUE =
  'Redelegation to this validator already in progress. First redelegation to this validator must complete before next redelegation'

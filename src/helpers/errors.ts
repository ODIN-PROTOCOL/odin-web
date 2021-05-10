import { BroadcastError } from '@/api/callers/signAndBroadcast'
import { notifyError } from './notifications'

export function handleError(error: Error): void {
  if (error instanceof BroadcastError) {
    _handleBroadcastError(error)
  } else {
    console.error(error)
    notifyError(error.message)
  }
}

function _handleBroadcastError(error: BroadcastError): void {
  console.error(error)
  notifyError(error.message)
}

import { BroadcastError } from '@/api/callers/signAndBroadcast'

export function showError(error: Error): void {
  if (error instanceof BroadcastError) {
    _showBroadcastError(error)
  } else {
    console.error(error)
  }
}

function _showBroadcastError(error: BroadcastError): void {
  console.error(error)
}

import { BroadcastError } from '@/api/callers/signAndBroadcast'

export function handleError(error: Error): void {
  if (error instanceof BroadcastError) {
    _handleBroadcastError(error)
  } else {
    console.error(error)
  }
}

function _handleBroadcastError(error: BroadcastError): void {
  console.error(error)
}

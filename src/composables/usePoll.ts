import { AnyFn } from '@/shared-types'

export interface PollControls {
  start: () => void
  stop: () => void
}

export function usePoll(cb: AnyFn, interval: number): PollControls {
  let _intId = -1
  let _timesStarted = 0

  const start = (): void => {
    if (_intId === -1) _intId = setInterval(cb, interval)
    _timesStarted += 1
  }

  const stop = (): void => {
    if (_intId !== -1 && (_timesStarted -= 1) <= 0) {
      clearInterval(_intId)
      _intId = -1
    }
  }

  return { start, stop }
}

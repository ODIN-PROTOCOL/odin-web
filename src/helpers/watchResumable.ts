import { watch, WatchStopHandle } from 'vue'

export interface ResumableWatcher {
  stop(): void
  resume(): void
  getStopper: WatchStopHandle
}

export function watchResumable(
  ...watchArgs: Parameters<typeof watch>
): ResumableWatcher {
  let _stopper: WatchStopHandle
  const stop = () => _stopper()
  const resume = () => (_stopper = watch(...watchArgs))
  const getStopper = () => _stopper
  resume()
  return { stop, resume, getStopper }
}

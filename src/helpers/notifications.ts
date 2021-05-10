import { notify } from '@kyvg/vue3-notification'

const DURATION = 7000

export function notifySuccess(text: string): void {
  notify({
    text,
    type: 'success',
    duration: DURATION,
  })
}

export function notifyError(text: string): void {
  notify({
    text,
    type: 'error',
    duration: DURATION,
  })
}

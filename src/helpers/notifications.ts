import { notify } from '@kyvg/vue3-notification'

const DURATION = 7000

export function notifySuccess(text: string): void {
  notify({
    text,
    type: 'success',
    title: 'Success',
    ignoreDuplicates: true,
    duration: DURATION,
  })
}

export function notifyError(text: string): void {
  notify({
    text,
    type: 'error',
    title: 'Failed',
    ignoreDuplicates: true,
    duration: DURATION,
  })
}
export function notifyInfo(text: string): void {
  notify({
    text,
    type: 'warn',
    title: 'Info',
    ignoreDuplicates: true,
    duration: DURATION,
  })
}

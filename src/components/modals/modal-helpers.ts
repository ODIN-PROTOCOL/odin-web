import { DialogEventHandler } from '@/helpers/dialogs'
import { inject } from 'vue'

export function injectDialogHandler(name: string): DialogEventHandler {
  return inject(name) || (() => console.warn(`Missing ${name} handler`))
}

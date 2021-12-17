import { DialogHandler, dialogs } from '@/helpers/dialogs'

import MetaMaskErrorModal from '@/components/MetaMask/MetaMaskErrorModal.vue'

export function showMetaMaskErrorModal(
  callbacks?: {
    onSubmit?: DialogHandler
    onClose?: DialogHandler
  },
  props?: {
    message: string | null | undefined
  }
): Promise<unknown | null> {
  return dialogs.show(MetaMaskErrorModal, callbacks, { props })
}

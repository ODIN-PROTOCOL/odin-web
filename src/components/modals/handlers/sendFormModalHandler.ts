import { DialogHandler, dialogs } from '@/helpers/dialogs'
import { Coin } from '@cosmjs/amino'
import { WalletRate } from '@/helpers/Types'

import SendFormModal from '@/components/modals/SendFormModal.vue'

export function showSendFormModal(
  callbacks: {
    onSubmit?: DialogHandler
    onClose?: DialogHandler
  },
  props?: {
    rate?: WalletRate
    balance?: Coin[]
  }
): Promise<unknown | null> {
  return dialogs.show(SendFormModal, callbacks, { props })
}

import { DialogHandler, dialogs } from '@/helpers/dialogs'
import { QueryRateResponse } from '@provider/codec/coinswap/query'

import WalletExchangeFormModal from '@/components/modals/WalletExchangeFormModal.vue'

export function showWalletExchangeFormModal(
  callbacks?: {
    onSubmit?: DialogHandler
    onClose?: DialogHandler
  },
  props?: {
    lokiToOdinRate: QueryRateResponse
  }
): Promise<unknown | null> {
  return dialogs.show(WalletExchangeFormModal, callbacks, { props })
}

import { DialogHandler, dialogs } from '@/helpers/dialogs'

import ExchangeFormModal from '@/components/modals/ExchangeFormModal.vue'

export function showExchangeFormModal(callbacks?: {
  onSubmit?: DialogHandler
  onClose?: DialogHandler
}): Promise<unknown | null> {
  return dialogs.show(ExchangeFormModal, callbacks)
}

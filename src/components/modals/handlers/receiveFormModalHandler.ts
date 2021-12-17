import { DialogHandler, dialogs } from '@/helpers/dialogs'

import ReceiveFormModal from '@/components/modals/ReceiveFormModal.vue'

export function showReceiveFormModal(callbacks: {
  onSubmit?: DialogHandler
  onClose?: DialogHandler
}): Promise<unknown | null> {
  return dialogs.show(ReceiveFormModal, callbacks)
}

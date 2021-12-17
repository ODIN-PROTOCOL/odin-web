import { DialogHandler, dialogs } from '@/helpers/dialogs'

import FaucetFormModal from '@/components/modals/FaucetFormModal.vue'

export function showFaucetFormModal(callbacks?: {
  onSubmit?: DialogHandler
  onClose?: DialogHandler
}): Promise<unknown | null> {
  return dialogs.show(FaucetFormModal, callbacks)
}

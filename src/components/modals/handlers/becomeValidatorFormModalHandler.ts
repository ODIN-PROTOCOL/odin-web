import { DialogHandler, dialogs } from '@/helpers/dialogs'

import BecomeValidatorFormModal from '@/components/modals/BecomeValidatorFormModal.vue'

export function showBecomeValidatorFormModal(callbacks: {
  onSubmit?: DialogHandler
  onClose?: DialogHandler
}): Promise<unknown | null> {
  return dialogs.show(BecomeValidatorFormModal, callbacks)
}

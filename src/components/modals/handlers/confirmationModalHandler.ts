import { DialogHandler, dialogs } from '@/helpers/dialogs'

import ConfirmationModal from '@/components/modals/ConfirmationModal.vue'

export function showConfirmationModal(
  callbacks: {
    onSubmit?: DialogHandler
    onClose?: DialogHandler
  },
  props: { text: string }
): Promise<unknown | null> {
  return dialogs.show(ConfirmationModal, callbacks, { props })
}

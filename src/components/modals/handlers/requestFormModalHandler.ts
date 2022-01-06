import { DialogHandler, dialogs } from '@/helpers/dialogs'

import RequestFormModal from '@/components/modals/RequestFormModal.vue'

export function showRequestFormModal(
  callbacks: {
    onSubmit?: DialogHandler
    onClose?: DialogHandler
  },
  props: { maxAskCount: number }
): Promise<unknown | null> {
  return dialogs.show(RequestFormModal, callbacks, { props })
}

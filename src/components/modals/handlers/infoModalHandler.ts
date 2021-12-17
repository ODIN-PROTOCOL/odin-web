import { DialogHandler, dialogs } from '@/helpers/dialogs'

import InfoModal from '@/components/modals/InfoModal.vue'

export function showInfoModal(
  callbacks: {
    onClose?: DialogHandler
  },
  props?: {
    title: string
    text: string
  }
): Promise<unknown | null> {
  return dialogs.show(InfoModal, callbacks, { props })
}

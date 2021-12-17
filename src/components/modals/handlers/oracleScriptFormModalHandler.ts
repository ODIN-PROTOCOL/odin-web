import { DialogHandler, dialogs } from '@/helpers/dialogs'

import OracleScriptFormModal from '@/components/modals/OracleScriptFormModal.vue'

export function showOracleScriptFormModal(callbacks: {
  onSubmit?: DialogHandler
  onClose?: DialogHandler
}): Promise<unknown | null> {
  return dialogs.show(OracleScriptFormModal, callbacks)
}

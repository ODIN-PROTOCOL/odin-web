import { DialogHandler, dialogs } from '@/helpers/dialogs'
import { ProposalChanges } from '@/helpers/Types'

import ProposalFormModal from '@/components/modals/ProposalFormModal.vue'

export function showProposalFormModal(
  callbacks: {
    onSubmit?: DialogHandler
    onClose?: DialogHandler
  },
  props?: { proposalChanges?: ProposalChanges }
): Promise<unknown | null> {
  return dialogs.show(ProposalFormModal, callbacks, { props })
}

import { DialogHandler, dialogs } from '@/helpers/dialogs'
import { ValidatorDecoded } from '@/helpers/validatorDecoders'

import WithdrawRewardsFormModal from '@/components/modals/WithdrawRewardsFormModal.vue'

export function showWithdrawRewardsFormModal(
  callbacks: {
    onSubmit?: DialogHandler
    onClose?: DialogHandler
  },
  props: { validator: ValidatorDecoded }
): Promise<unknown | null> {
  return dialogs.show(WithdrawRewardsFormModal, callbacks, { props })
}

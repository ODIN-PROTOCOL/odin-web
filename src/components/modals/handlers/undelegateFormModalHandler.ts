import { DialogHandler, dialogs } from '@/helpers/dialogs'
import { ValidatorDecoded } from '@/helpers/validatorDecoders'
import { DelegationResponse } from '@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/staking'

import UndelegateFormModal from '@/components/modals/UndelegateFormModal.vue'

export function showUndelegateFormModal(
  callbacks: {
    onSubmit?: DialogHandler
    onClose?: DialogHandler
  },
  props: { validator: ValidatorDecoded; delegation: DelegationResponse }
): Promise<unknown | null> {
  return dialogs.show(UndelegateFormModal, callbacks, { props })
}

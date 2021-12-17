import { DialogHandler, dialogs } from '@/helpers/dialogs'
import { ValidatorDecoded } from '@/helpers/validatorDecoders'
import { DelegationResponse } from '@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/staking'

import DelegateFormModal from '@/components/modals/DelegateFormModal.vue'

export function showDelegateFormModal(
  callbacks: {
    onSubmit?: DialogHandler
    onClose?: DialogHandler
  },
  props: { validator: ValidatorDecoded; delegation?: DelegationResponse }
): Promise<unknown | null> {
  return dialogs.show(DelegateFormModal, callbacks, { props })
}

import { DialogHandler, dialogs } from '@/helpers/dialogs'
import { QueryRateResponse } from '@provider/codec/coinswap/query'
import { Coin } from '@provider/codec/cosmos/base/v1beta1/coin'

import MetaMaskModal from '@/components/MetaMask/MetaMaskModal.vue'

export function showMetaMaskModal(
  callbacks?: {
    onSubmit?: DialogHandler
    onClose?: DialogHandler
  },
  props?: {
    maxWithdrawalPerTime: Coin
    odinToLokiRate: QueryRateResponse
    burnFee: number | string | undefined | null
  }
): Promise<unknown | null> {
  return dialogs.show(MetaMaskModal, callbacks, { props })
}

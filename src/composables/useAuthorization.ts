import { api } from '@/api/api'
import { WalletTypes, OdinWallet, wallet } from '@/api/wallet'
import { storage } from '@/helpers/storage'
import { readonly, ref } from 'vue'
import { useBalances } from './useBalances'
import { CHAIN_CONFIG } from '@/api/api-config'

const _isLoggedIn = ref<boolean>(false)
const isLoggedInReadonly = readonly(_isLoggedIn)

async function createSession(authData: {
  walletType: WalletTypes
  key: string
}): Promise<OdinWallet> {
  if (authData.walletType === WalletTypes.ODIN_WALLET) {
    await _createSessionWithOdinWallet(authData.key)
  } else if (authData.walletType === WalletTypes.KEPLR_WALLET) {
    await _createSessionWithKeplrWallet(authData.key)
  }
  return wallet
}

function destroySession(): void {
  wallet.clear()
  api.detachWallet()
  useBalances().clear()

  _isLoggedIn.value = false
  storage.remove('mnemonic')
  storage.remove('chainId')
}

export async function tryRestoreSession(): Promise<OdinWallet | null> {
  const mnemonic = storage.get('mnemonic')
  const chainId = storage.get('chainId')
  if (!mnemonic && !chainId) return null

  try {
    if (mnemonic) {
      return createSession({
        walletType: WalletTypes.ODIN_WALLET,
        key: mnemonic,
      })
    } else {
      return createSession({
        walletType: WalletTypes.KEPLR_WALLET,
        key: chainId as string,
      })
    }
  } catch (error) {
    return null
  }
}

async function _createSessionWithOdinWallet(mnemonic: string) {
  await wallet.init({
    type: WalletTypes.ODIN_WALLET,
    key: mnemonic,
  })

  await Promise.all([api.attachWallet(wallet), useBalances().load()])

  _isLoggedIn.value = true
  storage.set('mnemonic', mnemonic)
}

async function _createSessionWithKeplrWallet(chainId: string) {
  if (window.keplr == null) {
    throw new ReferenceError('Please install the Keplr extension')
  } else {
    if (window.keplr.experimentalSuggestChain) {
      try {
        await window.keplr.experimentalSuggestChain(CHAIN_CONFIG)
      } catch {
        throw new ReferenceError('Failed to suggest the chain')
      }
    } else {
      throw new ReferenceError(
        'Please use the recent version of keplr extension'
      )
    }

    try {
      await window.keplr.enable(chainId)
      await wallet.init({
        type: WalletTypes.KEPLR_WALLET,
        key: chainId,
      })
      await Promise.all([api.attachWallet(wallet), useBalances().load()])
      _isLoggedIn.value = true
      storage.set('chainId', chainId)
    } catch (err) {
      throw new ReferenceError((err as Error).message)
    }
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useAuthorization() {
  return {
    isLoggedIn: isLoggedInReadonly,
    logIn: createSession,
    logOut: destroySession,
    tryRestoreSession,
  }
}

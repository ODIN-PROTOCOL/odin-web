import { api } from '@/api/api'
import { OdinWallet, wallet } from '@/api/wallet'
import { storage } from '@/helpers/storage'
import { readonly, ref } from 'vue'
import { useBalances } from './useBalances'
import { CHAIN_CONFIG } from '@/api/api-config'

export enum authMethod {
  LOGIN_WITH_KEPLR_WALLET,
  LOGIN_WITH_ODIN_WALLET,
}

const _isLoggedIn = ref<boolean>(false)
const isLoggedInReadonly = readonly(_isLoggedIn)

async function createSession(authData: {
  type: authMethod
  key: string
}): Promise<OdinWallet> {
  if (authData.type === authMethod.LOGIN_WITH_ODIN_WALLET) {
    await wallet.init({
      type: 'odinWallet',
      key: authData.key,
    })

    await Promise.all([api.attachWallet(wallet), useBalances().load()])

    _isLoggedIn.value = true
    storage.set('mnemonic', authData.key)
  } else if (authData.type === authMethod.LOGIN_WITH_KEPLR_WALLET) {
    if (window.keplr == null) {
      throw new ReferenceError('Install Keplr extension')
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
        await window.keplr.enable(authData.key)
        await wallet.init({
          type: 'keplrWallet',
          key: authData.key,
        })

        await Promise.all([api.attachWallet(wallet), useBalances().load()])

        _isLoggedIn.value = true
        storage.set('chainId', authData.key)
      } catch (err) {
        throw new ReferenceError((err as Error).message)
      }
    }
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
        type: authMethod.LOGIN_WITH_ODIN_WALLET,
        key: mnemonic,
      })
    } else {
      return createSession({
        type: authMethod.LOGIN_WITH_KEPLR_WALLET,
        key: chainId as string,
      })
    }
  } catch (error) {
    return null
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

import { api } from '@/api/api'
import { OdinWallet, wallet } from '@/api/wallet'
import { storage } from '@/helpers/storage'
import { readonly, ref } from 'vue'
import { useBalances } from './useBalances'

const _isLoggedIn = ref<boolean>(false)
const isLoggedInReadonly = readonly(_isLoggedIn)

async function createSession(mnemonic: string): Promise<OdinWallet> {
  await wallet.init(mnemonic)

  await Promise.all([api.attachWallet(wallet), useBalances().load()])

  _isLoggedIn.value = true
  storage.set('mnemonic', mnemonic)

  return wallet
}

function destroySession(): void {
  wallet.clear()
  api.detachWallet()
  useBalances().clear()

  _isLoggedIn.value = false
  storage.remove('mnemonic')
}

export async function tryRestoreSession(): Promise<OdinWallet | null> {
  const mnemonic = storage.get('mnemonic')
  if (!mnemonic) return null

  try {
    return createSession(mnemonic)
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

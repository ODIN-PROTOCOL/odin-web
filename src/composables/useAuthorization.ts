import { api } from '@/api/api'
import { OdinWallet, wallet } from '@/api/wallet'
import { storage } from '@/helpers/storage'
import { DeepReadonly, readonly, Ref, ref } from 'vue'

const _isLoggedIn = ref<boolean>(false)
const isLoggedInReadonly = readonly(_isLoggedIn)

async function logIn(mnemonic: string): Promise<OdinWallet | null> {
  await wallet.init(mnemonic)
  if (wallet.isEmpty) return null

  await api.attachWallet(wallet)

  _isLoggedIn.value = true
  storage.set('mnemonic', mnemonic)

  return wallet
}

function logOut(): void {
  wallet.clear()
  api.detachWallet()

  _isLoggedIn.value = false
  storage.remove('mnemonic')
}

export async function tryRestoreSession(): Promise<OdinWallet | null> {
  const mnemonic = storage.get('mnemonic')
  if (!mnemonic) return null

  try {
    return logIn(mnemonic)
  } catch (error) {
    return null
  }
}

export function useAuthorization(): {
  isLoggedIn: DeepReadonly<Ref<boolean>>
  logIn: (mnemonic: string) => Promise<OdinWallet | null>
  logOut: () => void
  tryRestoreSession: () => Promise<OdinWallet | null>
} {
  return {
    isLoggedIn: isLoggedInReadonly,
    logIn,
    logOut,
    tryRestoreSession,
  }
}

import {
  clearSigningStargateClient,
  initSigningStargateClient,
} from '@/api/client/signingStargateClient'
import {
  clearTendermintClient,
  initTendermintClient,
} from '@/api/client/tendermintClient'
import { clearWallet, initWallet, Wallet } from '@/api/client/wallet'
import { fromStorage, removeStorageItem, toStorage } from '@/helpers/storage'
import { DeepReadonly, readonly, Ref, ref } from 'vue'

const _isLoggedIn = ref<boolean>(false)
const isLoggedInReadonly = readonly(_isLoggedIn)

async function logIn(mnemonic: string): Promise<Wallet | null> {
  const [wallet] = await initWallet(mnemonic)
  if (!wallet) return null

  await initTendermintClient()
  await initSigningStargateClient(wallet)

  _isLoggedIn.value = true
  toStorage('mnemonic', mnemonic)

  return wallet
}

function logOut(): void {
  clearWallet()
  clearTendermintClient()
  clearSigningStargateClient()

  _isLoggedIn.value = false
  removeStorageItem('mnemonic')
}

async function tryRestoreSession(): Promise<Wallet | null> {
  const mnemonic = fromStorage('mnemonic')
  if (!mnemonic) return null

  try {
    return logIn(mnemonic)
  } catch (error) {
    return null
  }
}

export function useAuthorization(): {
  isLoggedIn: DeepReadonly<Ref<boolean>>
  logIn: (mnemonic: string) => Promise<Wallet | null>
  logOut: () => void
  tryRestoreSession: () => Promise<Wallet | null>
} {
  return {
    isLoggedIn: isLoggedInReadonly,
    logIn,
    logOut,
    tryRestoreSession,
  }
}

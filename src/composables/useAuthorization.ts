import { api } from '@/api/api'
import { WalletTypes, OdinWallet, wallet } from '@/api/wallet'
import { storage } from '@/helpers/storage'
import { readonly, ref } from 'vue'
import { useBalances } from './useBalances'
import { CHAIN_CONFIG, COINS_TYPE } from '@/api/api-config'
const _isLoggedIn = ref<boolean>(false)
const isLoggedInReadonly = readonly(_isLoggedIn)

async function createSessionWithOdinWallet(
  mnemonic: string,
): Promise<OdinWallet> {
  await wallet.init({
    type: WalletTypes.ODIN_WALLET,
    key: mnemonic,
  })

  await Promise.all([api.attachWallet(wallet), useBalances().load()])

  _isLoggedIn.value = true
  storage.set('mnemonic', mnemonic)

  return wallet
}

async function createSessionWithKeplrWallet(
  chainId: string,
  coinType: COINS_TYPE,
): Promise<OdinWallet> {
  if (window.keplr == null) {
    throw new ReferenceError(
      'Please install the Keplr extension in your browser.',
    )
  } else {
    if (window.keplr.experimentalSuggestChain) {
      try {
        await window.keplr.experimentalSuggestChain({
          ...CHAIN_CONFIG,
          bip44: { coinType },
        })
      } catch {
        throw new ReferenceError(
          'Something went wrong. Failed to suggest chain.',
        )
      }
    } else {
      throw new ReferenceError(
        'Something went wrong. Please use the recent version of Keplr extension.',
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
      storage.set('coinType', coinType.toString())
    } catch (err) {
      throw new ReferenceError((err as Error).message)
    }
  }

  return wallet
}
async function createSessionWithCosmostationWallet(
  chainId: string,
  coinType: COINS_TYPE,
): Promise<OdinWallet> {
  if (!window?.cosmostation?.providers?.keplr) {
    throw new ReferenceError(
      'Please install the cosmostation extension in your browser.',
    )
  } else {
    if (
      typeof window?.cosmostation?.providers?.keplr
        ?.experimentalSuggestChain === 'function'
    ) {
      try {
        await window?.cosmostation?.providers?.keplr?.experimentalSuggestChain({
          ...CHAIN_CONFIG,
          bip44: { coinType },
        })
      } catch {
        throw new ReferenceError(
          'Something went wrong. Failed to suggest chain.',
        )
      }
    } else {
      throw new ReferenceError(
        'Something went wrong. Please use the recent version of Keplr extension.',
      )
    }

    try {
      await window.cosmostation.providers.keplr.enable(chainId)
      await wallet.init({
        type: WalletTypes.COSMOSTATION_WALLET,
        key: chainId,
      })
      await Promise.all([api.attachWallet(wallet), useBalances().load()])
      _isLoggedIn.value = true
      storage.set('chainId', chainId)
      storage.set('coinType', coinType.toString())
    } catch (err) {
      throw new ReferenceError((err as Error).message)
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
  storage.remove('coinType')
}

export async function tryRestoreSession(): Promise<OdinWallet | null> {
  const mnemonic = storage.get('mnemonic')
  const chainId = storage.get('chainId')
  const coinType = storage.get('coinType')
  if (!mnemonic && !chainId) return null

  try {
    if (mnemonic) {
      return createSessionWithOdinWallet(mnemonic)
    } else if (chainId) {
      return createSessionWithKeplrWallet(chainId, Number(coinType))
    } else {
      return null
    }
  } catch (error) {
    return null
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useAuthorization() {
  return {
    isLoggedIn: isLoggedInReadonly,
    logInWithOdinWallet: createSessionWithOdinWallet,
    logInWithKeplrWallet: createSessionWithKeplrWallet,
    logInWithCosmostation: createSessionWithCosmostationWallet,
    logOut: destroySession,
    tryRestoreSession,
  }
}

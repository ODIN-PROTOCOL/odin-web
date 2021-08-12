/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, watch } from 'vue'
import Web3 from 'web3'
import { provider } from 'web3-core'
import { Contracts } from './Contracts'

const web3 = new Web3()
const contracts = new Contracts(web3)
const _account = ref<string | null>(null)

function getAccount() {
  return _account.value
}

export function useWeb3(opts?: {
  onAccountConnected?: (account: string, oldAccount: string | null) => void
  onAccountDisconnected?: () => void
}): {
  web3: Web3
  contracts: Contracts
  getAccount: () => string | null
} {
  if (opts?.onAccountConnected || opts?.onAccountDisconnected) {
    watch(
      _account,
      (nV = null, oV = null) => {
        if (nV === oV) return
        if (nV && opts.onAccountConnected) {
          opts.onAccountConnected(nV, oV)
        } else if (!nV && opts.onAccountDisconnected) {
          opts.onAccountDisconnected()
        }
      },
      { immediate: true }
    )
  }
  return { web3, contracts, getAccount }
}

// TODO: remove delay before prod
setTimeout(() => {
  _detectProvider().then((provider: provider | undefined | null) => {
    if (provider) {
      console.log('Ethereum provider acquired')
      _adoptProvider(provider)
    } else {
      console.error('Cannot acquire Ethereum provider!')
    }
  })
}, 2000)

function _detectProvider(): Promise<provider | undefined | null> {
  return new Promise<provider | undefined | null>((resolve) => {
    const provider = (window as any).ethereum as provider
    if (provider) {
      resolve(provider)
    } else {
      window.addEventListener(
        'ethereum#initialized',
        () => {
          resolve((window as any).ethereum as provider)
        },
        { once: true }
      )

      // If the event is not dispatched by the end of the timeout,
      // the user probably doesn't have MetaMask installed.
      setTimeout(() => resolve(null), 3000) // 3 seconds
    }
  })
}

async function _adoptProvider(provider: provider) {
  if (provider) {
    web3.setProvider(provider)
    _attachProviderListeners(provider)
    web3.eth.getAccounts().then(_adoptAccounts)
  }
}

function _attachProviderListeners(provider: provider) {
  if (provider && typeof provider !== 'string' && 'on' in provider) {
    provider.on('connect', ((conInfo: any) => {
      console.debug('Web3 provider: Connected', JSON.stringify(conInfo))
    }) as () => void)

    provider.on('disconnect', ((err: any) => {
      console.debug('Web3 provider: Disconnected', JSON.stringify(err))
    }) as () => void)

    provider.on('accountsChanged', ((accArr: string[]) => {
      console.debug('Web3 provider: Accounts changed', accArr)
      _adoptAccounts(accArr)
    }) as () => void)

    provider.on('chainChanged', ((chainId: string) => {
      console.debug(`Web3 provider: Chain changed to ${chainId}. Reloading...`)
      window.location.reload()
    }) as () => void)

    provider.on('message', ((msg: any) => {
      console.debug('Web3 provider: Got message', JSON.stringify(msg))
    }) as () => void)
  }
}

function _adoptAccounts(accArr: string[]) {
  const acc = accArr[0] || null
  _account.value = acc
  web3.defaultAccount = acc
  contracts.setDefaultFrom(acc)
}

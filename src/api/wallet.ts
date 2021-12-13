import { AccountData, OfflineSigner } from '@cosmjs/launchpad'
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'
import { API_CONFIG } from './api-config'
import { Window as KeplrWindow } from '@keplr-wallet/types'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}

export class OdinWallet {
  _wallet: DirectSecp256k1HdWallet | OfflineSigner | null = null
  _walletAccounts: readonly AccountData[] | null = null
  _walletType: string | null = null

  get signer(): DirectSecp256k1HdWallet | OfflineSigner {
    if (!this._wallet) {
      throw new ReferenceError('OdinWallet not initialized!')
    }
    return this._wallet
  }

  get account(): AccountData {
    if (!this._walletAccounts?.[0]) {
      throw new ReferenceError('OdinWallet not initialized!')
    }
    return this._walletAccounts[0]
  }

  get isEmpty(): boolean {
    return this._wallet === null
  }

  get type(): string | null {
    if (!this._wallet) {
      throw new ReferenceError('OdinWallet not initialized!')
    }
    return this._walletType
  }

  async init(walletData: { type: string; key: string }): Promise<void> {
    if (walletData.type === 'odinWallet') {
      this._wallet = await DirectSecp256k1HdWallet.fromMnemonic(
        walletData.key,
        {
          hdPaths: [API_CONFIG.hdDeviation],
          prefix: 'odin',
        }
      )
    } else if (walletData.type === 'keplrWallet') {
      const offlineSigner =
        window.getOfflineSigner != null
          ? window.getOfflineSigner(walletData.key)
          : null
      if (offlineSigner == null)
        throw new ReferenceError('Error with offline signer!')
      this._wallet = offlineSigner
    }

    if (this._wallet) {
      this._walletAccounts = await this._wallet.getAccounts()
      this._walletType = walletData.type
    }
  }

  clear(): void {
    this._wallet = null
    this._walletAccounts = null
    this._walletType = null
  }
}

export const wallet = new OdinWallet()

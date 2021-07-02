import { AccountData } from '@cosmjs/launchpad'
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'
import { API_CONFIG } from './api-config'

export class OdinWallet {
  _wallet: DirectSecp256k1HdWallet | null = null
  _walletAccounts: readonly AccountData[] | null = null

  get signer(): DirectSecp256k1HdWallet {
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

  async init(mnemonic: string): Promise<void> {
    this._wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, {
      hdPaths: [API_CONFIG.hdDeviation],
      prefix: 'odin',
    })
    this._walletAccounts = await this._wallet.getAccounts()
  }

  clear(): void {
    this._wallet = null
    this._walletAccounts = null
  }
}

export const wallet = new OdinWallet()

import {
  AccountData,
  OfflineSigner,
  OfflineDirectSigner,
  DirectSecp256k1HdWallet,
} from '@cosmjs/proto-signing'
import { API_CONFIG } from './api-config'
import { Window as KeplrWindow } from '@keplr-wallet/types'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { GasPrice } from '@cosmjs/stargate'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}

export enum WalletTypes {
  ODIN_WALLET,
  KEPLR_WALLET,
  COSMOSTATION_WALLET,
}

const gasPrice = GasPrice.fromString(API_CONFIG.gasPrice)

export class OdinWallet {
  _wallet:
    | DirectSecp256k1HdWallet
    | OfflineSigner
    | OfflineDirectSigner
    | null = null
  _walletAccounts: readonly AccountData[] | null = null
  _walletType: WalletTypes | null = null
  _contractWallet: SigningCosmWasmClient | null = null

  get signer(): DirectSecp256k1HdWallet | OfflineSigner | OfflineDirectSigner {
    if (!this._wallet) {
      throw new ReferenceError('Connect wallet extension first!')
    }
    return this._wallet
  }

  get wasmSigner(): SigningCosmWasmClient {
    if (!this._contractWallet) {
      throw new ReferenceError('Connect wallet extension first!')
    }
    return this._contractWallet
  }

  get account(): AccountData {
    if (!this._walletAccounts?.[0]) {
      throw new ReferenceError('Connect wallet extension first!')
    }
    return this._walletAccounts[0]
  }

  get isEmpty(): boolean {
    return this._wallet === null
  }

  get type(): WalletTypes | null {
    if (!this._wallet) {
      throw new ReferenceError('Connect wallet extension first!')
    }
    return this._walletType
  }

  async init(walletData: { type: WalletTypes; key: string }): Promise<void> {
    if (walletData.type === WalletTypes.ODIN_WALLET) {
      DirectSecp256k1HdWallet.fromMnemonic
      this._wallet = await DirectSecp256k1HdWallet.fromMnemonic(
        walletData.key,
        {
          hdPaths: [API_CONFIG.hdDeviation],
          prefix: 'odin',
        },
      )
    } else if (walletData.type === WalletTypes.KEPLR_WALLET) {
      const offlineSigner =
        window.getOfflineSignerAuto != null
          ? await window.getOfflineSignerAuto(walletData.key)
          : null
      if (offlineSigner === null)
        throw new ReferenceError(
          'Something went wrong. Error with offline signer.',
        )
      this._wallet = offlineSigner
    } else if (walletData.type === WalletTypes.COSMOSTATION_WALLET) {
      if (!window?.cosmostation?.providers?.keplr)
        throw new ReferenceError(
          'Something went wrong. Error with cosmostation.',
        )
      const offlineSigner =
        window.cosmostation.providers.keplr != null
          ? await window.cosmostation.providers.keplr.getOfflineSignerAuto(
              walletData.key,
            )
          : null

      if (offlineSigner === null)
        throw new ReferenceError(
          'Something went wrong. Error with offline signer.',
        )
      this._wallet = offlineSigner
    }
    if (this._wallet) {
      this._walletAccounts = await this._wallet.getAccounts()
      this._walletType = walletData.type
      this._contractWallet = await SigningCosmWasmClient.connectWithSigner(
        API_CONFIG.rpc,
        this._wallet,
        { gasPrice: gasPrice },
      )
    }
  }

  clear(): void {
    this._contractWallet = null
    this._wallet = null
    this._walletAccounts = null
    this._walletType = null
  }
}

export const wallet = new OdinWallet()

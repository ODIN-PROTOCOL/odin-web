import { HdPath, stringToPath } from '@cosmjs/crypto'
import { AccountData } from '@cosmjs/launchpad'
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'

export type Wallet = DirectSecp256k1HdWallet

let _wallet: Wallet | null = null
let _walletAccounts: readonly AccountData[] | null
const HD_DEVIATION = stringToPath("m/44'/118'/0'/0/0")

export async function initWallet(
  mnemonic: string
): Promise<[Wallet, readonly AccountData[]]> {
  if (_wallet) {
    throw new ReferenceError('Wallet is already initialized!')
  }
  _wallet = await walletFromMnemonic(mnemonic)
  _walletAccounts = _wallet && (await _wallet.getAccounts())
  return [_wallet, _walletAccounts]
}

export async function walletFromMnemonic(
  mnemonic: string,
  deviation: HdPath = HD_DEVIATION
): Promise<Wallet> {
  return DirectSecp256k1HdWallet.fromMnemonic(mnemonic, deviation, 'odin')
}

export function getWallet(): Wallet {
  if (!_wallet) {
    throw new ReferenceError('Wallet not initialized!')
  }
  return _wallet
}

export function getWalletAccounts(): readonly AccountData[] {
  if (!_walletAccounts) {
    throw new ReferenceError('Wallet not initialized!')
  }
  return _walletAccounts
}

export function hasWallet(): boolean {
  return _wallet !== null
}

export function clearWallet(): void {
  _wallet = null
  _walletAccounts = null
}

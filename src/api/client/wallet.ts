import { HdPath, stringToPath } from '@cosmjs/crypto'
import { AccountData } from '@cosmjs/launchpad'
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'

let _wallet: DirectSecp256k1HdWallet
let _walletAccounts: readonly AccountData[]
const HD_DEVIATION = stringToPath("m/44'/118'/0'/0/0")

export async function initWallet(
  mnemonic: string
): Promise<[DirectSecp256k1HdWallet, readonly AccountData[]]> {
  _wallet = await walletFromMnemonic(mnemonic)
  _walletAccounts = _wallet && (await _wallet.getAccounts())
  return [_wallet, _walletAccounts]
}

export async function walletFromMnemonic(
  mnemonic: string,
  deviation: HdPath = HD_DEVIATION
): Promise<DirectSecp256k1HdWallet> {
  return DirectSecp256k1HdWallet.fromMnemonic(mnemonic, deviation, 'odin')
}

export function getWallet(): DirectSecp256k1HdWallet {
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

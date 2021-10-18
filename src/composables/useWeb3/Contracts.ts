import Web3 from 'web3'
import { ContractOptions } from 'web3-eth-contract'

import AbiBridge from '@provider/contracts/abi/Bridge.const'
import { BridgeAbi as Bridge } from '@provider/contracts/web3-types/Bridge'
import OdinAbi from '@provider/contracts/abi/Odin.const'
import { Odin } from '@provider/contracts/web3-types/Odin'

const BridgeToken = process.env.VUE_APP_BRIDGE
const OdinToken = process.env.VUE_APP_ODIN

export class Contracts {
  readonly bridge: Bridge
  readonly odin: Odin
  private _web3: Web3
  private _defaultFrom: string | undefined

  constructor(web3: Web3) {
    this._web3 = web3
    this.bridge = this._makeContract<Bridge>(AbiBridge, BridgeToken)
    this.odin = this.makeOdin(OdinToken as string)
  }

  setDefaultFrom(account: string | null): void {
    this._defaultFrom = account || undefined
    this.bridge.options.from = this._defaultFrom
    this.odin.options.from = this._defaultFrom
  }

  makeOdin(assetAddress: string): Odin {
    return this._makeContract(OdinAbi, assetAddress)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _makeContract<T>(abi: any[], address?: string, opts?: ContractOptions): T {
    opts = opts ?? ({} as ContractOptions)
    opts.from = opts.from ?? this._defaultFrom
    opts.gasPrice = process.env.GAS_PRICE
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new this._web3.eth.Contract(abi, address, opts) as any
  }
}

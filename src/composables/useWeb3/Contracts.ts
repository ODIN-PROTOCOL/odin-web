import Web3 from 'web3'
import { ContractOptions } from 'web3-eth-contract'

import AbiBridge from '@provider/contracts/abi/Bridge.const.ts'
import { BridgeAbi as Bridge } from '@provider/contracts/web3-types/Bridge'
import AbiErc20 from '@provider/contracts/abi/ERC20.const.ts'
import { ERC20Abi as ERC20 } from '@provider/contracts/web3-types/ERC20'

const BridgeToken = process.env.VUE_APP_BRIDGE
const OdinToken = process.env.VUE_APP_ODIN

export class Contracts {
  readonly bridge: Bridge
  readonly odin: ERC20
  private _web3: Web3
  private _defaultFrom: string | undefined

  constructor(web3: Web3) {
    this._web3 = web3
    this.bridge = this._makeContract<Bridge>(AbiBridge, BridgeToken)
    // this.odin = this._makeContract<ERC20>(AbiErc20, OdinToken)
    this.odin = this.makeErc20(OdinToken as string)
  }

  setDefaultFrom(account: string | null): void {
    this._defaultFrom = account || undefined
    this.bridge.options.from = this._defaultFrom
    this.odin.options.from = this._defaultFrom
  }

  makeErc20(assetAddress: string): ERC20 {
    return this._makeContract(AbiErc20, assetAddress)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _makeContract<T>(abi: any[], address?: string, opts?: ContractOptions): T {
    opts = opts ?? ({} as ContractOptions)
    opts.from = opts.from ?? this._defaultFrom

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new this._web3.eth.Contract(abi, address, opts) as any
  }
}

import { API_CONFIG } from './api-config'
import { Tendermint34Client } from '@cosmjs/tendermint-rpc'
import { OdinWallet } from './wallet'
import {
  BankExtension,
  BroadcastTxResponse,
  QueryClient,
  setupBankExtension,
  setupStakingExtension,
  SigningStargateClient,
  StakingExtension,
} from '@cosmjs/stargate'
import { EncodeObject, GeneratedType, Registry } from '@cosmjs/proto-signing'
import { CoinswapExt, setupCoinswapExt } from './query-ext/coinswapExtension'
import { GovExt, setupGovExt } from './query-ext/govExtension'
import { MintExt, setupMintExt } from './query-ext/mintExtension'
import { OracleExt, setupOracleExt } from './query-ext/oracleExtension'
import { BroadcastTxFailure, coins } from '@cosmjs/launchpad'
import { stub } from '@/helpers/stubs'

export class OdinApiBroadcastError extends Error {
  txCode: number
  txHash: string
  txRawLog?: string

  constructor(txFailure: BroadcastTxFailure) {
    super(txFailure.rawLog || 'unknown error')
    this.name = 'Broadcast Tx Error'
    this.txCode = txFailure.code
    this.txRawLog = txFailure.rawLog
    this.txHash = txFailure.transactionHash
  }
}

type OdinQueryClient = QueryClient &
  CoinswapExt &
  GovExt &
  MintExt &
  OracleExt &
  BankExtension &
  StakingExtension

class Api {
  private _query: OdinQueryClient = stub('Query not initialized!')
  private _wallet: OdinWallet = stub('Wallet not initialized!')
  private _stargate: SigningStargateClient = stub('Stargate not initialized!')
  private _stargateRegistry = new Registry()

  async init() {
    await this._initQueryClient()
  }

  async attachWallet(wallet: OdinWallet): Promise<void> {
    this._stargate = await SigningStargateClient.connectWithSigner(
      API_CONFIG.rpc,
      wallet.signer,
      { registry: this._stargateRegistry }
    )
    if (this._stargate) {
      this._wallet = wallet
    }
  }

  detachWallet() {
    this._stargate.disconnect()
    this._stargate = stub('Stargate not initialized!')
    this._wallet = stub('Wallet not initialized!')
  }

  makeBroadcastCaller<T>(
    typeUrl: string,
    type: GeneratedType
  ): (msg: T) => Promise<BroadcastTxResponse> {
    this._stargateRegistry.register(typeUrl, type)
    return (msg: T): Promise<BroadcastTxResponse> => {
      return this._signAndBroadcast([{ typeUrl, value: msg }])
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  makeQueryCaller<T extends (...args: any) => any>(
    make: (qc: OdinQueryClient) => T
  ): T {
    return make(this._query)
  }

  private async _initQueryClient(): Promise<void> {
    this._query = QueryClient.withExtensions(
      await Tendermint34Client.connect(API_CONFIG.rpc),
      setupCoinswapExt,
      setupGovExt,
      setupMintExt,
      setupOracleExt,
      setupStakingExtension,
      setupBankExtension
    )
  }

  private async _signAndBroadcast(
    messages: EncodeObject[]
  ): Promise<BroadcastTxResponse> {
    const res = await this._stargate.signAndBroadcast(
      this._wallet.account.address,
      messages,
      { amount: coins(0, 'loki'), gas: '2000000' }
    )
    if (!res || ('code' in res && res.code !== 0)) {
      throw new OdinApiBroadcastError(res as BroadcastTxFailure)
    }

    return res
  }
}

export const api = new Api()

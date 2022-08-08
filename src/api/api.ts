import { API_CONFIG, COINS_LIST } from './api-config'
import { Tendermint34Client } from '@cosmjs/tendermint-rpc'
import { OdinWallet } from './wallet'
import {
  BankExtension,
  IbcExtension,
  DeliverTxResponse,
  QueryClient,
  setupBankExtension,
  setupStakingExtension,
  setupDistributionExtension,
  setupIbcExtension,
  SigningStargateClient,
  StakingExtension,
  DistributionExtension,
  GovExtension,
  setupGovExtension,
} from '@cosmjs/stargate'
import { EncodeObject, GeneratedType } from '@cosmjs/proto-signing'
import { Registry } from '@cosmjs/proto-signing/build/registry'
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
  StakingExtension &
  DistributionExtension &
  IbcExtension &
  GovExtension

class Api {
  private _query: OdinQueryClient = stub('Query not initialized!')
  private _tendermint: Tendermint34Client = stub('Tendermint not initialized!')
  private _wallet: OdinWallet = stub('Wallet not initialized!')
  private _stargate: SigningStargateClient = stub('Stargate not initialized!')
  private _stargateRegistry = new Registry()

  async init() {
    await this._initTendermint()
    await this._initQueryClient()
  }

  async attachWallet(wallet: OdinWallet): Promise<void> {
    this._stargate = await SigningStargateClient.connectWithSigner(
      API_CONFIG.rpc,
      wallet.signer,
      { registry: this._stargateRegistry },
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
    type: GeneratedType,
  ): (msg: T) => Promise<DeliverTxResponse> {
    this._stargateRegistry.register(typeUrl, type)
    return (msg: T): Promise<DeliverTxResponse> => {
      return this._signAndBroadcast([{ typeUrl, value: msg }])
    }
  }

  makeMultiBroadcastCaller<T>(
    typeUrl: string,
    type: GeneratedType,
  ): (msgs: T[]) => Promise<DeliverTxResponse> {
    this._stargateRegistry.register(typeUrl, type)
    return (msgs: T[]): Promise<DeliverTxResponse> => {
      return this._signAndBroadcast(
        msgs.map(item => {
          return { typeUrl, value: item }
        }),
      )
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  makeQueryCaller<T extends (...args: any) => any>(
    make: (qc: OdinQueryClient) => T,
  ): T {
    return make(this._query)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  makeTendermintCaller<T extends (...args: any) => any>(
    make: (tc: Tendermint34Client) => T,
  ): T {
    return make(this._tendermint)
  }

  private async _initTendermint(): Promise<void> {
    this._tendermint = await Tendermint34Client.connect(API_CONFIG.rpc)
  }

  private async _initQueryClient(): Promise<void> {
    this._query = QueryClient.withExtensions(
      this._tendermint,
      // await Tendermint34Client.connect(API_CONFIG.rpc),
      setupCoinswapExt,
      setupGovExt,
      setupMintExt,
      setupOracleExt,
      setupStakingExtension,
      setupDistributionExtension,
      setupBankExtension,
      setupIbcExtension,
      setupGovExtension,
    )
  }

  private async _signAndBroadcast(
    messages: EncodeObject[],
  ): Promise<DeliverTxResponse> {
    const res = await this._stargate.signAndBroadcast(
      this._wallet.account.address,
      messages,
      {
        amount: coins(Number(API_CONFIG.fee), COINS_LIST.LOKI),
        gas: '2000000',
      },
    )
    if (!res || ('code' in res && res.code !== 0)) {
      throw new OdinApiBroadcastError(res as BroadcastTxFailure)
    }

    return res
  }
}

export const api = new Api()

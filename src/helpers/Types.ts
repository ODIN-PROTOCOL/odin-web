import { BigNumber } from 'bignumber.js'
import { BlockMeta } from '@cosmjs/tendermint-rpc'
import { Modify } from '@/shared-types'
import { ProposalDecoded } from '@/helpers/proposalDecoders'
import { NFTInfo, TransformedBlockInfo, ValidatorDetailedInfo } from '@/graphql/types/responses'

export interface Coin {
  denom: string
  amount: string
}

export interface IEventsItem {
  type: string
  attributes: []
}

export interface IAttributesItem {
  key: string
  value: string
}

export type AmountDetails = {
  amount: string
  denom: string
}
export type DecodedTxData = {
  voter?: string
  type: string
  hash?: string
  block?: string | number | undefined
  delegatorAddress?: string
  time?: string | void | Date
  sender?: string
  receiver?: string
  amount?: string | BigNumber
  denom?: string
  fee?: string | BigNumber
  feeDenom?: string
  status?: number | string | undefined
  memo?: string
  gasWanted?: string | number
  gasUsed?: string | number
  receiver_name?: string | undefined
}

export type txFromTelemetry = {
  amount: AmountDetails[]
  block: number
  fee: AmountDetails[]
  receiver: string
  sender: string
  timestamp: number
  tx_hash: string
  type: string
}

export type TransformedProposal = Modify<
  ProposalDecoded,
  {
    humanizeStatus: string
    proposerAddress: string
  }
>

export type defaultChartDataBlank = {
  name: string
  color: string
}

export type ChartDataItem = {
  name: string
  count: number
  color: string
}

type USD = {
  usd: number
}

export type WalletRate = {
  geodb: USD
  'odin-protocol': USD
}

export type ProposalChangesItem = {
  Key: string
  ValueType: string
}

export type ProposalChanges = {
  auction: ProposalChangesItem[]
  auth: ProposalChangesItem[]
  bank: ProposalChangesItem[]
  coinswap: ProposalChangesItem[]
  crisis: ProposalChangesItem[]
  distribution: ProposalChangesItem[]
  gov: ProposalChangesItem[]
  ibc: ProposalChangesItem[]
  mint: ProposalChangesItem[]
  oracle: ProposalChangesItem[]
  slashing: ProposalChangesItem[]
  staking: ProposalChangesItem[]
}

type StatusTypesItem = { name: string; status: string }

export type StatusTypes = {
  [key: string]: StatusTypesItem
}

type ProposalsStatisticItem = { Name: string; Count: number }

export type ProposalsStatistic = {
  [key: number]: ProposalsStatisticItem
}
export interface EventTx {
  readonly type: string
  readonly attributes?: [{ readonly key: string; readonly value: string }]
}
export interface TxData {
  readonly code: number
  readonly codeSpace?: string
  readonly log?: string
  readonly data?: string | null
  readonly events: EventTx[]
  readonly gas_wanted: string
  readonly gas_used: string
}
export interface TxTelemetry {
  readonly tx: string
  readonly hash: string
  readonly height: number
  readonly index: number
  readonly tx_result: TxData
}

export type SearchResultType = {
  blocks?: Array<TransformedBlockInfo>
  transactions?: Array<DecodedTxData>
  accounts?: Array<TempSearchAccountInfoType>
  nfts?: NFTInfo[]
}

export interface TransformedBlocks extends BlockMeta {
  validator: ValidatorDetailedInfo
  name: string
  txs: number
}

export type TempSearchAccountInfoType = {
  address: string
  geoBalance: Coin
  odinBalance: Coin
}

export type Link = {
  to?: string
  name?: string
  text?: string
  title?: string
  url?: string
}

export type LinkList = {
  name: string
  links: Array<Link>
}

export type TempBalanceType = {
  address: string
  mgeo_balance: number
  loki_balance: number
  delegated_amount: number
  total_amount: number
  tx_number: number
}

export type telemetryDataForCharts = {
  date: string
  size?: number
  seconds?: number
  volume?: number
  fee?: number
  value?: number
}

export type formatedTelemetryDataForCharts = {
  data: number[]
  labels: string[]
}

export type CoingeckoCoinsType = {
  data: {
    name: string
    symbol: string
    market_data: {
      current_price: { usd: string }
      market_cap: { usd: string }
      total_supply: number | string
    }
  }
}

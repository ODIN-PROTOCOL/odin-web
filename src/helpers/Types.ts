import { Modify } from '@/shared-types'
import { ProposalDecoded } from '@/helpers/proposalDecoders'
import { BigNumber } from 'bignumber.js'

export interface IEventsItem {
  type: string
  attributes: []
}

export interface IAttributesItem {
  key: string
  value: string
}

export type adjustedData = {
  voter?: string
  type: string
  hash?: string
  block?: string | number | undefined
  delegatorAddress?: string
  time?: string | void | Date
  sender?: string
  receiver?: string
  amount?: string | BigNumber | undefined
  fee?: string | BigNumber | undefined
  status?: number | string | undefined
  memo?: string
  gasWanted?: string | number
  gasUsed?: string | number
}

export type txFromTelemetry = {
  amount: string
  block: number
  fee: string
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
  [key: number]: StatusTypesItem
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

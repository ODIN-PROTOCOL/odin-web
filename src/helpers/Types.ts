import { Modify } from '@/shared-types'
import { ProposalDecoded } from '@/helpers/proposalDecoders'

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
  time?: Date | string | null
  sender?: string
  receiver?: string
  amount?: string
  fee?: string
  status?: number | string | undefined
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

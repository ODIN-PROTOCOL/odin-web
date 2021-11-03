import { Modify } from '@/shared-types'
import { ProposalDecoded } from '@/helpers/proposalDecoders'

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

export type ChartDataItem = {
  name: string
  count: number
  color: string
}

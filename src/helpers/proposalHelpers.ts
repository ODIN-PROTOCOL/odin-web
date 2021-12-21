import { ProposalDecoded } from '@/helpers/proposalDecoders'
import {
  TransformedProposal,
  defaultChartDataBlank,
  ChartDataItem,
} from '@/helpers/Types'
import { proposalStatusType } from '@/helpers/statusTypes'
import { callers } from '@/api/callers'

export const getTransformedProposals = async (
  proposals: ProposalDecoded[]
): Promise<TransformedProposal[]> => {
  const transformedProposals = await Promise.all(
    proposals.map(async (item) => {
      const response = await callers.getProposer(item.proposalId)
      const proposer = await response.json()
      return {
        ...item,
        proposerAddress: proposer.result.proposer,
        humanizeStatus: proposalStatusType[item.status].name,
      }
    })
  )

  return transformedProposals
}

const defaultProposalsCountBlank: defaultChartDataBlank[] = [
  { name: 'Approved', color: '#00D097' },
  { name: 'Rejected', color: '#F65160' },
  { name: 'Pending', color: '#FDC748' },
  { name: 'In progress', color: '#007BFF' },
  { name: 'Unspecified', color: '#CCE4FF' },
]

export const getProposalsCountByStatus = (
  proposals: TransformedProposal[]
): ChartDataItem[] => {
  const counts: ChartDataItem[] = [
    ...defaultProposalsCountBlank.map((item) => ({ ...item, count: 0 })),
  ]

  proposals.forEach((p) => {
    counts.forEach((c: ChartDataItem) => {
      if (p.humanizeStatus === c.name) c.count += 1
    })
  })

  return counts
}

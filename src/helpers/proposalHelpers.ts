import { ProposalDecoded } from '@/helpers/proposalDecoders'
import { TransformedProposal, ChartDataItem } from '@/helpers/Types'
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

const defaultProposalsCount: ChartDataItem[] = [
  { name: 'Approved', count: 0, color: '#00D097' },
  { name: 'Rejected', count: 0, color: '#F65160' },
  { name: 'Pending', count: 0, color: '#FDC748' },
  { name: 'In progress', count: 0, color: '#007BFF' },
  { name: 'Unspecified', count: 0, color: '#CCE4FF' },
]

export const getProposalsCountByStatus = (
  proposals: TransformedProposal[]
): ChartDataItem[] => {
  const counts: ChartDataItem[] = [...defaultProposalsCount]

  proposals.forEach((p) => {
    counts.forEach((c: ChartDataItem) => {
      if (p.humanizeStatus === c.name) c.count += 1
    })
  })

  return counts
}

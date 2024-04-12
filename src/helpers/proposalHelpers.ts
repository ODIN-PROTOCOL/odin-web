import { ProposalDecoded } from '@/helpers/proposalDecoders'
import {
  TransformedProposal,
  defaultChartDataBlank,
  ChartDataItem,
  ProposalsStatistic,
} from '@/helpers/Types'
import { proposalStatusType } from '@/helpers/statusTypes'
import { callers } from '@/api/callers'
import { ProposalStatus } from '@provider/codec/cosmos/gov/v1beta1/gov'

// export const getTransformedProposals = async (
//   proposals: ProposalDecoded[],
// ): Promise<TransformedProposal[]> => {
//   const transformedProposals = await Promise.all(
//     proposals.map(async item => {

//       if (!item.proposalId) return {
//         ...item,
//         proposerAddress: '',
//         humanizeStatus: proposalStatusType[item.status].name,
//       }

//       const response = await callers.getProposer(item.proposalId)
//       const proposer = await response.json()
//       return {
//         ...item,
//         proposerAddress: proposer.result.proposer,
//         humanizeStatus: proposalStatusType[item.status].name,
//       }
//     }),
//   )

//   return transformedProposals
// }

const defaultProposalsCountBlank: defaultChartDataBlank[] = [
  { name: 'Approved', color: '#00D097' },
  { name: 'Rejected', color: '#F65160' },
  { name: 'Pending', color: '#FDC748' },
  { name: 'In progress', color: '#007BFF' },
  { name: 'Unspecified', color: '#CCE4FF' },
]

export const getProposalsCountByStatus = (
  proposals: ProposalsStatistic,
): ChartDataItem[] => {
  let counts: ChartDataItem[] = [
    ...defaultProposalsCountBlank.map(item => ({ ...item, count: 0 })),
  ]

  for (const [, value] of Object.entries(proposals)) {
    counts = counts.map((c: ChartDataItem) =>
      proposalStatusType[(<never>ProposalStatus)[value.Name]].name === c.name
        ? { ...c, count: value.Count }
        : c,
    )
  }

  return counts
}

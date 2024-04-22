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

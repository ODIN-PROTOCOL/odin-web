import { voteStatusType } from '@/helpers/statusTypes'
import { defaultChartDataBlank, ChartDataItem } from '@/helpers/Types'
import { Vote } from '@provider/codec/cosmos/gov/v1beta1/gov'

const defaultVotesCountBlank: defaultChartDataBlank[] = [
  { name: 'Support', color: '#00D097' },
  { name: 'Reject', color: '#F65160' },
  { name: 'Veto', color: '#FDC748' },
  { name: 'Abstain', color: '#007BFF' },
]

export const getVotesCountByStatus = (votes: Vote[]): ChartDataItem[] => {
  const counts: ChartDataItem[] = [
    ...defaultVotesCountBlank.map(item => ({ ...item, count: 0 })),
  ]

  votes.forEach(p => {
    const countsItem = counts.find((c: ChartDataItem) =>
      voteStatusType[p.option].name === c.name ? true : false,
    )
    if (countsItem) countsItem.count++
  })

  return counts
}

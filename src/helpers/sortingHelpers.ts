import { wallet } from '@/api/wallet'

export enum ACTIVITIES_SORT {
  latest = 'latest_updated',
  most = 'most_requested',
}

export enum OWNERS_SORT {
  all = 'null',
}

export const sortingActivities = [
  {
    text: 'Latest Update',
    value: ACTIVITIES_SORT.latest,
  },
  {
    text: 'Most Requested',
    value: ACTIVITIES_SORT.most,
  },
]

export const sortingOwners = [
  {
    text: 'All',
    value: OWNERS_SORT.all,
  },
  {
    text: 'My',
    value: wallet.account.address,
  },
]

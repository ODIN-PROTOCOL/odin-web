import { wallet } from '@/api/wallet'

export enum ACTIVITIES_SORT {
  LATEST = 'latest_updated',
  MOST = 'most_requested',
}

export enum OWNERS_SORT {
  ALL = 'null',
}

export const sortingActivities = [
  {
    text: 'Latest Update',
    value: ACTIVITIES_SORT.LATEST,
  },
  {
    text: 'Most Requested',
    value: ACTIVITIES_SORT.MOST,
  },
]

export const sortingOwners = [
  {
    text: 'All',
    value: OWNERS_SORT.ALL,
  },
  {
    text: 'Mine',
    value: wallet.account.address,
  },
]

import { wallet } from '@/api/wallet'

export enum ACTIVITIES_SORT {
  latest = 'latest_updated',
  most = 'most_requested',
}

export enum OWNERS_SORT {
  all = 'null',
}
export enum TYPE_TX_SORT {
  all = 'null',
  delegate = 'delegate',
  send = 'send',
  withdraw = 'withdraw',
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
export const sortingTypeTx = [
  {
    text: 'All',
    value: TYPE_TX_SORT.all,
  },
  {
    text: 'Delegated',
    value: TYPE_TX_SORT.delegate,
  },
  {
    text: 'Send',
    value: TYPE_TX_SORT.send,
  },
  {
    text: 'Withdraw',
    value: TYPE_TX_SORT.withdraw,
  },
]

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
    text: 'Last Updated',
    value: ACTIVITIES_SORT.latest,
  },
  {
    text: 'Most Requested',
    value: ACTIVITIES_SORT.most,
  },
]

type sortingOptions = {
  text: string
  value: string
}[]

export const getSortingOwners = (
  isWalletActive: boolean,
  walletAddress: string
): sortingOptions => {
  const allOwners = {
    text: 'All',
    value: OWNERS_SORT.all,

  }

  return isWalletActive
    ? [allOwners]
    : [
        allOwners,
        {
          text: 'My Uploads',
          value: walletAddress,
        },
      ]
}

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

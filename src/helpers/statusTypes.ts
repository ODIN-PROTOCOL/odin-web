import { StatusTypes } from '@/helpers/Types'

export const requestStatusType: StatusTypes = {
  1: { name: 'Ok', status: 'success' },
  2: { name: 'Failure', status: 'error' },
  3: { name: 'Expired', status: 'pending' },
}

export const proposalStatusType: StatusTypes = {
  0: { name: 'Unspecified', status: 'default' },
  1: { name: 'Pending', status: 'pending' },
  2: { name: 'In progress', status: 'progress' },
  3: { name: 'Approved', status: 'success' },
  4: { name: 'Rejected', status: 'error' },
  5: { name: 'Unspecified', status: 'default' },
  '-1': { name: 'Unspecified', status: 'default' },
}

export const voteStatusType: StatusTypes = {
  1: { name: 'Support', status: 'yes' },
  2: { name: 'Abstain', status: 'abstain' },
  3: { name: 'Reject', status: 'no' },
  4: { name: 'Veto', status: 'no_with_veto' },
}

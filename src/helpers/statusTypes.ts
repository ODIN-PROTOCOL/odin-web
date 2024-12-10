import { StatusTypes } from '@/helpers/Types'

export const requestStatusType: StatusTypes = {
  1: { name: 'Success', status: 'success' },
  2: { name: 'Failure', status: 'error' },
  3: { name: 'Expired', status: 'pending' },
}

// PROPOSAL_STATUS_UNSPECIFIED, PROPOSAL_STATUS_DEPOSIT_PERIOD, PROPOSAL_STATUS_VOTING_PERIOD, PROPOSAL_STATUS_PASSED, PROPOSAL_STATUS_REJECTED, PROPOSAL_STATUS_FAILED
export const proposalStatusType: StatusTypes = {
  PROPOSAL_STATUS_UNSPECIFIED: { name: 'Unspecified', status: 'default' },
  PROPOSAL_STATUS_DEPOSIT_PERIOD: { name: 'Pending', status: 'pending' },
  PROPOSAL_STATUS_VOTING_PERIOD: { name: 'In progress', status: 'progress' },
  PROPOSAL_STATUS_PASSED: { name: 'Approved', status: 'success' },
  PROPOSAL_STATUS_REJECTED: { name: 'Rejected', status: 'error' },
  PROPOSAL_STATUS_FAILED: { name: 'Failed', status: 'error' },
  '': { name: 'Unspecified', status: 'default' },
  null: { name: 'Unspecified', status: 'default' },
}

export const voteStatusType: StatusTypes = {
  0: { name: 'Unspecified', status: 'no_op' },
  1: { name: 'Support', status: 'yes' },
  2: { name: 'Abstain', status: 'abstain' },
  3: { name: 'Reject', status: 'no' },
  4: { name: 'Veto', status: 'no_with_veto' },
}

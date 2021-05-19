import { ProposalStatus } from '@provider/codec/cosmos/gov/v1beta1/gov'
import { ResolveStatus } from '@provider/codec/oracle/v1/oracle'

// TODO: translate

export function translateRequestStatus(resolveStatus: ResolveStatus): string {
  switch (resolveStatus) {
    case ResolveStatus.RESOLVE_STATUS_OPEN_UNSPECIFIED:
      return 'Unspecified'
    case ResolveStatus.RESOLVE_STATUS_SUCCESS:
      return 'Success'
    case ResolveStatus.RESOLVE_STATUS_FAILURE:
      return 'Failure'
    case ResolveStatus.RESOLVE_STATUS_EXPIRED:
      return 'Expired'
    case ResolveStatus.UNRECOGNIZED:
    default:
      return 'Unrecognized'
  }
}

export function translateProposalStatus(status: ProposalStatus): string {
  switch (status) {
    case ProposalStatus.PROPOSAL_STATUS_UNSPECIFIED:
      return 'Unspecified'
    case ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD:
      return 'Deposit period'
    case ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD:
      return 'Voting period'
    case ProposalStatus.PROPOSAL_STATUS_PASSED:
      return 'Passed'
    case ProposalStatus.PROPOSAL_STATUS_REJECTED:
      return 'Rejected'
    case ProposalStatus.PROPOSAL_STATUS_FAILED:
      return 'Failed'
    case ProposalStatus.UNRECOGNIZED:
    default:
      return 'Unrecognized'
  }
}

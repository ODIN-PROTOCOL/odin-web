import {
  Proposal,
  ProposalStatus,
  TallyResult,
  VoteOption,
} from '@provider/codec/cosmos/gov/v1beta1/gov'
import { ResolveStatus } from '@provider/codec/oracle/v1/oracle'
import { BondStatus } from '@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/staking'
import { formatDate } from './formatters'
import { ProposalDecoded } from './proposalDecoders'

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

export function translateProposalStatusDated(
  proposal: Proposal | ProposalDecoded
): string {
  switch (proposal.status) {
    case ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD:
      return `Deposit till ${formatDate(proposal.depositEndTime as Date)}`
    case ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD:
      return `Voting till ${formatDate(proposal.votingEndTime as Date)}`
    default:
      return translateProposalStatus(proposal.status)
  }
}

export function translateTally(tally: TallyResult): string {
  return Object.entries(tally)
    .map(([opt, power]) => {
      return `${translateTallyOpt(opt as keyof TallyResult)}: ${power}`
    })
    .join(', ')
}

export function translateTallyOpt(tallyVote: keyof TallyResult): string {
  switch (tallyVote) {
    case 'yes':
      return 'Yes'
    case 'abstain':
      return 'Abstain'
    case 'no':
      return 'No'
    case 'noWithVeto':
      return 'Veto'
  }
}

export function translateTallyShort(tally: TallyResult): string {
  const shorted = Object.entries(tally)
    .filter(([, power]) => power !== '0%' && power !== '0')
    .map(([opt, power]) => {
      return `${translateTallyOptShort(opt as keyof TallyResult)}: ${power}`
    })
    .join(', ')
  return shorted || 'No votes yet'
}

export function translateTallyOptShort(tallyVote: keyof TallyResult): string {
  switch (tallyVote) {
    case 'yes':
      return 'Y'
    case 'abstain':
      return 'A'
    case 'no':
      return 'N'
    case 'noWithVeto':
      return 'V'
  }
}

export function translateVote(vote: VoteOption): string {
  switch (Number(vote)) {
    case VoteOption.VOTE_OPTION_UNSPECIFIED:
      return 'Unspecified'
    case VoteOption.VOTE_OPTION_YES:
      return 'Yes'
    case VoteOption.VOTE_OPTION_ABSTAIN:
      return 'Abstain'
    case VoteOption.VOTE_OPTION_NO:
      return 'No'
    case VoteOption.VOTE_OPTION_NO_WITH_VETO:
      return 'No with veto'
    case VoteOption.UNRECOGNIZED:
    default:
      return 'Unrecognized'
  }
}

export function translateBondStatus(bondStatus: BondStatus): string {
  switch (Number(bondStatus)) {
    case BondStatus.BOND_STATUS_UNSPECIFIED:
      return 'Unspecified'
    case BondStatus.BOND_STATUS_UNBONDED:
      return 'Unbonded'
    case BondStatus.BOND_STATUS_UNBONDING:
      return 'Unbonding'
    case BondStatus.BOND_STATUS_BONDED:
      return 'Bonded'
    case BondStatus.UNRECOGNIZED:
    default:
      return 'Unrecognized'
  }
}

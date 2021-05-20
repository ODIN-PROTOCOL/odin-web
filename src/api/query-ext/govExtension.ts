import { NumLike, toLong } from '@/helpers/casts'
import { QueryClient, createRpc } from '@cosmjs/stargate'
import { ProposalStatus } from '@provider/codec/cosmos/gov/v1beta1/gov'
import {
  QueryClientImpl,
  QueryDepositResponse,
  QueryDepositsResponse,
  QueryParamsResponse,
  QueryProposalResponse,
  QueryProposalsResponse,
  QueryTallyResultResponse,
  QueryVoteResponse,
  QueryVotesResponse,
} from '@provider/codec/cosmos/gov/v1beta1/query'

export interface GovExt {
  gov: {
    unverified: {
      params: (paramsType: string) => Promise<QueryParamsResponse>
      proposals: (
        proposalStatus: ProposalStatus,
        voter: string,
        depositor: string
      ) => Promise<QueryProposalsResponse>
      proposal: (proposalId: NumLike) => Promise<QueryProposalResponse>
      vote: (proposalId: NumLike, voter: string) => Promise<QueryVoteResponse>
      votes: (proposalId: NumLike) => Promise<QueryVotesResponse>
      deposit: (
        proposalId: NumLike,
        depositor: string
      ) => Promise<QueryDepositResponse>
      deposits: (proposalId: NumLike) => Promise<QueryDepositsResponse>
      tallyResult: (proposalId: NumLike) => Promise<QueryTallyResultResponse>
    }
  }
}

export function setupGovExt(base: QueryClient): GovExt {
  const rpc = createRpc(base)
  // Use this service to get easy typed access to query methods
  // This cannot be used for proof verification
  const queryService = new QueryClientImpl(rpc)
  return {
    gov: {
      unverified: {
        params: (paramsType: string) => {
          return queryService.Params({ paramsType: paramsType })
        },
        proposals: (
          proposalStatus: ProposalStatus,
          voter: string,
          depositor: string
        ) => {
          return queryService.Proposals({
            proposalStatus: proposalStatus,
            voter: voter,
            depositor: depositor,
          })
        },
        proposal: (proposalId: NumLike) => {
          return queryService.Proposal({
            proposalId: toLong(proposalId),
          })
        },
        vote: (proposalId: NumLike, voter: string) => {
          return queryService.Vote({
            proposalId: toLong(proposalId),
            voter: voter,
          })
        },
        votes: (proposalId: NumLike) => {
          return queryService.Votes({ proposalId: toLong(proposalId) })
        },
        deposit: (proposalId: NumLike, depositor: string) => {
          return queryService.Deposit({
            proposalId: toLong(proposalId),
            depositor: depositor,
          })
        },
        deposits: (proposalId: NumLike) => {
          return queryService.Deposits({
            proposalId: toLong(proposalId),
          })
        },
        tallyResult: (proposalId: NumLike) => {
          return queryService.TallyResult({ proposalId: toLong(proposalId) })
        },
      },
    },
  }
}

import { QueryClient, createRpc } from '@cosmjs/stargate'
import { ProposalStatus } from '@provider/codec/cosmos/gov/v1beta1/gov'
import {
  QueryClientImpl,
  QueryDepositResponse,
  QueryDepositsResponse,
  QueryParamsResponse,
  QueryProposalResponse,
  QueryProposalsResponse,
  QueryVoteResponse,
  QueryVotesResponse,
} from '@provider/codec/cosmos/gov/v1beta1/query'

export interface GovExtension {
  gov: {
    unverified: {
      params: (paramsType: string) => Promise<QueryParamsResponse>
      proposals: (
        proposalStatus: ProposalStatus,
        voter: string,
        depositor: string
      ) => Promise<QueryProposalsResponse>
      proposal: (proposalId: Long.Long) => Promise<QueryProposalResponse>
      vote: (proposalId: Long.Long, voter: string) => Promise<QueryVoteResponse>
      votes: (proposalId: Long.Long) => Promise<QueryVotesResponse>
      deposit: (
        proposalId: Long.Long,
        depositor: string
      ) => Promise<QueryDepositResponse>
      deposits: (proposalId: Long.Long) => Promise<QueryDepositsResponse>
    }
  }
}

export function setupGovExtension(base: QueryClient): GovExtension {
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
        proposal: (proposalId: Long.Long) => {
          return queryService.Proposal({
            proposalId: proposalId,
          })
        },
        vote: (proposalId: Long.Long, voter: string) => {
          return queryService.Vote({
            proposalId: proposalId,
            voter: voter,
          })
        },
        votes: (proposalId: Long.Long) => {
          return queryService.Votes({ proposalId: proposalId })
        },
        deposit: (proposalId: Long.Long, depositor: string) => {
          return queryService.Deposit({
            proposalId: proposalId,
            depositor: depositor,
          })
        },
        deposits: (proposalId: Long.Long) => {
          return queryService.Deposits({
            proposalId: proposalId,
          })
        },
      },
    },
  }
}

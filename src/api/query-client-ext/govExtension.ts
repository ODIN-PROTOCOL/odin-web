import { QueryClient, createRpc } from '@cosmjs/stargate'
import { ProposalStatus } from '@/api/codec/cosmos/gov/v1beta1/gov'
import { QueryClientImpl } from '@/api/codec/cosmos/gov/v1beta1/query'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function setupGovExtension(base: QueryClient) {
  const rpc = createRpc(base)
  // Use this service to get easy typed access to query methods
  // This cannot be used for proof verification
  const queryService = new QueryClientImpl(rpc)
  return {
    gov: {
      unverified: {
        params: async (paramsType: string) => {
          return await queryService.Params({ paramsType: paramsType })
        },
        proposals: async (
          proposalStatus: ProposalStatus,
          voter: string,
          depositor: string
        ) => {
          const { proposals } = await queryService.Proposals({
            proposalStatus: proposalStatus,
            voter: voter,
            depositor: depositor,
          })
          return proposals
        },
        proposal: async (proposalId: Long.Long) => {
          return await queryService.Proposal({ proposalId: proposalId })
        },
        vote: async (proposalId: Long.Long, voter: string) => {
          return await queryService.Vote({
            proposalId: proposalId,
            voter: voter,
          })
        },
        votes: async (proposalId: Long.Long) => {
          const { votes } = await queryService.Votes({ proposalId: proposalId })
          return votes
        },
        deposit: async (proposalId: Long.Long, depositor: string) => {
          return await queryService.Deposit({
            proposalId: proposalId,
            depositor: depositor,
          })
        },
        deposits: async (proposalId: Long.Long) => {
          const { deposits } = await queryService.Deposits({
            proposalId: proposalId,
          })
          return deposits
        },
      },
    },
  }
}

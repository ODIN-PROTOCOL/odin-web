import { QueryClient, createRpc } from '@cosmjs/stargate'
import { QueryClientImpl } from '@/api/codec/mint/query'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function setupMintExtension(base: QueryClient) {
  const rpc = createRpc(base)
  // Use this service to get easy typed access to query methods
  // This cannot be used for proof verification
  const queryService = new QueryClientImpl(rpc)
  return {
    mint: {
      unverified: {
        params: async () => {
          const { params } = await queryService.Params({})
          return params
        },
        inflation: async () => {
          const { inflation } = await queryService.Inflation({})
          return inflation
        },
        annualProvisions: async () => {
          const { annualProvisions } = await queryService.AnnualProvisions({})
          return annualProvisions
        },
        ethIntegrationAddress: async () => {
          return await queryService.EthIntegrationAddress({})
        },
        treasuryPool: async () => {
          return await queryService.TreasuryPool({})
        },
      },
    },
  }
}

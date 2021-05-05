import { QueryClient, createRpc } from '@cosmjs/stargate'
import { QueryClientImpl } from '@/api/codec/coinswap/query'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function setupCoinswapExtension(base: QueryClient) {
  const rpc = createRpc(base)
  // Use this service to get easy typed access to query methods
  // This cannot be used for proof verification
  const queryService = new QueryClientImpl(rpc)
  return {
    coinswap: {
      unverified: {
        params: async () => {
          const { params } = await queryService.Params({})
          return params
        },
        rate: async (from: string, to: string) => {
          const { rate } = await queryService.Rate({ from: from, to: to })
          return rate
        },
      },
    },
  }
}

import { QueryClient, createProtobufRpcClient } from '@cosmjs/stargate'
import {
  QueryClientImpl,
  QueryParamsResponse,
  QueryRateResponse,
} from '@provider/codec/coinswap/query'

export interface CoinswapExt {
  coinswap: {
    unverified: {
      params: () => Promise<QueryParamsResponse>
      rate: (from: string, to: string) => Promise<QueryRateResponse>
    }
  }
}

export function setupCoinswapExt(base: QueryClient): CoinswapExt {
  const rpc = createProtobufRpcClient(base)
  // Use this service to get easy typed access to query methods
  // This cannot be used for proof verification
  const queryService = new QueryClientImpl(rpc)
  return {
    coinswap: {
      unverified: {
        params: () => {
          return queryService.Params({})
        },
        rate: (from: string, to: string) => {
          return queryService.Rate({ from: from, to: to })
        },
      },
    },
  }
}

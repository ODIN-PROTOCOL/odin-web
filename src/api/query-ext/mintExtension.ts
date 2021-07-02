import { QueryClient, createProtobufRpcClient } from '@cosmjs/stargate'
import {
  QueryAnnualProvisionsResponse,
  QueryClientImpl,
  QueryEthIntegrationAddressResponse,
  QueryInflationResponse,
  QueryParamsResponse,
  QueryTreasuryPoolResponse,
} from '@provider/codec/mint/query'

export interface MintExt {
  mint: {
    unverified: {
      params: () => Promise<QueryParamsResponse>
      inflation: () => Promise<QueryInflationResponse>
      annualProvisions: () => Promise<QueryAnnualProvisionsResponse>
      ethIntegrationAddress: () => Promise<QueryEthIntegrationAddressResponse>
      treasuryPool: () => Promise<QueryTreasuryPoolResponse>
    }
  }
}

export function setupMintExt(base: QueryClient): MintExt {
  const rpc = createProtobufRpcClient(base)
  // Use this service to get easy typed access to query methods
  // This cannot be used for proof verification
  const queryService = new QueryClientImpl(rpc)
  return {
    mint: {
      unverified: {
        params: () => {
          return queryService.Params({})
        },
        inflation: () => {
          return queryService.Inflation({})
        },
        annualProvisions: () => {
          return queryService.AnnualProvisions({})
        },
        ethIntegrationAddress: () => {
          return queryService.EthIntegrationAddress({})
        },
        treasuryPool: () => {
          return queryService.TreasuryPool({})
        },
      },
    },
  }
}

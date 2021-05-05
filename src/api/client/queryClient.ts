import { QueryClient } from '@cosmjs/stargate'
import {
  CoinswapExtension,
  setupCoinswapExtension,
} from '@/api/query-client-ext/coinswapExtension'
import {
  GovExtension,
  setupGovExtension,
} from '@/api/query-client-ext/govExtension'
import {
  MintExtension,
  setupMintExtension,
} from '@/api/query-client-ext/mintExtension'
import {
  OracleExtension,
  setupOracleExtension,
} from '@/api/query-client-ext/oracleExtension'
import { Tendermint34Client } from '@cosmjs/tendermint-rpc'

type OdinQueryClient = QueryClient &
  CoinswapExtension &
  GovExtension &
  MintExtension &
  OracleExtension

let _queryClient: OdinQueryClient | null

export function initQueryClient(tmClient: Tendermint34Client): OdinQueryClient {
  if (_queryClient) {
    throw new ReferenceError('Query client is already initialized!')
  }
  _queryClient = QueryClient.withExtensions(
    tmClient,
    setupCoinswapExtension,
    setupGovExtension,
    setupMintExtension,
    setupOracleExtension
  )
  return _queryClient
}

export function getQueryClient(): OdinQueryClient {
  if (!_queryClient) {
    throw new ReferenceError('Query client not initialized!')
  }
  return _queryClient
}

export function clearQueryClient(): void {
  _queryClient = null
}

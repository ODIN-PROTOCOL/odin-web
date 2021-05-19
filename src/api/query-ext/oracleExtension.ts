import { QueryClient, createRpc } from '@cosmjs/stargate'
import {
  QueryActiveValidatorsResponse,
  QueryClientImpl,
  QueryCountsResponse,
  QueryDataProvidersPoolResponse,
  QueryDataResponse,
  QueryDataSourceResponse,
  QueryDataSourcesResponse,
  QueryOracleScriptResponse,
  QueryOracleScriptsResponse,
  QueryParamsResponse,
  QueryReportersResponse,
  QueryRequestReportsResponse,
  QueryRequestResponse,
  QueryRequestSearchResponse,
  QueryRequestsResponse,
  QueryValidatorResponse,
} from '@provider/codec/oracle/v1/query'
import { NumLike, toLong } from '@/helpers/casts'

export interface OracleExt {
  oracle: {
    unverified: {
      params: () => Promise<QueryParamsResponse>
      counts: () => Promise<QueryCountsResponse>
      data: (dataHash: string) => Promise<QueryDataResponse>
      dataSource: (dataSourceId: NumLike) => Promise<QueryDataSourceResponse>
      dataSources: (
        limit: NumLike,
        offset?: NumLike
      ) => Promise<QueryDataSourcesResponse>
      oracleScript: (
        oracleScriptId: NumLike
      ) => Promise<QueryOracleScriptResponse>
      oracleScripts: (
        limit: NumLike,
        offset?: NumLike
      ) => Promise<QueryOracleScriptsResponse>
      request: (requestId: NumLike) => Promise<QueryRequestResponse>
      requests: (
        limit: NumLike,
        offset?: NumLike
      ) => Promise<QueryRequestsResponse>
      reports: (
        requestId: NumLike,
        limit: NumLike,
        offset?: NumLike
      ) => Promise<QueryRequestReportsResponse>
      validator: (validatorAddress: string) => Promise<QueryValidatorResponse>
      reporters: (validatorAddress: string) => Promise<QueryReportersResponse>
      activeValidators: () => Promise<QueryActiveValidatorsResponse>
      requestSearch: (
        oracleScriptId: NumLike,
        calldata: Uint8Array,
        askCount: NumLike,
        minCount: NumLike
      ) => Promise<QueryRequestSearchResponse>
      dataProvidersPool: () => Promise<QueryDataProvidersPoolResponse>
    }
  }
}

export function setupOracleExt(base: QueryClient): OracleExt {
  const rpc = createRpc(base)
  // Use this service to get easy typed access to query methods
  // This cannot be used for proof verification
  const queryService = new QueryClientImpl(rpc)
  return {
    oracle: {
      unverified: {
        params: () => {
          return queryService.Params({})
        },
        counts: () => {
          return queryService.Counts({})
        },
        data: (dataHash: string) => {
          return queryService.Data({ dataHash: dataHash })
        },
        dataSource: (dataSourceId: NumLike) => {
          return queryService.DataSource({
            dataSourceId: toLong(dataSourceId),
          })
        },
        dataSources: (limit: NumLike, offset = 0) => {
          return queryService.DataSources({
            pagination: {
              key: new Uint8Array(),
              countTotal: false,
              limit: toLong(limit),
              offset: toLong(offset),
            },
          })
        },
        oracleScript: (oracleScriptId: NumLike) => {
          return queryService.OracleScript({
            oracleScriptId: toLong(oracleScriptId),
          })
        },
        oracleScripts: (limit: NumLike, offset = 0) => {
          return queryService.OracleScripts({
            pagination: {
              key: new Uint8Array(),
              countTotal: false,
              limit: toLong(limit),
              offset: toLong(offset),
            },
          })
        },
        request: (requestId: NumLike) => {
          return queryService.Request({
            requestId: toLong(requestId),
          })
        },
        requests: (limit: NumLike, offset = 0) => {
          return queryService.Requests({
            pagination: {
              key: new Uint8Array(),
              countTotal: false,
              limit: toLong(limit),
              offset: toLong(offset),
            },
          })
        },
        reports: (requestId: NumLike, limit: NumLike, offset = 0) => {
          return queryService.RequestReports({
            requestId: toLong(requestId),
            pagination: {
              key: new Uint8Array(),
              countTotal: false,
              limit: toLong(limit),
              offset: toLong(offset),
            },
          })
        },
        validator: (validatorAddress: string) => {
          return queryService.Validator({
            validatorAddress: validatorAddress,
          })
        },
        reporters: (validatorAddress: string) => {
          return queryService.Reporters({
            validatorAddress: validatorAddress,
          })
        },
        activeValidators: () => {
          return queryService.ActiveValidators({})
        },
        requestSearch: (
          oracleScriptId: NumLike,
          calldata: Uint8Array,
          askCount: NumLike,
          minCount: NumLike
        ) => {
          return queryService.RequestSearch({
            oracleScriptId: toLong(oracleScriptId),
            calldata: calldata,
            askCount: toLong(askCount),
            minCount: toLong(minCount),
          })
        },
        dataProvidersPool: () => {
          return queryService.DataProvidersPool({})
        },
      },
    },
  }
}

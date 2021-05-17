import Long from 'long'
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

export interface OracleExt {
  oracle: {
    unverified: {
      params: () => Promise<QueryParamsResponse>
      counts: () => Promise<QueryCountsResponse>
      data: (dataHash: string) => Promise<QueryDataResponse>
      dataSource: (dataSourceId: Long.Long) => Promise<QueryDataSourceResponse>
      dataSources: (
        limit: Long.Long,
        offset?: Long.Long
      ) => Promise<QueryDataSourcesResponse>
      oracleScript: (
        oracleScriptId: Long.Long
      ) => Promise<QueryOracleScriptResponse>
      oracleScripts: (
        limit: Long.Long,
        offset?: Long.Long
      ) => Promise<QueryOracleScriptsResponse>
      request: (requestId: Long.Long) => Promise<QueryRequestResponse>
      requests: (
        limit: Long.Long,
        offset?: Long.Long
      ) => Promise<QueryRequestsResponse>
      reports: (
        requestId: Long.Long,
        limit: Long.Long,
        offset?: Long.Long
      ) => Promise<QueryRequestReportsResponse>
      validator: (validatorAddress: string) => Promise<QueryValidatorResponse>
      reporters: (validatorAddress: string) => Promise<QueryReportersResponse>
      activeValidators: () => Promise<QueryActiveValidatorsResponse>
      requestSearch: (
        oracleScriptId: Long.Long,
        calldata: Uint8Array,
        askCount: Long.Long,
        minCount: Long.Long
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
        dataSource: (dataSourceId: Long.Long) => {
          return queryService.DataSource({
            dataSourceId: dataSourceId,
          })
        },
        dataSources: (limit: Long.Long, offset = Long.ZERO) => {
          return queryService.DataSources({
            pagination: {
              key: new Uint8Array(),
              countTotal: false,
              limit: limit,
              offset: offset,
            },
          })
        },
        oracleScript: (oracleScriptId: Long.Long) => {
          return queryService.OracleScript({
            oracleScriptId: oracleScriptId,
          })
        },
        oracleScripts: (limit: Long.Long, offset = Long.ZERO) => {
          return queryService.OracleScripts({
            pagination: {
              key: new Uint8Array(),
              countTotal: false,
              limit: limit,
              offset: offset,
            },
          })
        },
        request: (requestId: Long.Long) => {
          return queryService.Request({
            requestId: requestId,
          })
        },
        requests: (limit: Long.Long, offset = Long.ZERO) => {
          return queryService.Requests({
            pagination: {
              key: new Uint8Array(),
              countTotal: false,
              limit: limit,
              offset: offset,
            },
          })
        },
        reports: (
          requestId: Long.Long,
          limit: Long.Long,
          offset = Long.ZERO
        ) => {
          return queryService.RequestReports({
            requestId: requestId,
            pagination: {
              key: new Uint8Array(),
              countTotal: false,
              limit: limit,
              offset: offset,
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
          oracleScriptId: Long.Long,
          calldata: Uint8Array,
          askCount: Long.Long,
          minCount: Long.Long
        ) => {
          return queryService.RequestSearch({
            oracleScriptId: oracleScriptId,
            calldata: calldata,
            askCount: askCount,
            minCount: minCount,
          })
        },
        dataProvidersPool: () => {
          return queryService.DataProvidersPool({})
        },
      },
    },
  }
}

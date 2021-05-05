import Long from 'long'
import { QueryClient, createRpc } from '@cosmjs/stargate'
import { QueryClientImpl } from '@/api/codec/oracle/v1/query'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function setupOracleExtension(base: QueryClient) {
  const rpc = createRpc(base)
  // Use this service to get easy typed access to query methods
  // This cannot be used for proof verification
  const queryService = new QueryClientImpl(rpc)
  return {
    oracle: {
      unverified: {
        params: async () => {
          const { params } = await queryService.Params({})
          return params
        },
        counts: async () => {
          return await queryService.Counts({})
        },
        data: async (dataHash: string) => {
          const { data } = await queryService.Data({ dataHash: dataHash })
          return data
        },
        dataSource: async (dataSourceId: Long.Long) => {
          const { dataSource } = await queryService.DataSource({
            dataSourceId: dataSourceId,
          })
          return dataSource
        },
        dataSources: async (limit: Long.Long, offset: Long.Long) => {
          const { dataSources } = await queryService.DataSources({
            pagination: {
              key: new Uint8Array(),
              countTotal: false,
              reverse: false,
              limit: limit,
              offset: offset,
            },
          })
          return dataSources
        },
        oracleScript: async (oracleScriptId: Long.Long) => {
          const { oracleScript } = await queryService.OracleScript({
            oracleScriptId: oracleScriptId,
          })
          return oracleScript
        },
        oracleScripts: async (limit: Long.Long, offset: Long.Long) => {
          const { oracleScripts } = await queryService.OracleScripts({
            pagination: {
              key: new Uint8Array(),
              countTotal: false,
              reverse: false,
              limit: limit,
              offset: offset,
            },
          })
          return oracleScripts
        },
        request: async (requestId: Long.Long) => {
          return await queryService.Request({ requestId: requestId })
        },
        requests: async (limit: Long.Long, offset: Long.Long) => {
          const { requests } = await queryService.Requests({
            pagination: {
              key: new Uint8Array(),
              countTotal: false,
              reverse: false,
              limit: limit,
              offset: offset,
            },
          })
          return requests
        },
        reports: async (
          requestId: Long.Long,
          limit: Long.Long,
          offset: Long.Long
        ) => {
          const { reports } = await queryService.RequestReports({
            requestId: requestId,
            pagination: {
              key: new Uint8Array(),
              countTotal: false,
              reverse: false,
              limit: limit,
              offset: offset,
            },
          })
          return reports
        },
        validator: async (validatorAddress: string) => {
          return await queryService.Validator({
            validatorAddress: validatorAddress,
          })
        },
        reporters: async (validatorAddress: string) => {
          return await queryService.Reporters({
            validatorAddress: validatorAddress,
          })
        },
        activeValidators: async () => {
          return await queryService.ActiveValidators({})
        },
        requestSearch: async (
          oracleScriptId: Long.Long,
          calldata: Uint8Array,
          askCount: Long.Long,
          minCount: Long.Long
        ) => {
          const { requestPacketData } = await queryService.RequestSearch({
            oracleScriptId: oracleScriptId,
            calldata: calldata,
            askCount: askCount,
            minCount: minCount,
          })
          return requestPacketData
        },
        dataProvidersPool: async () => {
          return await queryService.DataProvidersPool({})
        },
      },
    },
  }
}

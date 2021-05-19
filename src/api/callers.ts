import {
  MsgCreateDataSource,
  MsgCreateOracleScript,
  MsgRequestData,
} from '@provider/codec/oracle/v1/tx'
import { MsgExchange } from '@provider/codec/coinswap/tx'
import { api } from './api'
import { wallet } from './wallet'
import { mapResponse, longsToStrings } from './callersHelpers'

const makeCallers = () => {
  const broadcaster = api.makeBroadcastCaller.bind(api)
  const querier = api.makeQueryCaller.bind(api)

  return {
    createDataSource: broadcaster<MsgCreateDataSource>(
      '/oracle.v1.MsgCreateDataSource',
      MsgCreateDataSource
    ),
    getDataSources: querier((qc) =>
      mapResponse(qc.oracle.unverified.dataSources, longsToStrings)
    ),

    createOracleScript: broadcaster<MsgCreateOracleScript>(
      '/oracle.v1.MsgCreateOracleScript',
      MsgCreateOracleScript
    ),
    getOracleScripts: querier((qc) =>
      mapResponse(qc.oracle.unverified.oracleScripts, longsToStrings)
    ),

    createRequest: broadcaster<MsgRequestData>(
      '/oracle.v1.MsgRequestData',
      MsgRequestData
    ),
    getRequests: querier((qc) =>
      mapResponse(qc.oracle.unverified.requests, (response) => {
        return longsToStrings({
          ...response,
          requests: response.requests.map((req) => {
            const result = req.responsePacketData?.result
            const resultDecoded = new TextDecoder().decode(result)
            return {
              ...req,
              responsePacketData: {
                ...req?.responsePacketData,
                resultDecoded,
              },
            }
          }),
        })
      })
    ),

    getProposals: querier((qc) =>
      mapResponse(qc.gov.unverified.proposals, longsToStrings)
    ),

    getBalances: querier((qc) => () => {
      const myAddress = wallet.account.address
      return qc.bank.unverified.allBalances(myAddress).then(longsToStrings)
    }),

    createExchange: broadcaster<MsgExchange>(
      '/coinswap.MsgExchange',
      MsgExchange
    ),
    getRate: querier((qc) =>
      mapResponse(qc.coinswap.unverified.rate, longsToStrings)
    ),
  }
}

export const callers = makeCallers()

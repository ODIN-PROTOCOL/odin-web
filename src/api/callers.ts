import {
  MsgCreateDataSource,
  MsgCreateOracleScript,
  MsgRequestData,
} from '@provider/codec/oracle/v1/tx'
import { MsgExchange } from '@provider/codec/coinswap/tx'
import { api } from './api'
import { wallet } from './wallet'
import { mapResponse } from './callersHelpers'

const makeCallers = () => {
  const broadcaster = api.makeBroadcastCaller.bind(api)
  const querier = api.makeQueryCaller.bind(api)

  return {
    createDataSource: broadcaster<MsgCreateDataSource>(
      '/oracle.v1.MsgCreateDataSource',
      MsgCreateDataSource
    ),
    getDataSources: querier((qc) => qc.oracle.unverified.dataSources),

    createOracleScript: broadcaster<MsgCreateOracleScript>(
      '/oracle.v1.MsgCreateOracleScript',
      MsgCreateOracleScript
    ),
    getOracleScripts: querier((qc) => qc.oracle.unverified.oracleScripts),

    createRequest: broadcaster<MsgRequestData>(
      '/oracle.v1.MsgRequestData',
      MsgRequestData
    ),
    getRequests: querier((qc) =>
      mapResponse(qc.oracle.unverified.requests, (response) => {
        return {
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
        }
      })
    ),

    getProposals: querier((qc) => qc.gov.unverified.proposals),

    getBalances: querier((qc) => () => {
      const myAddress = wallet.account.address
      return qc.bank.unverified.allBalances(myAddress)
    }),

    createExchange: broadcaster<MsgExchange>(
      '/coinswap.MsgExchange',
      MsgExchange
    ),
    getRate: querier((qc) => qc.coinswap.unverified.rate),
  }
}

export const callers = makeCallers()

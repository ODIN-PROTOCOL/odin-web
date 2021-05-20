import {
  MsgCreateDataSource,
  MsgCreateOracleScript,
  MsgRequestData,
} from '@provider/codec/oracle/v1/tx'
import { MsgExchange } from '@provider/codec/coinswap/tx'
import { api } from './api'
import { wallet } from './wallet'
import { mapResponse, longsToStrings } from './callers-helpers/callersHelpers'
import { decodeProposalContent } from './callers-helpers/decodeProposalContent'

const makeCallers = () => {
  const broadcaster = api.makeBroadcastCaller.bind(api)
  const querier = api.makeQueryCaller.bind(api)

  return {
    createDataSource: broadcaster<MsgCreateDataSource>(
      '/oracle.v1.MsgCreateDataSource',
      MsgCreateDataSource
    ),
    getDataSources: querier((qc) =>
      mapResponse(qc.oracle.unverified.dataSources, (r) => longsToStrings(r))
    ),

    createOracleScript: broadcaster<MsgCreateOracleScript>(
      '/oracle.v1.MsgCreateOracleScript',
      MsgCreateOracleScript
    ),
    getOracleScripts: querier((qc) =>
      mapResponse(qc.oracle.unverified.oracleScripts, (r) => longsToStrings(r))
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
                result: resultDecoded,
              },
            }
          }),
        })
      })
    ),

    getProposals: querier((qc) =>
      mapResponse(qc.gov.unverified.proposals, (response) => {
        return longsToStrings({
          ...response,
          proposals: response.proposals.map((proposal) => {
            return {
              ...proposal,
              content: decodeProposalContent(proposal.content),
            }
          }),
        })
      })
    ),

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

import {
  MsgCreateDataSource,
  MsgCreateOracleScript,
  MsgRequestData,
} from '@provider/codec/oracle/v1/tx'
import { MsgExchange } from '@provider/codec/coinswap/tx'
import { MsgDeposit, MsgVote } from '@provider/codec/cosmos/gov/v1beta1/tx'
import { api } from './api'
import { wallet } from './wallet'
import { mapResponse } from './callers-helpers/callersHelpers'
import { decodeProposalContent } from './callers-helpers/decodeProposalContent'

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
                result: resultDecoded,
              },
            }
          }),
        }
      })
    ),

    getProposals: querier((qc) =>
      mapResponse(qc.gov.unverified.proposals, (response) => {
        // TODO: remove
        qc.gov.unverified
          .vote(response.proposals[0].proposalId, wallet.account.address)
          .then(console.log)
        qc.gov.unverified
          .tallyResult(response.proposals[0].proposalId)
          .then(console.log)

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
    proposalDeposit: broadcaster<MsgDeposit>(
      '/cosmos.gov.v1beta1.MsgDeposit',
      MsgDeposit
    ),
    proposalVote: broadcaster<MsgVote>('/cosmos.gov.v1beta1.MsgVote', MsgVote),

    getBalances: querier((qc) => () => {
      const myAddress = wallet.account.address
      return qc.bank.unverified.allBalances(myAddress)
    }),

    createExchange: broadcaster<MsgExchange>(
      '/coinswap.MsgExchange',
      MsgExchange
    ),
    getRate: querier((qc) => qc.coinswap.unverified.rate),

    getTreasuryPool: querier((qc) => qc.mint.unverified.treasuryPool),
    getTotalSupply: querier((qc) => qc.bank.unverified.totalSupply),
  }
}

export const callers = makeCallers()

import {
  MsgCreateDataSource,
  MsgCreateOracleScript,
  MsgRequestData,
} from '@provider/codec/oracle/v1/tx'
import { MsgExchange } from '@provider/codec/coinswap/tx'
import { api } from './api'
import { wallet } from './wallet'

const makeCallers = () => {
  const bc = api.makeBroadcastCaller.bind(api)
  const qc = api.makeQueryCaller.bind(api)

  return {
    createDataSource: bc<MsgCreateDataSource>(
      '/oracle.v1.MsgCreateDataSource',
      MsgCreateDataSource
    ),
    getDataSources: qc((q) => q.oracle.unverified.dataSources),

    createOracleScript: bc<MsgCreateOracleScript>(
      '/oracle.v1.MsgCreateOracleScript',
      MsgCreateOracleScript
    ),
    getOracleScripts: qc((q) => q.oracle.unverified.oracleScripts),

    createRequest: bc<MsgRequestData>(
      '/oracle.v1.MsgRequestData',
      MsgRequestData
    ),
    getRequests: qc((q) => q.oracle.unverified.requests),

    getBalances: qc((q) => () => {
      const myAddress = wallet.account.address
      return q.bank.unverified.allBalances(myAddress)
    }),

    createExchange: bc<MsgExchange>('/coinswap.MsgExchange', MsgExchange),
    getRate: qc((q) => q.coinswap.unverified.rate),
  }
}

export const callers = makeCallers()

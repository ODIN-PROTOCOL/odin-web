import {
  MsgCreateDataSource,
  MsgCreateOracleScript,
  MsgRequestData,
} from '@provider/codec/oracle/v1/tx'
import { api } from './api'

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
  }
}

export const callers = makeCallers()

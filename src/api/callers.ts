import axios from 'axios'
import { MsgWithdrawCoinsToAccFromTreasury } from '@provider/codec/mint/tx'
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx'
import {
  MsgCreateDataSource,
  MsgCreateOracleScript,
  MsgRequestData,
  MsgEditOracleScript,
  MsgEditDataSource,
} from '@provider/codec/oracle/v1/tx'
import { MsgSubmitProposal } from '@provider/codec/cosmos/gov/v1beta1/tx'
import { MsgExchange } from '@provider/codec/coinswap/tx'
import { MsgDeposit, MsgVote } from '@provider/codec/cosmos/gov/v1beta1/tx'
import { api } from './api'
import { wallet } from './wallet'
import { mapResponse, sendPost, sendGet } from './callersHelpers'
import { cacheAnswers, getAPIDate } from '@/helpers/requests'
import { decodeProposal } from '@/helpers/proposalDecoders'

import { NumLike } from '@/helpers/casts'
import { API_CONFIG } from './api-config'
import {
  MsgDelegate,
  MsgUndelegate,
  MsgBeginRedelegate,
} from 'cosmjs-types/cosmos/staking/v1beta1/tx'
import { Proposal } from '@provider/codec/cosmos/gov/v1beta1/gov'
import { MsgWithdrawDelegatorReward } from 'cosmjs-types/cosmos/distribution/v1beta1/tx'
import { axiosWrapper } from '@/helpers/functions'

import {
  BlocksQuery,
  TxQuery,
  TxVolumePerDaysQuery,
  BlockQuery,
  ValidatorsQuery,
  AvgFeeQuery,
  BlockAvgSizePerDay,
  BlockAvgTimePerDay,
  TxAtBlockQuery,
  TxFromAddressQuery,
} from '@/graphql/queries'
import {
  BlockMetaResponse,
  TreasuryPoolResponse,
  ValidatorsResponse,
} from '@/graphql/types/responses'
import {
  QueryHeightVariables,
  BlocksQueryVariables,
  BlockQueryVariables,
} from '@/graphql/types/vars'

import { ApolloClient, NormalizedCacheObject } from '@apollo/client/core'
import { apolloClient } from './apollo-provider'
import { ProposalByIdQuery, ProposalQuery, TreasuryPoolQuery } from '@/graphql/queries/Governance'
import { Data } from '@bandprotocol/bandchain.js'
import { DataSourceQuery } from '@/graphql/queries/DataSource'

const makeCallers = () => {
  const broadcaster = api.makeBroadcastCaller.bind(api)
  const multiBroadcaster = api.makeMultiBroadcastCaller.bind(api)
  const querier = api.makeQueryCaller.bind(api)
  const tmQuerier = api.makeTendermintCaller.bind(api)

  return {
    getValidators: () => {
      return apolloClient.query<ValidatorsResponse>({ query: ValidatorsQuery })
    },
    getTxVolumePerDays: (startTime: Date, endTime: Date) => {
      return apolloClient.query({ query: TxVolumePerDaysQuery, variables: {} })
    },
    getTxSearchFromTelemetry: (
      page_number: number,
      page_limit: number,
      page_order: string,
      block = 0,
    ) => {
      return apolloClient.query({
        query: TxQuery,
        variables: {
          block: block,
          limit: page_limit,
          offset: page_number * page_limit,
        },
      })
    },
    getTxByBlock: (
      page_number: number,
      page_limit: number,
      page_order: string,
      block = 0,
    ) => {
      return apolloClient.query({
        query: TxAtBlockQuery,
        variables: {
          height: block,
          limit: page_limit,
          offset: page_number * page_limit,
        },
      })
    },
    getAccountIndexedTx: (
      page_number: number,
      page_limit: number,
      address: string,
      page_order = "desc",
      tx_type: string,
    ) => {
      return apolloClient.query({
        query: TxFromAddressQuery,
        variables: {
          address: `{${address}}`,
          tx_type: tx_type,          
          limit: page_limit,
          order: page_order,
          offset: page_number * page_limit,          
        },
      })
    },
    getProposals: (
      offset: number,
      page_limit: number,
      order = "desc",
    ) => {
      return apolloClient.query({
        query: ProposalQuery,
        variables: { limit: page_limit, order: order, offset: offset },
      })
    },
    getProposal: (id: number) => {
      return apolloClient.query({
        query: ProposalByIdQuery,
        variables: { id: id },
      })
    },
    getBlockchain: (page_limit = 10, order = 'desc', offset = 0) => {
      return apolloClient.query<BlockMetaResponse, BlocksQueryVariables>({
        query: BlocksQuery,
        variables: { limit: page_limit, order: order, offset: offset },
      })
    },
    getBlock: (hash: string | null = "", height = 0) => {
      return apolloClient.query<BlockMetaResponse, BlockQueryVariables>({
        query: BlockQuery,
        variables: { hash: hash, height: height },
      })
    },
    getProposedBlocks: (
      proposer: string,
      page_number: number,
      page_limit: number,
    ) => {
      return sendGet(
        `${API_CONFIG.telemetryUrl}/validator/${proposer}/transactions?page[number]=${page_number}&page[limit]=${page_limit}&page[order]=desc`,
      )
    },
    getAvgSizePerDays: (startTime: Date, endTime: Date) => {
      return apolloClient.query({
        query: BlockAvgSizePerDay,
        variables: { start: startTime, end: endTime },
      })
    },
    getAvgTimePerDays: (startTime: Date, endTime: Date) => {
      return apolloClient.query({
        query: BlockAvgTimePerDay,
        variables: { start: startTime, end: endTime },
      })
    },
    getAvgTxFeePerDays: (startTime: Date, endTime: Date) => {
      return apolloClient.query({
        query: AvgFeeQuery,
        variables: { start: startTime, end: endTime },
      })
    },
    getCounts: querier(qc => qc.oracle.unverified.counts),
    createDataSource: broadcaster<MsgCreateDataSource>(
      '/oracle.v1.MsgCreateDataSource',
      MsgCreateDataSource,
    ),
    editDataSource: broadcaster<MsgEditDataSource>(
      '/oracle.v1.MsgEditDataSource',
      MsgEditDataSource,
    ),
    getDataSources: querier(qc => qc.oracle.unverified.dataSources),
    getSortedDataSources: (
      offset: number,
      page_limit: number,
      activities: string,
      owner: string,
      name: string,
    ) => {
      return apolloClient.query({
        query: DataSourceQuery,
        variables: { offset: offset, limit: page_limit },
      })
    },
    getDataSourceRequestCount: (data_source_id: number) => {
      return axiosWrapper.get(
        `${API_CONFIG.telemetryUrl}/requests/data_sources/${data_source_id}`,
      )
    },
    getDataSource: querier(qc => qc.oracle.unverified.dataSource),
    createOracleScript: broadcaster<MsgCreateOracleScript>(
      '/oracle.v1.MsgCreateOracleScript',
      MsgCreateOracleScript,
    ),
    editOracleScript: broadcaster<MsgEditOracleScript>(
      '/oracle.v1.MsgEditOracleScript',
      MsgEditOracleScript,
    ),
    getOracleScripts: querier(qc => qc.oracle.unverified.oracleScripts),
    getOdinPrice: () => {
      return axios.get(API_CONFIG.ordinPriceUrl)
    },
    getSortedOracleScripts: (
      page_number: number,
      page_limit: number,
      activities: string,
      owner: string,
      name: string,
    ) => {
      return sendGet(
        `${API_CONFIG.telemetryUrl}/oracle_scripts?page[number]=${page_number}&page[limit]=${page_limit}&sort=${activities}&owner=${owner}&name=${name}`,
      )
    },
    getAccountTx: (
      page_number: number,
      page_limit: number,
      owner: string,
      page_order: string,
      tx_type: string,
    ) => {
      return sendGet(
        `${API_CONFIG.telemetryUrl}/account_txs/${owner}?page[number]=${page_number}&page[limit]=${page_limit}&page[order]=${page_order}&type=${tx_type}`,
      )
    },
    getBlockSize: (height: number) => {
      return axiosWrapper.get(`${API_CONFIG.telemetryUrl}/block_size/${height}`)
    },
    getChannel: querier(qc => qc.ibc.channel.allChannels),
    getConnections: querier(qc => qc.ibc.connection.allConnections),
    getClientState: querier(qc => qc.ibc.client.state),
    getOracleScript: querier(qc => qc.oracle.unverified.oracleScript),
    createRequest: broadcaster<MsgRequestData>(
      '/oracle.v1.MsgRequestData',
      MsgRequestData,
    ),
    getRequests: (page_limit: number, page_number: number) => {
      return axiosWrapper.get(
        `${API_CONFIG.rpc}api/oracle/requests?limit=${page_limit}&offset=${page_number}&reverse=true`,
      )
    },
    getRequest: (id: number) => {
      return axiosWrapper.get(`${API_CONFIG.rpc}api/oracle/requests/${id}`)
    },
    getOracleParams: querier(qc => qc.oracle.unverified.params),
    getBoundedToken: () => {
      return axiosWrapper.get(`${API_CONFIG.api}cosmos/staking/v1beta1/pool`)
    },
    getInflationRate: () => {
      return axiosWrapper.get(`${API_CONFIG.api}mint/parameters`)
    },
    getBoundedPool: () => {
      return axiosWrapper.get(`${API_CONFIG.api}cosmos/staking/v1beta1/pool`)
    },
    getSupply: () => {
      return axiosWrapper.get(`${API_CONFIG.api}cosmos/bank/v1beta1/supply`)
    },
    getCommunityPool: () => {
      return axiosWrapper.get(
        `${API_CONFIG.api}cosmos/distribution/v1beta1/community_pool`,
      )
    },
    createProposal: broadcaster<MsgSubmitProposal>(
      '/cosmos.gov.v1beta1.MsgSubmitProposal',
      MsgSubmitProposal,
    ),
    getReports: querier(qc => qc.oracle.unverified.reporters),
    getProposalVote: querier(qc => qc.gov.vote),
    getProposalVotes: querier(qc => qc.gov.votes),
    getProposalTally: querier(qc => qc.gov.tally),
    getProposer: (proposalId: NumLike) => {
      return sendGet(`${API_CONFIG.api}/gov/proposals/${proposalId}/proposer`)
    },
    getProposalChanges: () => {      
      return sendGet(`${API_CONFIG.graphqlActions}/vote_proposals`)
    },
    getProposalsStatistic: () => {
      return sendGet(
        `${API_CONFIG.graphqlActions}/vote_proposals_statistics`,
      )
    },
    getTreasuryPool: () => { 
      return apolloClient.query<TreasuryPoolResponse>({
        query: TreasuryPoolQuery       
      })
    },    
    getTopAccounts: (limit: number, offset: number, sortingBy: string) => {
      return axios.post(`${API_CONFIG.graphqlActions}/top_accounts`, {
        input: {
          limit: limit,
          offset: offset,
          sorting_by: sortingBy,
        },
      })
    },
    proposalDeposit: broadcaster<MsgDeposit>(
      '/cosmos.gov.v1beta1.MsgDeposit',
      MsgDeposit,
    ),
    proposalVote: broadcaster<MsgVote>('/cosmos.gov.v1beta1.MsgVote', MsgVote),
    getBalances: querier(qc => () => {
      const myAddress = wallet.account.address
      return qc.bank.allBalances(myAddress)
    }),

    createExchange: broadcaster<MsgExchange>(
      '/coinswap.MsgExchange',
      MsgExchange,
    ),
    createBinanceExchange: (req: {
      binance_address: string
      odin_address: string
      amount: string
      denom: string
    }) => {
      return sendPost(`${API_CONFIG.exBridge}/bsc/exchange`, req)
    },
    createSend: broadcaster<MsgSend>('/cosmos.bank.v1beta1.MsgSend', MsgSend),
    getRate: querier(qc => qc.coinswap.unverified.rate),
    getTotalSupply: querier(qc => qc.bank.totalSupply),

    getActiveValidators: querier(qc => qc.oracle.unverified.activeValidators),
    getValidator: querier(qc => qc.staking.validator),
    getValidatorStatus: querier(qc => qc.oracle.unverified.validator),
    getValidatorDelegations: querier(qc => qc.staking.validatorDelegations),

    validatorDelegate: broadcaster<MsgDelegate>(
      '/cosmos.staking.v1beta1.MsgDelegate',
      MsgDelegate,
    ),
    validatorDelegateToAnotherValidator: broadcaster<MsgBeginRedelegate>(
      '/cosmos.staking.v1beta1.MsgBeginRedelegate',
      MsgBeginRedelegate,
    ),
    validatorUndelegate: broadcaster<MsgUndelegate>(
      '/cosmos.staking.v1beta1.MsgUndelegate',
      MsgUndelegate,
    ),
    getDelegations: querier(qc => qc.staking.delegatorDelegations),
    getDelegation: querier(qc => qc.staking.delegation),
    withdrawCoinsToAcc: broadcaster<MsgWithdrawCoinsToAccFromTreasury>(
      '/mint.MsgWithdrawCoinsToAccFromTreasury',
      MsgWithdrawCoinsToAccFromTreasury,
    ),
    withdrawDelegatorRewards: broadcaster<MsgWithdrawDelegatorReward>(
      '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
      MsgWithdrawDelegatorReward,
    ),
    withdrawMultiDelegatorRewards: multiBroadcaster<MsgWithdrawDelegatorReward>(
      '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
      MsgWithdrawDelegatorReward,
    ),
    getDelegationDelegatorReward: querier(
      qc => qc.distribution.delegationRewards,
    ),
    getDelegationRewards: querier(qc => qc.distribution.delegationTotalRewards),
    getParams: querier(qc => qc.mint.unverified.params),
    faucetRequest: (req: { denom: string }) => {
      return sendPost(`${API_CONFIG.faucet}/request`, {
        address: wallet.account.address,
        denom: req.denom,
      })
    },
    getTxSearch: cacheAnswers(tmQuerier(tc => tc.txSearch.bind(tc))),
    getBlockOnHeight: (height: number | string = '') => {
      return axiosWrapper.get(`${API_CONFIG.rpc}block?height=${height}`)
    },
    getDataSourceCode: (id: string) => {
      return sendGet(`${API_CONFIG.telemetryUrl}/data_source_code/${id}`)
    },
    getOracleScriptRequests: (
      id: string,
      page_number: number,
      page_limit: number,
    ) => {
      return sendGet(
        `${API_CONFIG.telemetryUrl}/requests/oracle_scripts/${id}?page[number]=${page_number}&page[limit]=${page_limit}`,
      )
    },
    getDataSourceRequests: (
      id: string,
      page_number: number,
      page_limit: number,
    ) => {
      return sendGet(
        `${API_CONFIG.telemetryUrl}/requests/data_sources/${id}?page[number]=${page_number}&page[limit]=${page_limit}`,
      )
    },
    getValidatorInfo: () => {
      return axiosWrapper.get(`${API_CONFIG.rpc}validators`)
    },
    getValidatorUptime: () => {
      return sendGet(`${API_CONFIG.telemetryUrl}/validators`)
    },
    getOracleReports: (id: string, page_number: number, page_limit: number) => {
      return axiosWrapper.get(
        `${API_CONFIG.telemetryUrl}/validator/${id}/reports?page[number]=${page_number}&page[limit]=${page_limit}`,
      )
    },
    getUnverifiedBalances: querier(qc => qc.bank.balance),
    getAllBalances: querier(qc => qc.bank.allBalances),
    getValidatorByConsensusKey: cacheAnswers((validatorHash: string) => {
      return axiosWrapper.get(
        `${API_CONFIG.api}telemetry/validator_by_cons_addr/${validatorHash}`,
      )
    }),
    getTxForTxDetailsPage: (hash: string) => {
      return getAPIDate(`${API_CONFIG.rpc}tx?hash=0x${hash}&prove=true`)
    },
    getRequestsVolumePerDays: (startTime: Date, endTime: Date) => {
      return axios.get(`${API_CONFIG.telemetryUrl}/requests/volume_per_days`, {
        params: {
          start_time: (startTime.getTime() / 1000).toFixed(),
          end_time: (endTime.getTime() / 1000).toFixed(),
        },
      })
    },
  }
}

export const callers = makeCallers()

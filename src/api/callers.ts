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
import { cacheAnswers } from '@/helpers/requests'
import { decodeRequestResults } from '@/helpers/requestResultDecoders'
import { decodeProposal, decodeProposals } from '@/helpers/proposalDecoders'
import { decodeValidators } from '@/helpers/validatorDecoders'
import { NumLike } from '@/helpers/casts'
import { API_CONFIG } from './api-config'
import {
  MsgCreateValidator,
  MsgDelegate,
  MsgUndelegate,
} from 'cosmjs-types/cosmos/staking/v1beta1/tx'
import { Proposal } from '@provider/codec/cosmos/gov/v1beta1/gov'
import { MsgWithdrawDelegatorReward } from 'cosmjs-types/cosmos/distribution/v1beta1/tx'

const makeCallers = () => {
  const broadcaster = api.makeBroadcastCaller.bind(api)
  const multiBroadcaster = api.makeMultiBroadcastCaller.bind(api)
  const querier = api.makeQueryCaller.bind(api)
  const tmQuerier = api.makeTendermintCaller.bind(api)

  return {
    getCounts: querier((qc) => qc.oracle.unverified.counts),
    createDataSource: broadcaster<MsgCreateDataSource>(
      '/oracle.v1.MsgCreateDataSource',
      MsgCreateDataSource
    ),
    editDataSource: broadcaster<MsgEditDataSource>(
      '/oracle.v1.MsgEditDataSource',
      MsgEditDataSource
    ),
    getDataSources: querier((qc) => qc.oracle.unverified.dataSources),
    getSortedDataSources: (activities: string, owner?: string | null) => {
      if (owner) {
        return sendGet(
          `${API_CONFIG.telemetryUrl}telemetry/data_sources?sort=${activities}&owner=${owner}`
        )
      } else {
        return sendGet(
          `${API_CONFIG.telemetryUrl}telemetry/data_sources?sort=${activities}`
        )
      }
    },
    getDataSource: querier((qc) => qc.oracle.unverified.dataSource),
    createOracleScript: broadcaster<MsgCreateOracleScript>(
      '/oracle.v1.MsgCreateOracleScript',
      MsgCreateOracleScript
    ),
    editOracleScript: broadcaster<MsgEditOracleScript>(
      '/oracle.v1.MsgEditOracleScript',
      MsgEditOracleScript
    ),
    getOracleScripts: querier((qc) => qc.oracle.unverified.oracleScripts),
    getOracleScript: querier((qc) => qc.oracle.unverified.oracleScript),
    createRequest: broadcaster<MsgRequestData>(
      '/oracle.v1.MsgRequestData',
      MsgRequestData
    ),
    getRequests: querier((qc) =>
      mapResponse(qc.oracle.unverified.requests, (response) => {
        return {
          ...response,
          requests: decodeRequestResults(response.requests),
        }
      })
    ),
    getRequest: querier((qc) => qc.oracle.unverified.request),
    getOracleParams: querier((qc) => qc.oracle.unverified.params),
    getProposals: querier((qc) =>
      mapResponse(qc.gov.unverified.proposals, (response) => {
        return {
          ...response,
          proposals: decodeProposals(response.proposals),
        }
      })
    ),
    createProposal: broadcaster<MsgSubmitProposal>(
      '/cosmos.gov.v1beta1.MsgSubmitProposal',
      MsgSubmitProposal
    ),
    getProposal: querier((qc) =>
      mapResponse(qc.gov.unverified.proposal, (response) => {
        return {
          proposal: decodeProposal(response.proposal as Proposal),
        }
      })
    ),
    getReports: querier((qc) => qc.oracle.unverified.reporters),
    getProposalVote: querier((qc) => qc.gov.unverified.vote),
    getProposalVotes: querier((qc) => qc.gov.unverified.votes),
    getProposalTally: querier((qc) => qc.gov.unverified.tallyResult),
    getProposer: (proposalId: NumLike) => {
      return sendGet(`${API_CONFIG.api}/gov/proposals/${proposalId}/proposer`)
    },
    getProposalChanges: () => {
      return sendGet(
        `${API_CONFIG.telemetryUrl}/telemetry/blocks/vote_proposals`
      )
    },
    getProposalsStatistic: () => {
      return sendGet(
        `${API_CONFIG.telemetryUrl}/telemetry/blocks/vote_proposals_statistics`
      )
    },
    proposalDeposit: broadcaster<MsgDeposit>(
      '/cosmos.gov.v1beta1.MsgDeposit',
      MsgDeposit
    ),
    proposalVote: broadcaster<MsgVote>('/cosmos.gov.v1beta1.MsgVote', MsgVote),
    getBalances: querier((qc) => () => {
      const myAddress = wallet.account.address
      return qc.bank.allBalances(myAddress)
    }),

    createExchange: broadcaster<MsgExchange>(
      '/coinswap.MsgExchange',
      MsgExchange
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
    getRate: querier((qc) => qc.coinswap.unverified.rate),
    getTreasuryPool: querier((qc) => qc.mint.unverified.treasuryPool),
    getTotalSupply: querier((qc) => qc.bank.totalSupply),

    createValidator: broadcaster<MsgCreateValidator>(
      '/cosmos.staking.v1beta1.MsgCreateValidator',
      MsgCreateValidator
    ),
    getValidators: querier((qc) =>
      mapResponse(qc.staking.validators, (response) => {
        return {
          ...response,
          validators: decodeValidators(response.validators),
        }
      })
    ),
    getActiveValidators: querier((qc) => qc.oracle.unverified.activeValidators),
    getValidator: querier((qc) => qc.staking.validator),
    getValidatorStatus: querier((qc) => qc.oracle.unverified.validator),
    getValidatorDelegations: querier((qc) => qc.staking.validatorDelegations),
    validatorDelegate: broadcaster<MsgDelegate>(
      '/cosmos.staking.v1beta1.MsgDelegate',
      MsgDelegate
    ),
    validatorUndelegate: broadcaster<MsgUndelegate>(
      '/cosmos.staking.v1beta1.MsgUndelegate',
      MsgUndelegate
    ),
    getDelegations: querier((qc) => qc.staking.delegatorDelegations),
    withdrawCoinsToAcc: broadcaster<MsgWithdrawCoinsToAccFromTreasury>(
      '/mint.MsgWithdrawCoinsToAccFromTreasury',
      MsgWithdrawCoinsToAccFromTreasury
    ),
    withdrawDelegatorRewards: broadcaster<MsgWithdrawDelegatorReward>(
      '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
      MsgWithdrawDelegatorReward
    ),
    withdrawMultiDelegatorRewards: multiBroadcaster<MsgWithdrawDelegatorReward>(
      '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward',
      MsgWithdrawDelegatorReward
    ),
    getDelegationDelegatorReward: querier(
      (qc) => qc.distribution.delegationRewards
    ),
    getDelegationRewards: querier(
      (qc) => qc.distribution.delegationTotalRewards
    ),
    getParams: querier((qc) => qc.mint.unverified.params),
    faucetRequest: (req: { denom: string }) => {
      console.log({
        address: wallet.account.address,
        denom: req.denom,
      })
      return sendPost(`${API_CONFIG.faucet}/request`, {
        address: wallet.account.address,
        denom: req.denom,
      })
    },
    getTxSearch: cacheAnswers(tmQuerier((tc) => tc.txSearch.bind(tc))),
    getBlockchain: tmQuerier((tc) => tc.blockchain.bind(tc)),
    getBlock: cacheAnswers(tmQuerier((tc) => tc.block.bind(tc))),
    getProposedBlocks: (
      proposer: string,
      page_number: number,
      page_limit: number
    ) => {
      return sendGet(
        `${API_CONFIG.telemetryUrl}telemetry/validator/${proposer}/transactions?page[number]=${page_number}&page[limit]=${page_limit}&page[order]=desc`
      )
    },
  }
}

export const callers = makeCallers()

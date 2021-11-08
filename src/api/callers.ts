import { MsgWithdrawCoinsToAccFromTreasury } from '@provider/codec/mint/tx'
import { MsgSend } from '@cosmjs/stargate/build/codec/cosmos/bank/v1beta1/tx'
import {
  MsgCreateDataSource,
  MsgCreateOracleScript,
  MsgRequestData,
} from '@provider/codec/oracle/v1/tx'
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
} from '@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/tx'
import { Proposal } from '@provider/codec/cosmos/gov/v1beta1/gov'

const makeCallers = () => {
  const broadcaster = api.makeBroadcastCaller.bind(api)
  const querier = api.makeQueryCaller.bind(api)
  const tmQuerier = api.makeTendermintCaller.bind(api)

  return {
    getCounts: querier((qc) => qc.oracle.unverified.counts),
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
          requests: decodeRequestResults(response.requests),
        }
      })
    ),
    getRequest: querier((qc) => qc.oracle.unverified.request),
    getProposals: querier((qc) =>
      mapResponse(qc.gov.unverified.proposals, (response) => {
        return {
          ...response,
          proposals: decodeProposals(response.proposals),
        }
      })
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
  }
}

export const callers = makeCallers()

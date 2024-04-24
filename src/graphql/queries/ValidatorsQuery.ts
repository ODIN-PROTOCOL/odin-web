import gql from 'graphql-tag'

export const DetailedValidatorsQuery = gql`
  query DetailedValidators {
    stakingPool: staking_pool(limit: 1, order_by: { height: desc }) {
      bondedTokens: bonded_tokens
    }
    slashingParams: slashing_params(order_by: { height: desc }, limit: 1) {
      params
    }
    validator(order_by: { validator_info: { delegated_amount: desc } }, where: {validator_info: {operator_address: {_is_null: false}}}) {
      statuses: validator_statuses(order_by: { height: desc }, limit: 1) {
        status
        jailed
        height
      }
      signingInfos: validator_signing_infos(
        order_by: { height: desc }
        limit: 1
      ) {
        missedBlocksCounter: missed_blocks_counter
        tombstoned
      }
      info: validator_info {
        delegatedAmount: delegated_amount
        delegatorShares: delegator_shares
        operatorAddress: operator_address
        selfDelegateAddress: self_delegate_address
        consensusAddress: consensus_address
      }
      votingPowers: validator_voting_powers(
        offset: 0
        limit: 1
        order_by: { height: desc }
      ) {
        votingPower: voting_power
      }
      commissions: validator_commissions(order_by: { height: desc }, limit: 1) {
        commission
        minSelfDelegation: min_self_delegation
      }
      signingInfos: validator_signing_infos(
        order_by: { height: desc }
        limit: 1
      ) {
        missedBlocksCounter: missed_blocks_counter
      }
      descriptions: validator_descriptions {
        moniker
        details
        avatarUrl: avatar_url
        website
      }
    }
  }
`

export const ProposedBlocksQuery = gql`
  query ProposedBlocksQuery(
    $validator: String!
    $limit: Int = 10
    $offset: Int = 0
  ) {
    block(
      where: { proposer_address: { _eq: $validator } }
      limit: $limit
      offset: $offset
    ) {
      hash
      height
      num_txs
      proposer_address
      size
      timestamp
      total_gas
    }
    total_blocks: block_aggregate(
      where: { proposer_address: { _eq: $validator } }
    ) {
      aggregate {
        count
      }
    }
  }
`

export const OracleReportsQuery = gql`
  query ReportsQuery($validator: String!, $limit: Int = 10, $offset: Int = 0) {
    report(
      where: { validator: { _eq: $validator } }
      limit: $limit
      offset: $offset
    ) {
      oracle_script_id
      request_id
      tx_hash
      request {
        timestamp
      }
    }
    totalRequests: report_aggregate(where: { validator: { _eq: $validator } }) {
      aggregate {
        count
      }
    }
  }
`

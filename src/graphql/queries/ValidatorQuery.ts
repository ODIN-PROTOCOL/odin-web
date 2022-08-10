import gql from 'graphql-tag'

export const ValidatorQuery = gql`
  query Validator($address: String!) {
    stakingPool: staking_pool(limit: 1, order_by: { height: desc }) {
      bondedTokens: bonded_tokens
    }
    slashingParams: slashing_params(order_by: { height: desc }, limit: 1) {
      params
    }
    validator(
      where: { validator_info: { operator_address: { _eq: $address } } }
    ) {
      info: validator_info {
        delegatedAmount: delegated_amount
        operatorAddress: operator_address
        delegatorShares: delegator_shares
        maxRate: max_rate
        maxChangeRate: max_change_rate
        validatorAddress: consensus_address
      }
      blocksAggregate: blocks_aggregate {
        aggregate {
          count
        }
      }
      statuses: validator_statuses(order_by: { height: desc }, limit: 1) {
        status
        jailed
        tombstoned
      }
      signingInfos: validator_signing_infos(
        order_by: { height: desc }
        limit: 1
      ) {
        missedBlocksCounter: missed_blocks_counter
        tombstoned
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
      descriptions: validator_descriptions {
        moniker
        details
      }
    }
  }
`

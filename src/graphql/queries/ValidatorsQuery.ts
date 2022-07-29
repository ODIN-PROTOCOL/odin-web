import gql from 'graphql-tag'

export const ValidatorsQuery = gql`
  query Validators {
    stakingPool: staking_pool(limit: 1, order_by: { height: desc }) {
      bondedTokens: bonded_tokens
    }
    slashingParams: slashing_params(order_by: { height: desc }, limit: 1) {
      params
    }
    validator(order_by: { validator_info: { delegated_amount: desc } }) {
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
      }
    }
  }
`

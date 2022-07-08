import gql from 'graphql-tag'

export const ValidatorsQuery = gql`
  query Validators {
    stakingPool: staking_pool(limit: 1, order_by: { height: desc }) {
      bondedTokens: bonded_tokens
    }
    slashingParams: slashing_params(order_by: { height: desc }, limit: 1) {
      params
    }
    validator {
      validatorStatuses: validator_statuses(
        order_by: { height: desc }
        limit: 1
      ) {
        status
        jailed
        height
      }
      validatorSigningInfos: validator_signing_infos(
        order_by: { height: desc }
        limit: 1
      ) {
        missedBlocksCounter: missed_blocks_counter
        tombstoned
      }
      validatorInfo: validator_info {
        delegatorShares: delegator_shares
        operatorAddress: operator_address
        selfDelegateAddress: self_delegate_address
      }
      validatorVotingPowers: validator_voting_powers(
        offset: 0
        limit: 1
        order_by: { height: desc }
      ) {
        votingPower: voting_power
      }
      validatorCommissions: validator_commissions(
        order_by: { height: desc }
        limit: 1
      ) {
        commission
        minSelfDelegation: min_self_delegation
      }
      validatorSigningInfos: validator_signing_infos(
        order_by: { height: desc }
        limit: 1
      ) {
        missedBlocksCounter: missed_blocks_counter
      }
      validatorDescriptions: validator_descriptions {
        moniker
        details
      }
    }
  }
`

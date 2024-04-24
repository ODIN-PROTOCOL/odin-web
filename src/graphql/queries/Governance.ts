import gql from 'graphql-tag'

export const ProposalQuery = gql`
  query ProposalsQuery(
    $limit: Int = 10
    $offset: Int = 0
    $order: order_by = desc
  ) @cached {
    proposal(limit: $limit, offset: $offset, order_by: { id: $order }) {
      proposalId: id
      description
      content
      submitTime: submit_time
      title
      status
      depositEndTime: deposit_end_time
      votingEndTime: voting_end_time
      votingStartTime: voting_start_time
      proposerAddress: proposer_address
      finalTallyResult: proposal_tally_result {
        yes
        no_with_veto
        no
        abstain
        height
      }
      deposits: proposal_deposits {
        amount
        depositor_address
      }
    }
    proposal_aggregate {
      aggregate {
        count
      }
    }
  }
`

export const ProposalByIdQuery = gql`
  query ProposalByIdQuery($id: Int!) @cached {
    proposal(where: { id: { _eq: $id } }) {
      proposalId: id
      description
      content
      submitTime: submit_time
      title
      status
      depositEndTime: deposit_end_time
      votingEndTime: voting_end_time
      votingStartTime: voting_start_time
      proposerAddress: proposer_address
      finalTallyResult: proposal_tally_result {
        yes
        no_with_veto
        no
        abstain
        height
      }
      deposits: proposal_deposits {
        amount
        depositor_address
      }
    }
  }
`

export const TreasuryPoolQuery = gql`
  query TreasuryPool {
    treasuryPool: treasury_pool {
      coins
    }
  }
`

import gql from 'graphql-tag'

export const SupplyQuery = gql`
  query SupplyQuery {
    supply {
      coins
    }
  }
`

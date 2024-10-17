import gql from 'graphql-tag'

export const AllNFTsQuery = gql`
  query AllNFTQuery($limit: Int = 10, $offset: Int = 0) {
    nft_aggregate {
      aggregate {
        totalCount: count
      }
    }
    nft(
      where: { class_id: { _eq: "onft-0" } }
      limit: $limit
      offset: $offset
      order_by: { height: asc }
    ) {
      height
      owner
      uri
      id
      data
      class_id
      metadata
    }
  }
`

export const ProfileNFTQuery = gql`
  query ProfileNFTQuery($address: String!, $limit: Int = 10, $offset: Int = 0) {
    nft_aggregate {
      aggregate {
        totalCount: count
      }
    }
    nft(
      where: { class_id: { _eq: "onft-0" }, owner: { _eq: $address } }
      limit: $limit
      offset: $offset
      order_by: { height: asc }
    ) {
      height
      owner
      uri
      id
      data
      class_id
      metadata
    }
  }
`

export const NFTDetailsQuery = gql`
  query NFTDetailsQuery($id: String!) {
    nft(where: { id: { _eq: $id } }) {
      height
      owner
      uri
      id
      data
      class_id
      metadata
    }
  }
`

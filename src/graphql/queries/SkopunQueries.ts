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
      order_by: { height: desc }
    ) {
      height
      owner
      uri
      id
      data
      class_id
      metadata
      likes: nft_likes_aggregate {
        aggregate {
          count
        }
      }
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
      order_by: { height: desc }
    ) {
      height
      owner
      uri
      id
      data
      class_id
      metadata
      likes: nft_likes_aggregate {
        aggregate {
          count
        }
      }
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

export const NFTLikesQuery = gql`
  query LikeCount($id: String!) {
    nft_likes_aggregate(where: { nft_id: { _eq: $id } }) {
      aggregate {
        count
      }
    }
  }
`

export const NFTAlreadyLikedQuery = gql`
  query NFTAlreadyLikedQuery($address: String!) {
    nft_likes(where: { address: { _eq: $address } }) {
      nft_id
    }
  }
`

export const NFTSearchQuery = gql`
query NFTSearchQuery($query: String!) {
  search_nfts(args: {search: $query}, order_by: { height: desc }) {
    id
    metadata
    owner
    uri
    uri_hash
    class_id
    height
  }
}
`
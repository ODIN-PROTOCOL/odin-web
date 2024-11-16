import gql from 'graphql-tag'

import { API_CONFIG } from '@/api/api-config'

export const AllNFTsQuery = gql`
  query AllNFTQuery($limit: Int = 10, $offset: Int = 0, $order: [nft_order_by!]) {
    nft_aggregate {
      aggregate {
        totalCount: count
      }
    }
    nft(
      where: { class_id: { _eq: "${API_CONFIG.nftCollection}", _nregex: "(?i)\b(luis|gelado|anant|vlad|vladimir|scammer|gelado|crespo|singh)\b" } }
      limit: $limit
      offset: $offset
      order_by: $order
    ) {
      height
      owner
      mint_tx_hash
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
  query ProfileNFTQuery($address: String!, $limit: Int = 10, $offset: Int = 0, $order: [nft_order_by!]) {
    nft_aggregate {
      aggregate {
        totalCount: count
      }
    }
    nft(
      where: { class_id: { _eq: "${API_CONFIG.nftCollection}" }, owner: { _eq: $address } }
      limit: $limit
      offset: $offset
      order_by: $order
    ) {
      height
      owner
      uri
      id
      mint_tx_hash
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
    nft(where: { id: { _eq: $id }, class_id: { _eq: "${API_CONFIG.nftCollection}", _nregex: "(?i)\b(luis|gelado|anant|vlad|vladimir|scammer|gelado|crespo|singh)\b" } }) {
      height
      mint_tx_hash
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
  query LikeCount($id: String!, $class_id: String!) {
    nft_likes_aggregate(
      where: { nft_id: { _eq: $id }, class_id: { _eq: $class_id } }
    ) {
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
      class_id
    }
  }
`

export const NFTSearchQuery = gql`
  query NFTSearchQuery($query: String!) {
    search_nfts(args: { search: $query }, order_by: { height: desc }) {
      id
      metadata
      owner
      uri
      mint_tx_hash
      uri_hash
      class_id
      height
    }
  }
`

import { AmountDetails, Coin } from '@/helpers/Types'
import { Any } from 'cosmjs-types/google/protobuf/any'

export interface AccountStakingInfoResponse {
  delegationBalance: {
    coins: { denom: string; amount: number }[]
  }
  stakingPool: {
    bonded: number
    unbonded: number
  }
}

export interface ValidatorBaseInfo {
  validator: {
    validator_info: {
      operator_address: string
    }
  }
}

export interface ValidatorDetailedInfo extends ValidatorBaseInfo {
  moniker: string
  avatarUrl: string
  details: string
}

export interface ValidatorsResponse {
  validators: ValidatorDetailedInfo[]
}

export interface BlockInfo {
  hash: string
  height: number
  txs: number
  timestamp: string
  validator: {
    validator_info: {
      operator_address: string
    }
  }
  size: number
}

export interface BlockInfo {
  hash: string
  height: number
  txs: number
  timestamp: string
  size: number
}

export interface TransformedBlockInfo extends BlockInfo {
  validatorDetails: ValidatorDetailedInfo | null
}

export interface BlockMetaResponse {
  blockMetas: BlockInfo[]
  latestBlock: BlockInfo[]
  totalCount: {
    aggregate: {
      count: number
    }
  }
}

export interface LatestBlockInfo {
  height: number
  time: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LatestBlocksResponse {}

export interface Transaction {
  hash: string
  sender: string
  gas_used: number
  gas_wanted: number
  memo: string
  messages: Any[]
  logs: Any[]
  fee: AmountDetails[]
  success: boolean
  height: number
  block: {
    timestamp: string
  }
}

export interface TxResponseData {
  transaction: Transaction[]
  transaction_aggregate: {
    aggregate: {
      count: number
    }
  }
}

export interface TxResponse {
  data: TxResponseData
}

export interface TxVolumeData {
  day: string
  transaction_volume: number
}

export interface TxVolumePerDaysResponse {
  data: {
    daily_transaction_volume: TxVolumeData[]
  }
}

export interface ValidatorsInfo {
  statuses: [
    {
      status: number
      jailed: boolean
      height: number
    },
  ]
  signingInfos: [
    {
      missedBlocksCounter: number
      tombstoned: boolean
    },
  ]
  info: {
    delegatedAmount: string
    delegatorShares: string
    operatorAddress: string
    selfDelegateAddress: string
    consensusAddress: string
  }
  votingPowers: [
    {
      votingPower: number
    },
  ]
  commissions: [
    {
      commission: number
    },
  ]
  blocksAggregate?: {
    aggregate: {
      count: number
    }
  }
  descriptions: [
    {
      moniker: string
      details: string | null
      website: string | null
      avatarUrl: string | null
    },
  ]
}

export interface DetailedValidatorsResponse {
  slashingParams: [
    {
      params: {
        signed_blocks_window: number
        min_signed_per_window: string
        downtime_jail_duration: number
        slash_fraction_downtime: string
        slash_fraction_double_sign: string
      }
    },
  ]
  stakingPool: [
    {
      bondedTokens: string
    },
  ]
  validator: [ValidatorsInfo]
}

export interface ValidatorResponse {
  slashingParams: [
    {
      params: {
        signed_blocks_window: number
        min_signed_per_window: string
        downtime_jail_duration: number
        slash_fraction_downtime: string
        slash_fraction_double_sign: string
      }
    },
  ]
  stakingPool: [
    {
      bondedTokens: string
    },
  ]
  validator: [ValidatorsInfo]
}

export interface SupplyResponse {
  supply: [{ coins: Coin[] }]
}

export interface TreasuryPoolResponse {
  treasuryPool: [{ coins: Coin[] }]
}

export interface NFTDetails {
  image: string
  owner: string
  preview: string
  prompt: string
  request_height: number
  request_id: number
}

export interface NFTInfo {
  height: number
  owner: string
  uri: string
  id: string
  data: string
  mint_tx_hash: string
  class_id: string
  metadata: string
  details: NFTDetails | null
  shareableXUrl: string | null
  shareableThreadsUrl: string | null
  likes: {
    aggregate: {
      count: number
    }
  }
}

export interface NFTListResponse {
  nft_aggregate: {
    aggregate: {
      totalCount: number
    }
  }
  nft: NFTInfo[]
}

export interface SearchNFTListResponse {
  search_nfts: NFTInfo[]
}

export interface NFTLikesResponse {
  nft_likes_aggregate: {
    aggregate: {
      count: number
    }
  }
}

export interface NFTAlreadyLikedResponse {
  nft_likes: [{ nft_id: string; class_id: string }]
}

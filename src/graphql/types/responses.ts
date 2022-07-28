export interface AccountStakingInfoResponse {
  delegationBalance: {
    coins: { denom: string; amount: number }[]
  }
  stakingPool: {
    bonded: number
    unbonded: number
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
      details: string
    },
  ]
}

export interface ValidatorsResponse {
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

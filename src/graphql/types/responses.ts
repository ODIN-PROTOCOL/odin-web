export interface AccountStakingInfoResponse {
  delegationBalance: {
    coins: { denom: string; amount: number }[]
  }
  stakingPool: {
    bonded: number
    unbonded: number
  }
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
    }
  ]
  stakingPool: [
    {
      bondedTokens: string
    }
  ]
  validator: [ValidatorsInfo]
  validatorDescriptions: [
    {
      moniker: string
      details: string
    }
  ]
}
export interface ValidatorsInfo {
  validatorStatuses: [
    {
      status: number
      jailed: boolean
      height: number
    }
  ]
  validatorSigningInfos: [
    {
      missedBlocksCounter: number
      tombstoned: boolean
    }
  ]
  validatorInfo: {
    delegatorShares: string
    operatorAddress: string
    selfDelegateAddress: string
  }
  validatorVotingPowers: [
    {
      votingPower: number
    }
  ]
  validatorCommissions: [
    {
      commission: number
    }
  ]
}

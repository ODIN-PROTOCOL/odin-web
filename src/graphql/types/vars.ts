export interface AccountStakingInfoVariables {
  address: string
}

export interface QueryHeightVariables {
  block: number
  limit: number
  offset: number
}

export interface VolumePerDaysVariables {}

export interface BlocksQueryVariables {
  limit: number
  order: string
  offset: number | null
}

export interface BlockQueryVariables {
  hash: string | null
  height: number | null
}

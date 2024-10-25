export interface AccountStakingInfoVariables {
  address: string
}

export interface QueryHeightVariables {
  block: number
  limit: number
  offset: number
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
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

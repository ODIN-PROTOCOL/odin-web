export type Coin = {
  denom: string
  amount: string
}
export type DataSourceFromChain = {
  id: Long
  owner: string
  name: string
  description: string
  filename: string
  fee: Coin[]
}
export type DataSourceFromTelemetry = {
  id: number
  description: string
  create_block: number
  edit_block: number
  fee_amount: string
  fee_denom: string
  owner: string
  sender: string
  name: string
  timestamp: number
}

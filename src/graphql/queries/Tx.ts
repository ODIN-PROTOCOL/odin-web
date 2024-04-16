import gql from 'graphql-tag'

export const AvgFeeQuery = gql`
  query AvgFeeQuery($start: timestamp, $end: timestamp) {
    chartData: daily_average_fee(
      order_by: { day: asc }
      where: { day: { _gte: $start, _lte: $end } }
    ) {
      value: avg_daily_fee
      date: day
    }
  }
`

export const TxAtBlockQuery = gql`
  query TxAtBlockQuery(
    $height: bigint = 0
    $limit: Int = 10
    $offset: Int = 0
  ) {
    transaction(
      limit: $limit
      offset: $offset
      where: { height: { _eq: $height } }
    ) {
      hash
      sender
      gas_used
      gas_wanted
      memo
      logs
      fee
      success
      block {
        timestamp
      }
      messages
      height
    }
  }
`

export const TxFromAddressQuery = gql`
  query AccountMessages(
    $address: [String!]
    $limit: Int = 0
    $offset: Int = 0
    $order: order_by = desc
    $tx_type: String = "%%"
  ) @cached {
    message(
      limit: $limit
      offset: $offset
      order_by: [{ height: $order }, { transaction_hash: $order }]
      distinct_on: [transaction_hash, height]
    ) {
      transaction {
        fee
        gas_used
        gas_wanted
        hash
        height
        logs
        memo
        messages
        partition_id
        sender
        success
        block {
          timestamp
          size
        }
      }
    }
    transactions_aggregate: message_aggregate(
      distinct_on: transaction_hash
      where: {
        involved_accounts_addresses: { _contains: $address }
        type: { _ilike: $tx_type }
      }
    ) {
      aggregate {
        count
      }
    }
  }
`

export const TxQuery = gql`
  query TxQuery($height: bigint = 0, $limit: Int = 10, $offset: Int = 0) {
    transaction(
      limit: $limit
      offset: $offset
      where: { height: { _gte: $height } }
      order_by: { height: desc }
    ) {
      hash
      sender
      gas_used
      gas_wanted
      memo
      logs
      fee
      success
      block {
        timestamp
      }
      messages
      height
    }
    transaction_aggregate {
      aggregate {
        count
      }
    }
  }
`
export const BlocksQuery = gql`
  query BlocksQuery($limit: Int!, $order: order_by = desc, $offset: Int = 0) {
    blockMetas: block(
      limit: $limit
      order_by: { height: $order }
      offset: $offset
    ) {
      hash
      height
      txs: num_txs
      timestamp
      validator {
        validator_info {
          operator_address
        }
      }
      size
    }
    latestBlock: block(limit: 1, order_by: { height: desc }) {
      hash
      height
      txs: num_txs
      timestamp
      validator {
        validator_info {
          operator_address
        }
      }
      size
    }
    totalCount: block_aggregate {
      aggregate {
        count(distinct: true)
      }
    }
  }
`

export const BlockQuery = gql`
  query BlockQuery($hash: String = "", $height: bigint = 0) {
    blockMetas: block(
      where: { _or: [{ hash: { _eq: $hash } }, { height: { _eq: $height } }] }
    ) {
      hash
      height
      txs: num_txs
      timestamp
      validator {
        validator_info {
          operator_address
        }
      }
      size
    }
    latestBlock: block(limit: 1, order_by: { height: desc }) {
      hash
      height
      txs: num_txs
      timestamp
      validator {
        validator_info {
          operator_address
        }
      }
      size
    }
  }
`

export const BlockAvgSizePerDay = gql`
  query AvgBlockSizePerDay($start: timestamp, $end: timestamp) {
    chartData: average_block_size(
      order_by: { date: asc }
      where: { date: { _gte: $start, _lte: $end } }
    ) {
      date
      volume: average_size
    }
  }
`

export const BlockAvgTimePerDay = gql`
  query AvgBlockTimePerDay($start: timestamp, $end: timestamp) {
    chartData: average_block_time(
      order_by: { date: asc }
      where: { date: { _gte: $start, _lte: $end } }
    ) {
      date
      volume: average_time
    }
  }
`

export const TxVolumePerDaysQuery = gql`
  query TxVolumeQuery {
    chartData: daily_transaction_volume(order_by: { day: asc }) {
      date: day
      volume: transaction_volume
    }
  }
`

export const TxAvgFeePerDaysQuery = gql`
  query TxAvgFeePerDaysQuery {
    daily_average_fee(order_by: { day: asc }) {
      avg_daily_fee
      day
    }
  }
`

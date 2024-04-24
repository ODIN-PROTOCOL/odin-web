import gql from 'graphql-tag'

export const DataSourceQuery = gql`
  query DataSourceQuery($offset: Int, $limit: Int) {
    data_source(
      order_by: {
        requests_data_source_aggregate: { max: { request_id: desc } }
      }
      limit: $limit
      offset: $offset
    ) {
      create_block
      description
      edit_block
      executable
      fee
      id
      name
      sender
      timestamp
      owner
      requests_data: requests_data_source_aggregate {
        aggregate {
          count
        }
      }
    }
    data_source_aggregate {
      aggregate {
        count
      }
    }
  }
`

export const OracleScriptsQuery = gql`
  query OracleScriptsQuery(
    $limit: Int
    $offset: Int
    $order: order_by
    $owner: String = "%%"
    $name: String = "%%"
  ) {
    oracle_script(
      limit: $limit
      offset: $offset
      order_by: { timestamp: $order, requests_aggregate: { count: desc } }
      where: { owner: { _ilike: $owner }, name: { _ilike: $name } }
    ) {
      create_block
      description
      edit_block
      id
      name
      owner
      schema
      sender
      source_code_url
      timestamp
      requests_aggregate {
        aggregate {
          count
        }
      }
    }
    total_count: oracle_script_aggregate {
      aggregate {
        count
      }
    }
  }
`

export const OracleScriptsMostRequestedQuery = gql`
  query OracleScriptsQuery(
    $limit: Int
    $offset: Int
    $order: order_by
    $owner: String
  ) {
    oracle_script(
      limit: $limit
      offset: $offset
      order_by: { timestamp: $order, requests_aggregate: { count: desc } }
      where: { owner: {} }
    ) {
      create_block
      description
      edit_block
      id
      name
      owner
      schema
      sender
      source_code_url
      timestamp
      requests_aggregate {
        aggregate {
          count
        }
      }
    }
    total_count: oracle_script_aggregate {
      aggregate {
        count
      }
    }
  }
`

export const OracleScriptDetailsQuery = gql`
  query OracleScriptsQuery {
    oracle_script(
      limit: $limit
      offset: $offset
      order_by: { timestamp: $order, requests_aggregate: { count: desc } }
      where: { owner: { _ilike: $owner }, name: { _ilike: $name } }
    ) {
      create_block
      description
      edit_block
      id
      name
      owner
      schema
      sender
      source_code_url
      timestamp
      requests_aggregate {
        aggregate {
          count
        }
      }
    }
    total_count: oracle_script_aggregate {
      aggregate {
        count
      }
    }
  }
`

export const OracleScriptQuery = gql`
  query OracleScriptByIdQuery($id: Int!) {
    oracle_script(where: { id: { _eq: $id } }) {
      create_block
      description
      edit_block
      id
      name
      owner
      schema
      sender
      source_code_url
      timestamp
      requests_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`

export const OracleScriptsAllRequestsQuery = gql`
  query Requests($limit: Int, $offset: Int, $order: order_by) {
    request(limit: $limit, offset: $offset, order_by: { timestamp: $order }) {
      id
      oracle_script_id
      prepare_gas
      resolve_timestamp
      sender
      timestamp
      tx_hash
      min_count
      height
      fee_limit
      execute_gas
      client_id
      calldata
      ask_count
    }
    request_aggregate {
      aggregate {
        count
      }
    }
  }
`

export const OracleScriptRequestsQuery = gql`
  query OracleScriptRequests($id: Int!) {
    request(where: { oracle_script_id: { _eq: $id } }) {
      oracle_script_id
      prepare_gas
      reports_count
      resolve_timestamp
      sender
      timestamp
      tx_hash
      min_count
      id
      height
      fee_limit
      execute_gas
      client_id
      calldata
      ask_count
    }
    request_aggregate(where: { oracle_script_id: { _eq: $id } }) {
      aggregate {
        count
      }
    }
  }
`

export const AvgRequestsQuery = gql`
  query AvgRequestsQuery($start: timestamp, $end: timestamp) {
    chartData: requests_per_date(
      order_by: { date: asc }
      where: { date: { _gte: $start, _lte: $end } }
    ) {
      value: requests_number
      date
    }
  }
`

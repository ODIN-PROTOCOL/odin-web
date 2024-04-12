import gql from 'graphql-tag'

export const DataSourceQuery = gql`
query DataSourceQuery($offset: Int, $limit: Int) {
    data_source(order_by: {requests_data_source_aggregate: {max: {request_id: desc}}}, limit: $limit, offset: $offset) {
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
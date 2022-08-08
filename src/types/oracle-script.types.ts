export type OracleScriptFromChain = {
  id: Long
  owner: string
  name: string
  description: string
  filename: string
  schema: string
  sourceCodeUrl: string
}

export type OracleScriptFromTelemetry = {
  attributes: {
    id: number
    description: string
    requests_number: number
    response_time: number
    create_block: number
    edit_block: number
    owner: string
    sender: string
    name: string
    schema: string
    source_code_url: string
    timestamp: number
  }
}

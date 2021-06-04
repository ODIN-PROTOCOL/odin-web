import { stringToPath } from '@cosmjs/crypto'

export const API_CONFIG = {
  mnemonic:
    'prize weapon virus foot mandate finger add strong world physical token castle knee bracket armed quit brand physical neglect film tip okay view broken',
  // api: 'http://35.195.150.105:1317',
  // rpc: 'http://35.195.150.105:26657',
  rpc: 'http://localhost:26657',
  faucet: 'http://localhost:5005',
  exBridge: 'http://localhost:90',
  exBridgeFee: '10',
  hdDeviation: stringToPath("m/44'/118'/0'/0/0"),
}

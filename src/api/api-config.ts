import { stringToPath } from '@cosmjs/crypto'

export const API_CONFIG = {
  rpc: 'http://192.168.1.37:26657',
  api: 'http://192.168.1.37:1317',
  // api: process.env.VUE_APP_API_URL as string,
  // rpc: process.env.VUE_APP_RPC_URL as string,
  faucet: process.env.VUE_APP_FAUCET_URL as string,
  exBridge: process.env.VUE_APP_EX_BRIDGE_URL as string,
  exBridgeFee: process.env.VUE_APP_EX_BRIDGE_FEE as string,
  hdDeviation: stringToPath(process.env.VUE_APP_DEVIATION as string),
  odinScan: process.env.VUE_APP_ODIN_SCAN_URL as string,
}

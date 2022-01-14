import { stringToPath } from '@cosmjs/crypto'

export const API_CONFIG = {
  api: process.env.VUE_APP_API_URL as string,
  rpc: process.env.VUE_APP_RPC_URL as string,
  faucet: process.env.VUE_APP_FAUCET_URL as string,
  exBridge: process.env.VUE_APP_EX_BRIDGE_URL as string,
  exBridgeFee: process.env.VUE_APP_EX_BRIDGE_FEE as string,
  hdDeviation: stringToPath(process.env.VUE_APP_DEVIATION as string),
  odinScan: process.env.VUE_APP_ODIN_SCAN_URL as string,
  telemetryUrl: process.env.VUE_APP_TELEMETRY_URL as string,
}

// Configuration of the chain to which the Kepler extension connects
export const CHAIN_CONFIG = {
  chainId: 'odin-mainnet-freya',
  chainName: 'ODIN118',
  rpc: API_CONFIG.rpc,
  rest: API_CONFIG.api,
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: 'odin',
    bech32PrefixAccPub: 'odin' + 'pub',
    bech32PrefixValAddr: 'odin' + 'valoper',
    bech32PrefixValPub: 'odin' + 'valoperpub',
    bech32PrefixConsAddr: 'odin' + 'valcons',
    bech32PrefixConsPub: 'odin' + 'valconspub',
  },
  currencies: [
    {
      coinDenom: 'odin',
      coinMinimalDenom: 'loki',
      coinDecimals: 6,
      coinGeckoId: 'odin',
    },
    {
      coinDenom: 'geo',
      coinMinimalDenom: 'minigeo',
      coinDecimals: 6,
      coinGeckoId: 'geo',
    },
  ],
  feeCurrencies: [
    {
      coinDenom: 'odin',
      coinMinimalDenom: 'loki',
      coinDecimals: 6,
      coinGeckoId: 'odin',
    },
  ],
  stakeCurrency: {
    coinDenom: 'odin',
    coinMinimalDenom: 'loki',
    coinDecimals: 6,
    coinGeckoId: 'odin',
  },
  coinType: 118,
  gasPriceStep: {
    low: 0.01,
    average: 0.025,
    high: 0.03,
  },
}

export enum COINS_LIST {
  LOKI = 'loki',
  ODIN = 'odin',
  GEO = 'geo',
}

import { stringToPath } from '@cosmjs/crypto'

export const API_CONFIG = {
  api: process.env.VUE_APP_API_URL as string,
  rpc: process.env.VUE_APP_RPC_URL as string,
  faucet: process.env.VUE_APP_FAUCET_URL as string,
  exBridge: process.env.VUE_APP_EX_BRIDGE_URL as string,
  exBridgeFee: process.env.VUE_APP_EX_BRIDGE_FEE as string,
  hdDeviation: stringToPath(process.env.VUE_APP_DEVIATION as string),
  odinScan: process.env.VUE_APP_ODIN_SCAN_URL as string,
  telemetryUrl: process.env.VUE_APP_TELEMETRY_URL?.slice(0, -1) as string,
  fee: process.env.VUE_APP_FEE as string,
  graphqlUrl: process.env.VUE_APP_NEXT_PUBLIC_GRAPHQL_URL as string,
}

export const START_VALUE = {
  delegatePeriod: process.env.VUE_APP_DELEGATE_PERIOD as string,
}
// Types of coins used in wallet configurations
export enum COINS_TYPE {
  MAIN = 118,
  ADDITIONAL = 494,
}

// Configuration of the chain to which the Kepler extension connects
export const CHAIN_CONFIG = {
  features: ['no-legacy-stdTx'],
  chainId: 'odin-mainnet-freya',
  chainName: 'ODIN118',
  rpc: API_CONFIG.rpc,
  rest: API_CONFIG.api,
  bip44: {
    coinType: COINS_TYPE.MAIN,
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
  coinType: COINS_TYPE.MAIN,
  gasPriceStep: {
    low: 0.0125,
    average: 0.025,
    high: 0.03,
  },
}

// List of coins that are used in the system
export enum COINS_LIST {
  LOKI = 'loki',
  ODIN = 'odin',
  GEO = 'geo',
}

// Types of logins in the system
export enum LOGIN_TYPE {
  KEPLR118,
  KEPLR494,
  MNEMONIC494,
}

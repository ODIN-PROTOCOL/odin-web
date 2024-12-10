import { stringToPath } from '@cosmjs/crypto'

export const API_CONFIG = {
  api: process.env.VUE_APP_API_URL as string,
  rpc: process.env.VUE_APP_RPC_URL as string,
  ordinPriceUrl: process.env.VUE_APP_ODIN_PRICE_URL as string,
  faucet: process.env.VUE_APP_FAUCET_URL as string,
  exBridge: process.env.VUE_APP_EX_BRIDGE_URL as string,
  exBridgeFee: process.env.VUE_APP_EX_BRIDGE_FEE as string,
  chainId: process.env.VUE_APP_CHAIN_ID as string,
  chainName: process.env.VUE_APP_CHAIN_NAME as string,
  hdDeviation: stringToPath(process.env.VUE_APP_DEVIATION as string),
  odinScan: process.env.VUE_APP_ODIN_SCAN_URL as string,
  telemetryUrl: process.env.VUE_APP_TELEMETRY_URL?.slice(0, -1) as string,
  fee: process.env.VUE_APP_FEE as string,
  graphqlUrl: process.env.VUE_APP_NEXT_PUBLIC_GRAPHQL_URL as string,
  graphqlActions: process.env.VUE_APP_GRAPHQL_ACTIONS_URL as string,
  mintScanUrl: process.env.VUE_APP_MINSTSCAN_URL as string,
  gasPrice: process.env.VUE_APP_GAS_PRICE as string,
  skopunContractAddress: process.env.VUE_APP_SKOPUN_CONTRACT_ADDRESS as string,
  ipfsNodeUrl: process.env.VUE_APP_IPFS_NODE_URL as string,
  ipfsIOUrl: 'https://ipfs.io/ipfs',
  fnServer: process.env.VUE_APP_FN_SERVER as string,
  threadsShareUrl: 'https://threads.net/intent/post' as string,
  xShareUrl: 'https://twitter.com/intent/post' as string,
  nftCollection: process.env.VUE_APP_NFT_COLLECTION as string,
  skopunRequestPrice: process.env.VUE_APP_SKOPUN_REQUEST_PRICE as string,
}

export const START_VALUE = {
  delegatePeriod: process.env.VUE_APP_DELEGATE_PERIOD as string,
  minHeight: process.env.VUE_APP_MIN_POSSIBLE_BLOCK_HEIGHT as string,
}
// Types of coins used in wallet configurations
export enum COINS_TYPE {
  MAIN = 118,
  ADDITIONAL = 494,
}

// Configuration of the chain to which the Kepler extension connects
export const CHAIN_CONFIG = {
  chainId: API_CONFIG.chainId,
  chainName: API_CONFIG.chainName,
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
      coinGeckoId: 'odin-protocol',
    },
    {
      coinDenom: 'geo',
      coinMinimalDenom: 'mGeo',
      coinDecimals: 6,
      coinGeckoId: 'geodb',
    },
  ],
  feeCurrencies: [
    {
      coinDenom: 'odin',
      coinMinimalDenom: 'loki',
      coinDecimals: 6,
      coinGeckoId: 'odin-protocol',
    },
  ],
  stakeCurrency: {
    coinDenom: 'odin',
    coinMinimalDenom: 'loki',
    coinDecimals: 6,
    coinGeckoId: 'odin-protocol',
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
  DOKI = 'doki',
  UDOKI = 'udoki',
  MYRK = 'myrk',
  UMYRK = 'umyrk',
}

// Types of logins in the system
export enum LOGIN_TYPE {
  KEPLR118,
  KEPLR494,
  MNEMONIC494,
  COSMOSTATION494,
}

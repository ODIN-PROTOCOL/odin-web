import { Keplr } from '@keplr-wallet/types'
declare global {
  interface Window {
    cosmostation?: {
      cosmos: {
        on: (type: string, handler: () => unknown) => void
      }
      providers?: {
        keplr?: Keplr
      }
    }
  }
}

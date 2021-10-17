import { Any } from '@provider/codec/google/protobuf/any'
import { Modify } from '@/shared-types'
import { PubKey } from '@cosmjs/stargate/build/codec/cosmos/crypto/secp256k1/keys'
import { Validator } from '@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/staking'
import { toBase64 } from '@cosmjs/encoding'
import { callers } from '@/api/callers'

export type ValidatorDecoded = Modify<Validator, { consensusPubkey?: string }>
export function decodeValidators(validators: Validator[]): ValidatorDecoded[] {
  return validators.map((validator) => {
    return {
      ...validator,
      consensusPubkey: decodePubKey(validator.consensusPubkey),
    }
  })
}

export function decodePubKey(pubKey?: Any): string {
  if (!pubKey) {
    return 'Cannot decode nullable'
  }
  if (pubKey.typeUrl === '/cosmos.crypto.secp256k1.PubKey') {
    // TODO: decoding broken
    return toBase64(PubKey.decode(pubKey.value).key)
  } else {
    return `Cannot decode ${pubKey.typeUrl}`
  }
}

export const isOracleValidator = async (
  validatorAddress: string
): Promise<boolean> => {
  const response = await callers.getReports(validatorAddress)
  return response.reporter.length ? true : false
}

export const isActiveValidator = async (
  validatorAddress: string
): Promise<boolean> => {
  const response = await callers.getValidatorStatus(validatorAddress)
  return response.status?.isActive ? true : false
}

import { Any } from '@provider/codec/google/protobuf/any'
import { Modify } from '@/shared-types'
import { PubKey } from 'cosmjs-types/cosmos/crypto/secp256k1/keys'
import { Validator } from 'cosmjs-types/cosmos/staking/v1beta1/staking'
import { toBase64 } from '@cosmjs/encoding'
import { DelegationResponse } from 'cosmjs-types/cosmos/staking/v1beta1/staking'

export type ValidatorDecoded = Modify<Validator, { consensusPubkey?: string }>
export type TransferValidator = Modify<
  ValidatorDecoded,
  { delegation?: DelegationResponse }
>
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

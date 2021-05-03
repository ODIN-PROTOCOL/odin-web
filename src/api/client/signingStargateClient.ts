import { API_CONFIG } from '@/api/api-config'
import { OfflineSigner, Registry } from '@cosmjs/proto-signing'
import { SigningStargateClient, defaultRegistryTypes } from '@cosmjs/stargate'

let _signingStargateClient: SigningStargateClient

export async function initSigningStargateClient(
  signer: OfflineSigner
): Promise<SigningStargateClient> {
  _signingStargateClient = await createSigningStargateClient(signer)
  return _signingStargateClient
}

export async function createSigningStargateClient(
  signer: OfflineSigner
): Promise<SigningStargateClient> {
  return SigningStargateClient.connectWithSigner(API_CONFIG.rpc, signer, {
    registry: _genRegistry(),
  })
}

export function getSigningStargateClient(): SigningStargateClient {
  if (!_signingStargateClient) {
    throw new ReferenceError('Signing Stargate client not initialized!')
  }
  return _signingStargateClient
}

function _genRegistry() {
  const registry = new Registry()
  for (const [typeUrl, type] of defaultRegistryTypes) {
    registry.register(typeUrl, type)
  }

  // TODO: extend registry from callers

  return registry
}

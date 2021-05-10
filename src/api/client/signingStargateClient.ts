import { API_CONFIG } from '@/api/api-config'
import { OfflineSigner, Registry } from '@cosmjs/proto-signing'
import { SigningStargateClient, defaultRegistryTypes } from '@cosmjs/stargate'

let _signingStargateClient: SigningStargateClient | null
const _signingStargateRegistry = _genRegistry()

export async function initSigningStargateClient(
  signer: OfflineSigner
): Promise<SigningStargateClient> {
  if (_signingStargateClient) {
    throw new ReferenceError('Signing Stargate client is already initialized!')
  }
  _signingStargateClient = await createSigningStargateClient(signer)
  return _signingStargateClient
}

export async function createSigningStargateClient(
  signer: OfflineSigner,
  registry: Registry = _signingStargateRegistry
): Promise<SigningStargateClient> {
  return SigningStargateClient.connectWithSigner(API_CONFIG.rpc, signer, {
    registry,
  })
}

export function getSigningStargateClient(): SigningStargateClient {
  if (!_signingStargateClient) {
    throw new ReferenceError('Signing Stargate client not initialized!')
  }
  return _signingStargateClient
}

export function clearSigningStargateClient(): void {
  if (_signingStargateClient) {
    _signingStargateClient.disconnect()
  }
  _signingStargateClient = null
}

export function getSigningStargateRegistry(): Registry {
  return _signingStargateRegistry
}

function _genRegistry() {
  const registry = new Registry()
  for (const [typeUrl, type] of defaultRegistryTypes) {
    registry.register(typeUrl, type)
  }
  return registry
}

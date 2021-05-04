import { hasWallet } from '@/api/client/wallet'
import { NavigationGuardWithThis, RouteLocationRaw } from 'vue-router'

type RouteGuard = NavigationGuardWithThis<undefined>

export function makeAuthorizedOnlyGuard(
  fallback: RouteLocationRaw
): RouteGuard {
  return () => {
    if (!hasWallet()) {
      return fallback
    }
    return true
  }
}

export function makeUnauthorizedOnlyGuard(
  fallback: RouteLocationRaw
): RouteGuard {
  return () => {
    if (hasWallet()) {
      return fallback
    }
    return true
  }
}

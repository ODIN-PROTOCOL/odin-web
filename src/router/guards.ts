import { hasWallet } from '@/api/client/wallet'
import {
  NavigationGuardWithThis,
  RouteLocation,
  RouteLocationRaw,
} from 'vue-router'

type RouteGuard = NavigationGuardWithThis<undefined>
type RouteRedirector = (to: RouteLocation) => RouteLocationRaw

export function makeRootRedirector(
  authorizedRoute: RouteLocationRaw,
  unauthorizedRoute: RouteLocationRaw
): RouteRedirector {
  return () => {
    if (hasWallet()) {
      return authorizedRoute
    } else {
      return unauthorizedRoute
    }
  }
}

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

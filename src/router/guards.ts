import { wallet } from '@/api/wallet'
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
    if (!wallet.isEmpty) {
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
    if (wallet.isEmpty) {
      return fallback
    }
    return true
  }
}

export function makeUnauthorizedOnlyGuard(
  fallback: RouteLocationRaw
): RouteGuard {
  return () => {
    if (!wallet.isEmpty) {
      return fallback
    }
    return true
  }
}

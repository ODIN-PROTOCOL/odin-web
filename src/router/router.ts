import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import {
  makeAuthorizedOnlyGuard,
  makeRootRedirector,
  makeUnauthorizedOnlyGuard,
} from './guards'
import { LOGIN_TYPE } from '../api/api-config'
import { ROUTE_NAMES } from '@/enums'

const rootRedirector = makeRootRedirector(
  { name: ROUTE_NAMES.wallet },
  { name: ROUTE_NAMES.dataSources },
)
const authorizedOnlyGuard = makeAuthorizedOnlyGuard({ name: ROUTE_NAMES.auth })
const unauthorizedOnlyGuard = makeUnauthorizedOnlyGuard({
  name: ROUTE_NAMES.app,
})

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:catchAll(.*)',
    redirect: rootRedirector,
  },
  {
    path: '/',
    name: ROUTE_NAMES.app,
    redirect: rootRedirector,
    children: [
      {
        path: '/auth',
        name: ROUTE_NAMES.auth,
        beforeEnter: unauthorizedOnlyGuard,
        props: { loginType: LOGIN_TYPE.KEPLR118 },
        component: () =>
          import(/* webpackChunkName: "auth" */ '@/views/AuthView.vue'),
      },
      {
        path: '/auth/keplr494',
        name: ROUTE_NAMES.authKeplr494,
        props: { loginType: LOGIN_TYPE.KEPLR494 },
        beforeEnter: unauthorizedOnlyGuard,
        component: () =>
          import(/* webpackChunkName: "auth" */ '@/views/AuthView.vue'),
      },
      {
        path: '/auth/mnemonic494',
        name: ROUTE_NAMES.authMnemonic494,
        props: { loginType: LOGIN_TYPE.MNEMONIC494 },
        beforeEnter: unauthorizedOnlyGuard,
        component: () =>
          import(/* webpackChunkName: "auth" */ '@/views/AuthView.vue'),
      },
      {
        path: '/data-sources',
        name: ROUTE_NAMES.dataSources,
        component: () =>
          import(
            /* webpackChunkName: "data-sources" */ '@/views/DataSources.vue'
          ),
      },
      {
        path: '/data-sources/:id',
        name: ROUTE_NAMES.dataSourceDetails,
        component: () =>
          import(
            /* webpackChunkName: "data-source" */ '@/views/DataSourceDetails.vue'
          ),
      },
      {
        path: '/oracle-scripts',
        name: ROUTE_NAMES.oracleScripts,
        component: () =>
          import(
            /* webpackChunkName: "oracle-scripts" */ '@/views/OracleScripts.vue'
          ),
      },
      {
        path: '/oracle-scripts/:id',
        name: ROUTE_NAMES.oracleScriptDetails,
        component: () =>
          import(
            /* webpackChunkName: "oracle-script" */ '@/views/OracleScriptDetails.vue'
          ),
      },
      {
        path: '/requests',
        name: ROUTE_NAMES.requests,
        component: () => import('@/views/RequestsView.vue'),
      },
      {
        path: '/requests/:id',
        name: ROUTE_NAMES.requestDetails,
        component: () => import('@/views/RequestDetails.vue'),
      },
      {
        path: '/validators',
        name: ROUTE_NAMES.validators,
        component: () =>
          import(
            /* webpackChunkName: "validators" */ '@/views/ValidatorsView.vue'
          ),
      },
      {
        path: '/validators/:address',
        name: ROUTE_NAMES.validatorDetails,
        component: () =>
          import(
            /* webpackChunkName: "validator" */ '@/views/ValidatorDetails.vue'
          ),
      },
      {
        path: '/governance',
        name: ROUTE_NAMES.governance,
        component: () =>
          import(
            /* webpackChunkName: "governance" */ '@/views/GovernanceView.vue'
          ),
      },
      {
        path: '/governance/:id',
        name: ROUTE_NAMES.proposal,
        component: () =>
          import(/* webpackChunkName: "proposal" */ '@/views/ProposalView.vue'),
      },
      {
        path: '/governance/:id/voting',
        name: ROUTE_NAMES.voting,
        beforeEnter: authorizedOnlyGuard,
        component: () =>
          import(/* webpackChunkName: "voting" */ '@/views/VotingView.vue'),
      },
      {
        path: '/wallet',
        name: ROUTE_NAMES.wallet,
        beforeEnter: authorizedOnlyGuard,
        component: () =>
          import(/* webpackChunkName: "wallet" */ '@/views/WalletView.vue'),
      },
      {
        path: '/ibc',
        name: ROUTE_NAMES.ibc,
        component: () =>
          import(/* webpackChunkName: "wallet" */ '@/views/IbcView.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router

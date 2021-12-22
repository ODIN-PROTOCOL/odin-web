import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import {
  makeAuthorizedOnlyGuard,
  makeRootRedirector,
  makeUnauthorizedOnlyGuard,
} from './guards'

const rootRedirector = makeRootRedirector(
  { name: 'DataSources' },
  { name: 'Auth' }
)
const authorizedOnlyGuard = makeAuthorizedOnlyGuard({ name: 'Auth' })
const unauthorizedOnlyGuard = makeUnauthorizedOnlyGuard({ name: 'Redirector' })

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Redirector', redirect: rootRedirector },
  { path: '/:pathMatch(.*)*', name: 'NotFound', redirect: rootRedirector },
  {
    path: '/auth',
    name: 'Auth',
    beforeEnter: unauthorizedOnlyGuard,
    component: () => import(/* webpackChunkName: "auth" */ '../views/Auth.vue'),
  },
  // TODO: temp. hidden all but validators
  {
    path: '/data-sources',
    name: 'DataSources',
    beforeEnter: authorizedOnlyGuard,
    component: () =>
      import(/* webpackChunkName: "data-sources" */ '../views/DataSources.vue'),
  },
  {
    path: '/data-sources/:id',
    name: 'DataSource',
    beforeEnter: authorizedOnlyGuard,
    component: () =>
      import(
        /* webpackChunkName: "data-source" */ '../views/DataSourcesItem.vue'
      ),
  },
  {
    path: '/oracle-scripts',
    name: 'OracleScripts',
    beforeEnter: authorizedOnlyGuard,
    component: () =>
      import(
        /* webpackChunkName: "oracle-scripts" */ '../views/OracleScripts.vue'
      ),
  },
  {
    path: '/oracle-scripts/:id',
    name: 'OracleScript',
    beforeEnter: authorizedOnlyGuard,
    component: () =>
      import(
        /* webpackChunkName: "oracle-script" */ '../views/OracleScriptsItem.vue'
      ),
  },
  {
    path: '/requests',
    name: 'Requests',
    beforeEnter: authorizedOnlyGuard,
    component: () =>
      import(/* webpackChunkName: "requests" */ '../views/Requests.vue'),
  },
  {
    path: '/requests/:id',
    name: 'Request',
    beforeEnter: authorizedOnlyGuard,
    component: () =>
      import(/* webpackChunkName: "request" */ '../views/RequestItem.vue'),
  },
  {
    path: '/validators',
    name: 'Validators',
    beforeEnter: authorizedOnlyGuard,
    component: () =>
      import(/* webpackChunkName: "validators" */ '../views/Validators.vue'),
  },
  {
    path: '/validators/:address',
    name: 'Validator',
    beforeEnter: authorizedOnlyGuard,
    component: () =>
      import(/* webpackChunkName: "validator" */ '../views/ValidatorItem.vue'),
  },
  {
    path: '/oracle-validators',
    name: 'OracleValidators',
    beforeEnter: authorizedOnlyGuard,
    component: () =>
      import(
        /* webpackChunkName: "oracle-validators" */ '../views/OracleValidators.vue'
      ),
  },
  {
    path: '/governance',
    name: 'Governance',
    beforeEnter: authorizedOnlyGuard,
    component: () =>
      import(/* webpackChunkName: "governance" */ '../views/Governance.vue'),
  },
  {
    path: '/proposal/:id',
    name: 'Proposal',
    beforeEnter: authorizedOnlyGuard,
    component: () =>
      import(/* webpackChunkName: "proposal" */ '../views/Proposal.vue'),
  },
  {
    path: '/proposal/:id/voting',
    name: 'Voting',
    beforeEnter: authorizedOnlyGuard,
    component: () =>
      import(/* webpackChunkName: "voting" */ '../views/Voting.vue'),
  },
  {
    path: '/wallet',
    name: 'Wallet',
    beforeEnter: authorizedOnlyGuard,
    component: () =>
      import(/* webpackChunkName: "wallet" */ '../views/Wallet.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router

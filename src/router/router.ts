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
  {
    path: '/data-sources',
    name: 'DataSources',
    beforeEnter: authorizedOnlyGuard,
    component: () =>
      import(/* webpackChunkName: "data-sources" */ '../views/DataSources.vue'),
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
    path: '/requests',
    name: 'Requests',
    beforeEnter: authorizedOnlyGuard,
    component: () =>
      import(/* webpackChunkName: "requests" */ '../views/Requests.vue'),
  },
  {
    path: '/voting',
    name: 'Voting',
    beforeEnter: authorizedOnlyGuard,
    component: () =>
      import(/* webpackChunkName: "voting" */ '../views/Voting.vue'),
  },
  {
    path: '/validators',
    name: 'Validators',
    beforeEnter: authorizedOnlyGuard,
    component: () =>
      import(/* webpackChunkName: "validators" */ '../views/Validators.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router

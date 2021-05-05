import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { makeAuthorizedOnlyGuard, makeUnauthorizedOnlyGuard } from './guards'
import Home from '../views/Home.vue'

const authorizedOnlyGuard = makeAuthorizedOnlyGuard({ name: 'Auth' })
const unauthorizedOnlyGuard = makeUnauthorizedOnlyGuard({ name: 'Auth' })

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: authorizedOnlyGuard,
  },
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
    path: '/about',
    name: 'About',
    beforeEnter: authorizedOnlyGuard,
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router

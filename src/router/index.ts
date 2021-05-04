import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import { makeAuthorizedOnlyGuard, makeUnauthorizedOnlyGuard } from './guards'

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

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { chartPagesProps } from '@/const'
import { ROUTE_NAMES } from '@/enums'
import { LOGIN_TYPE } from '../api/api-config'
import {
  makeAuthorizedOnlyGuard,
  makeRootRedirector,
  makeUnauthorizedOnlyGuard,
} from './guards'

const rootRedirector = makeRootRedirector(
  { name: ROUTE_NAMES.wallet },
  { name: ROUTE_NAMES.home }
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
        path: '',
        name: ROUTE_NAMES.home,
        component: () =>
          import(/* webpackChunkName: "home" */ '@/views/HomeView.vue'),
      },
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
        path: '/auth/cosmostation494',
        name: ROUTE_NAMES.authCosmostation494,
        props: { loginType: LOGIN_TYPE.COSMOSTATION494 },
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
      // Important::Temporary Remove
      // {
      //   path: '/accounts',
      //   name: ROUTE_NAMES.accounts,
      //   component: () =>
      //     import(
      //       /* webpackChunkName: "accounts" */ '@/views/TopAccountsListView.vue'
      //     ),
      // },
      // Important::Temporary Remove
      {
        path: '/accounts/:hash',
        name: ROUTE_NAMES.accountDetails,
        component: () =>
          import(/* webpackChunkName: "accounts" */ '@/views/AccountsItem.vue'),
      },
      {
        path: '/blocks',
        name: ROUTE_NAMES.blocks,
        component: () =>
          import(/* webpackChunkName: "blocks" */ '@/views/BlocksListView.vue'),
      },
      {
        path: '/skopun',
        name: ROUTE_NAMES.skopun,
        component: () =>
          import(/* webpackChunkName: "skopun" */ '@/views/SkopunView.vue'),
      },
      {
        path: '/nfts',
        name: ROUTE_NAMES.nft_list,
        component: () =>
          import(/* webpackChunkName: "skopun" */ '@/views/NFTListView.vue'),
      },
      {
        path: '/nfts/:id',
        name: ROUTE_NAMES.nft_detail,
        component: () =>
          import(
            /* webpackChunkName: "skopun" */ '@/views/NFTDetailedView.vue'
          ),
      },
      {
        path: '/my-nfts',
        name: ROUTE_NAMES.nft_profile,
        component: () =>
          import(/* webpackChunkName: "skopun" */ '@/views/MyNFTsView.vue'),
      },
      {
        path: '/blocks/:id',
        name: ROUTE_NAMES.blockDetails,
        component: () =>
          import(/* webpackChunkName: "blocks" */ '@/views/BlocksItem.vue'),
      },
      {
        path: '/charts',
        name: ROUTE_NAMES.charts,
        redirect: { name: ROUTE_NAMES.chartsStats },
        component: () =>
          import(/* webpackChunkName: "charts" */ '@/views/ChartsPage.vue'),
        children: [
          {
            path: 'validators',
            name: ROUTE_NAMES.blockValidatorsChart,
            component: () =>
              import(/* webpackChunkName: "charts" */ '@/views/ChartsView.vue'),
          },
          {
            path: 'average-odin-block-size',
            name: ROUTE_NAMES.averageOdinBlockSizeChart,
            component: () =>
              import(/* webpackChunkName: "charts" */ '@/views/ChartView.vue'),
            props: chartPagesProps.averageOdinBlockSizeChart,
          },
          {
            path: 'average-block-time',
            name: ROUTE_NAMES.averageBlockTimeChart,
            component: () =>
              import(/* webpackChunkName: "charts" */ '@/views/ChartView.vue'),
            props: chartPagesProps.averageBlockTimeChart,
          },
          {
            path: 'daily-transactions-volume',
            name: ROUTE_NAMES.dailyTransactionsVolumeChart,
            component: () =>
              import(/* webpackChunkName: "charts" */ '@/views/ChartView.vue'),
            props: chartPagesProps.dailyTransactionsVolumeChart,
          },
          {
            path: 'average-transactions-fee',
            name: ROUTE_NAMES.averageTransactionFeeChart,
            component: () =>
              import(/* webpackChunkName: "charts" */ '@/views/ChartView.vue'),
            props: chartPagesProps.averageTransactionFeeChart,
          },
          {
            path: 'total-requests',
            name: ROUTE_NAMES.totalRequestsChart,
            component: () =>
              import(/* webpackChunkName: "charts" */ '@/views/ChartView.vue'),
            props: chartPagesProps.averageRequestsChart,
          },
        ],
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
        path: '/transactions',
        name: ROUTE_NAMES.transactions,
        component: () => import('@/views/TransactionsView.vue'),
      },
      {
        path: '/transactions/:hash',
        name: ROUTE_NAMES.transactionDetails,
        component: () => import('@/views/TransactionsItem.vue'),
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
            /* webpackChunkName: "validator" */ '@/views/ValidatorItem.vue'
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

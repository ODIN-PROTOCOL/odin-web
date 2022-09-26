<template>
  <div
    class="app-nav"
    :class="{
      'app-nav--mobile': isOpen,
      'app-nav--mobile-not-authenticated': isOpen && !isLoggedIn,
    }"
  >
    <div class="app-nav__wrap-container">
      <NestedLink
        :is-dropdown-open="isBlockchainDropdownOpen"
        :list="BlockchainList"
        @click="onBlockchainOpen"
        @redirect="onPageChange"
      />
      <router-link
        class="app-nav__link"
        data-text="Validators"
        :to="{ name: $routes.validators }"
        @click="onPageChange"
      >
        <span>Validators</span>
      </router-link>
      <router-link
        class="app-nav__link"
        data-text="Data Sources"
        :to="{ name: $routes.dataSources }"
        @click="onPageChange"
      >
        <span>Data Sources</span>
      </router-link>
      <router-link
        class="app-nav__link"
        data-text="Oracle Scripts"
        :to="{ name: $routes.oracleScripts }"
        @click="onPageChange"
      >
        <span>Oracle Scripts</span>
      </router-link>
      <router-link
        class="app-nav__link"
        data-text="Governance"
        :to="{ name: $routes.governance }"
        @click="onPageChange"
      >
        <span>Proposals</span>
      </router-link>
    </div>
    <div class="app-nav__activities">
      <template v-if="isLoggedIn">
        <router-link
          class="router-link-container"
          :to="{ name: $routes.wallet }"
        >
          <button
            class="app-btn log-out-btn app-btn--medium"
            type="button"
            @click="logOutAndLeave()"
          >
            <wallet-icon />
            <span>Wallet</span>
          </button>
        </router-link>
        <button
          class="app-btn log-out-btn app-btn--medium"
          type="button"
          @click="logOutAndLeave()"
        >
          <exit-icon />
          <span>Sign out</span>
        </button>
      </template>
      <template v-else>
        <router-link class="router-link-container" :to="{ name: $routes.auth }">
          <button class="app-btn log-out-btn app-btn--medium" type="button">
            Connect Wallet
          </button>
        </router-link>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import router from '@/router'
import { ROUTE_NAMES } from '@/enums'
import { useAuthorization } from '@/composables/useAuthorization'
import NestedLink from '@/components/AppHeader/NestedLink.vue'
import { ExitIcon, WalletIcon } from '@/components/icons'
import { isMobile } from '@/helpers/helpers'
import { LinkList } from '@/helpers/Types'
import { WalletTypes, wallet } from '@/api/wallet'

const BlockchainList: LinkList = {
  name: 'Blockchain',
  links: [
    {
      name: ROUTE_NAMES.transactions,
      text: 'Transactions',
    },
    {
      name: ROUTE_NAMES.blocks,
      text: 'Blocks',
    },
    {
      name: ROUTE_NAMES.requests,
      text: 'Requests',
    },
    {
      name: ROUTE_NAMES.ibc,
      text: 'IBCs',
    },
    {
      name: ROUTE_NAMES.accounts,
      text: 'Top Accounts',
    },
    {
      name: ROUTE_NAMES.charts,
      text: 'Charts & Stats',
    },
  ],
}

const isBlockchainDropdownOpen = ref(false)

enum EVENTS {
  closeBurger = 'close-burger',
}

withDefaults(
  defineProps<{
    isOpen?: boolean
  }>(),
  {
    isOpen: false,
  },
)

const emit = defineEmits<{
  (e: EVENTS.closeBurger): void
}>()

const { logOut, isLoggedIn } = useAuthorization()

const logOutAndLeave = () => {
  logOut()
  router.push({ name: ROUTE_NAMES.auth })
}

const onPageChange = () => {
  emit(EVENTS.closeBurger)
}

const onBlockchainOpen = () => {
  if (isMobile()) {
    isBlockchainDropdownOpen.value = !isBlockchainDropdownOpen.value
  }
}

onMounted(() => {
  if (!wallet.isEmpty && wallet.type === WalletTypes.KEPLR_WALLET) {
    window.addEventListener('keplr_keystorechange', logOutAndLeave)
  }
})

onUnmounted(() => {
  window.removeEventListener('keplr_keystorechange', logOutAndLeave)
})
</script>

<style scoped lang="scss">
.app-nav__wrap-container {
  width: 100%;
  gap: 2.4rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  color: var(--clr__header-nav-txt);
}

.app-nav__link {
  display: grid;
  grid-template-columns: 100%;
  color: inherit;
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 2.4rem;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    color: var(--clr__action);
  }

  &::before {
    content: attr(data-text);
    grid-row: 1;
    grid-column: 1;
    font-weight: 600;
    opacity: 0;
  }
  > span {
    grid-row: 1;
    grid-column: 1;
    text-align: center;
    transition: color 0.5s ease, font-weight 0.5s ease;
  }
  &.router-link-exact-active > span {
    color: var(--clr__action);
    font-weight: 600;
  }
}

.log-out-btn {
  width: 100%;
  margin-top: 1rem;
  display: none;
}

@include respond-to(tablet) {
  .app-nav {
    width: 100%;
    height: calc(100vh - 8.2rem);
    padding: 0 1.6rem 1.6rem 1.6rem;
    display: none;
    position: absolute;
    top: calc(100% + 0.1rem);
    background: var(--clr__header-bg);
    z-index: 9999;
  }

  .app-nav__wrap-container {
    gap: 0;
    flex-direction: column;
  }

  .app-nav__link {
    width: 100%;
    padding: 1.8rem 1.2rem;

    > span {
      text-align: left;
    }

    &:hover {
      background: rgba(204, 228, 255, 0.4);
    }

    &:first-child {
      padding: 1.8rem 1.2rem;
    }
  }

  .log-out-btn {
    gap: 1.1rem;
    display: flex;
    justify-content: center;
  }

  .app-nav--mobile {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: fixed;
    top: 8.2rem;
    left: 0;
    overflow: auto;
  }

  .app-nav--mobile-not-authenticated {
    top: 8.2rem;
  }

  .router-link-container {
    text-decoration: none;
  }
}
</style>

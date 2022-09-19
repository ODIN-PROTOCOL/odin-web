<template>
  <div
    class="app-nav"
    :class="{
      'app-nav--mobile': isOpen,
      'app-nav--mobile-not-authenticated': isOpen && !isLoggedIn,
    }"
  >
    <div class="app-nav__wrap-container">
      <router-link
        class="app-nav__link"
        data-text="Data Sources"
        :to="{ name: $routes.dataSources }"
        @click="closeBurger"
      >
        <span>Data Sources</span>
      </router-link>
      <router-link
        class="app-nav__link"
        data-text="Oracle Scripts"
        :to="{ name: $routes.oracleScripts }"
        @click="closeBurger"
      >
        <span>Oracle Scripts</span>
      </router-link>
      <router-link
        class="app-nav__link"
        data-text="Requests"
        :to="{ name: $routes.requests }"
        @click="closeBurger"
      >
        <span>Requests</span>
      </router-link>
      <router-link
        class="app-nav__link"
        data-text="Transactions"
        :to="{ name: $routes.validators }"
        @click="closeBurger"
      >
        <span>Transactions</span>
      </router-link>
      <router-link
        class="app-nav__link"
        data-text="Blocks"
        :to="{ name: $routes.validators }"
        @click="closeBurger"
      >
        <span>Blocks</span>
      </router-link>
      <router-link
        class="app-nav__link"
        data-text="Validators"
        :to="{ name: $routes.validators }"
        @click="closeBurger"
      >
        <span>Validators</span>
      </router-link>
      <router-link
        class="app-nav__link"
        data-text="Top Accounts"
        :to="{ name: $routes.validators }"
        @click="closeBurger"
      >
        <span>Top Accounts</span>
      </router-link>
      <router-link
        class="app-nav__link"
        data-text="Charts & Stats"
        :to="{ name: $routes.validators }"
        @click="closeBurger"
      >
        <span>Charts & Stats</span>
      </router-link>
      <router-link
        class="app-nav__link"
        data-text="Governance"
        :to="{ name: $routes.governance }"
        @click="closeBurger"
      >
        <span>Governance</span>
      </router-link>
      <router-link
        class="app-nav__link"
        data-text="IBCs"
        :to="{ name: $routes.ibc }"
        @click="closeBurger"
      >
        <span>IBCs</span>
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
import { onMounted, onUnmounted } from 'vue'
import router from '@/router'
import { ROUTE_NAMES } from '@/enums'
import { useAuthorization } from '@/composables/useAuthorization'
import { ExitIcon, WalletIcon } from '@/components/icons'
import { WalletTypes, wallet } from '@/api/wallet'

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

const closeBurger = () => {
  emit(EVENTS.closeBurger)
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

<template>
  <div
    class="nav"
    :class="{
      'nav--mobile': isOpen,
      'nav--mobile--not-authenticated': isOpen && !isLoggedIn,
    }"
  >
    <div class="nav__wrap-cont">
      <router-link
        @click="closeBurger"
        :to="{ name: 'DataSources' }"
        data-text="Data Sources"
        class="nav__link"
      >
        <span>Data Sources</span>
      </router-link>
      <router-link
        @click="closeBurger"
        :to="{ name: 'OracleScripts' }"
        data-text="Oracle Scripts"
        class="nav__link"
      >
        <span>Oracle Scripts</span>
      </router-link>
      <router-link
        @click="closeBurger"
        :to="{ name: 'Requests' }"
        data-text="Requests"
        class="nav__link"
      >
        <span>Requests</span>
      </router-link>
      <router-link
        @click="closeBurger"
        class="nav__link"
        data-text="Validators"
        :to="{ name: 'Validators' }"
      >
        <span>Validators</span>
      </router-link>
      <router-link
        @click="closeBurger"
        :to="{ name: 'Governance' }"
        data-text="Governance"
        class="nav__link"
      >
        <span>Governance</span>
      </router-link>
      <router-link
        @click="closeBurger"
        :to="{ name: 'IBC' }"
        data-text="IBCs"
        class="nav__link"
      >
        <span>IBCs</span>
      </router-link>
    </div>
    <div class="nav__activities" v-if="isLoggedIn">
      <button
        class="app-btn log-out-btn app-btn--medium"
        type="button"
        @click="logOutAndLeave()"
      >
        <ExitIcon />
        <span>Sign out</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from 'vue'
import { useAuthorization } from '@/composables/useAuthorization'
import router from '@/router'
import ExitIcon from '@/components/icons/ExitIcon.vue'
import { WalletTypes, wallet } from '@/api/wallet'

export default defineComponent({
  components: { ExitIcon },
  emits: ['closeBurger'],
  props: {
    isOpen: { type: Boolean, default: false },
  },
  setup(_, { emit }) {
    const auth = useAuthorization()
    const logOutAndLeave = () => {
      auth.logOut()
      router.push({ name: 'Auth' })
    }
    const closeBurger = () => {
      emit('closeBurger')
    }

    onMounted(() => {
      if (!wallet.isEmpty && wallet.type === WalletTypes.KEPLR_WALLET) {
        window.addEventListener('keplr_keystorechange', logOutAndLeave)
      }
    })

    onUnmounted(() => {
      window.removeEventListener('keplr_keystorechange', logOutAndLeave)
    })

    return {
      logOutAndLeave,
      closeBurger,
      isLoggedIn: auth.isLoggedIn,
    }
  },
})
</script>

<style scoped lang="scss">
.nav__wrap-cont {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  align-items: center;
  gap: 2.4rem;
}

.nav__link {
  display: grid;
  grid-template-columns: 100%;
  text-decoration: none;
  white-space: nowrap;
  color: inherit;
  font-weight: 400;
  line-height: 2.4rem;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    color: var(--clr__action);
  }

  &::before {
    content: attr(data-text);
    font-weight: 900;
    opacity: 0;
    grid-column: 1;
    grid-row: 1;
  }
  > span {
    text-align: center;
    grid-column: 1;
    grid-row: 1;
    transition: color 0.5s ease, font-weight 0.5s ease;
  }
  &.router-link-exact-active > span {
    font-weight: bold;
    color: var(--clr__action);
  }
}

.log-out-btn {
  display: none;
  margin-top: auto;
  width: 100%;
}

@media (max-width: 768px) {
  .nav {
    display: none;
    background: #fff;
    position: absolute;
    top: calc(100% + 0.1rem);
    width: 100%;
    padding: 0 1.6rem 1.6rem 1.6rem;
    z-index: 9999;
    height: calc(100vh - 9.6rem);
  }
  .nav__wrap-cont {
    flex-direction: column;
    gap: 0;
  }

  .nav__link {
    width: 100%;
    padding: 2.4rem 1.2rem;
    border-bottom: 0.1rem solid #ced4da;
    > span {
      text-align: left;
    }

    &:hover {
      background: rgba(204, 228, 255, 0.4);
    }

    &:first-child {
      padding: 2.4rem 1.2rem;
    }
  }

  .log-out-btn {
    display: flex;
    justify-content: center;
    gap: 1.1rem;
  }

  .nav--mobile {
    display: flex;
    overflow: auto;
    flex-direction: column;
    justify-content: space-between;
    position: fixed;
    top: 9.7rem;
    left: 0;
  }

  .nav--mobile--not-authenticated {
    top: 8.5rem;
  }
}
</style>

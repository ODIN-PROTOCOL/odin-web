<template>
  <div class="nav" :class="{ 'nav-mob': isOpen }">
    <div class="nav__wrap-cont">
      <router-link
        class="nav__link"
        data-text="Data Sources"
        :to="{ name: 'DataSources' }"
      >
        <span>Data Sources</span>
      </router-link>
      <router-link
        class="nav__link"
        data-text="Oracle Scripts"
        :to="{ name: 'OracleScripts' }"
      >
        <span>Oracle Scripts</span>
      </router-link>
      <router-link
        class="nav__link"
        data-text="Requests"
        :to="{ name: 'Requests' }"
      >
        <span>Requests</span>
      </router-link>
      <LinksDropdown :isActive="isDropdownActive" :list="ValidatorsList" />
      <router-link class="nav__link" data-text="Rewards" to="/">
        <span>Rewards</span>
      </router-link>
      <router-link
        class="nav__link"
        data-text="Governance"
        :to="{ name: 'Governance' }"
      >
        <span>Governance</span>
      </router-link>
      <!-- Voting page not ready -->
      <!--      <router-link class="nav__link" :to="{ name: 'Voting' }">-->
      <!--        Voting-->
      <!--      </router-link>-->
    </div>
    <div class="nav__activities">
      <button
        class="app-btn log-out-btn"
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
import { defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthorization } from '@/composables/useAuthorization'
import router from '@/router'
import LinksDropdown from '@/components/LinksDropdown.vue'
import ExitIcon from '@/components/icons/ExitIcon.vue'
import { WalletTypes, wallet } from '@/api/wallet'

export default defineComponent({
  components: { LinksDropdown, ExitIcon },
  emits: ['changeRoute'],
  props: {
    isOpen: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const ValidatorsList = {
      name: 'Validators',
      links: [
        {
          to: 'Validators',
          text: 'Validators',
        },
        {
          to: 'OracleValidators',
          text: 'Oracle validators',
        },
      ],
    }

    const auth = useAuthorization()
    function logOutAndLeave() {
      auth.logOut()
      router.push({ name: 'Auth' })
    }

    const route = useRoute()
    watch(
      () => route.path,
      () => {
        emit('changeRoute')
        handleDropdownActive()
      }
    )

    const isDropdownActive = ref(false)
    const urls = ['/validators', '/oracle-validators']
    const handleDropdownActive = () => {
      isDropdownActive.value = urls.indexOf(route.path) > -1
    }

    onMounted(() => {
      if (wallet.type === WalletTypes.KEPLR_WALLET) {
        window.addEventListener('keplr_keystorechange', logOutAndLeave)
      }
    })

    onUnmounted(() => {
      window.removeEventListener('keplr_keystorechange', logOutAndLeave)
    })

    return {
      isDropdownActive,
      logOutAndLeave,
      handleDropdownActive,
      ValidatorsList,
    }
  },
})
</script>

<style scoped lang="scss">
.nav {
  &__wrap-cont {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    align-items: center;
    gap: 2.4rem;
  }

  &__link {
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

    &__wrap-cont {
      flex-direction: column;
      gap: 0;
    }

    &__link {
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
  }

  .log-out-btn {
    display: flex;
    justify-content: center;
    gap: 1.1rem;
  }

  .nav-mob {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: fixed;
    top: 9.7rem;
    left: 0;
  }
}
</style>

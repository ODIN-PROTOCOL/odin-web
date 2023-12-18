<template>
  <div class="user-widget fx-row">
    <template v-if="isLoggedIn">
      <BalanceButton class="user-widget__wallet" />
      <button
        class="user-widget__log-out app-ico-btn"
        type="button"
        @click="logOutAndLeave()"
      >
        <exit-icon />
      </button>
    </template>
    <template v-if="!isLoggedIn">
      <router-link
        class="app-btn app-btn--small user-widget__connect-wallet-btn"
        :to="{ name: $routes.auth }"
      >
        Connect Wallet
      </router-link>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useAuthorization } from '@/composables/useAuthorization'
import { ROUTE_NAMES } from '@/enums'
import BalanceButton from '@/components/BalanceButton.vue'
import { ExitIcon } from '@/components/icons'
import router from '@/router'

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
</script>

<style scoped lang="scss">
.user-widget {
  gap: 2.4rem;
}

.user-widget__connect-wallet-btn {
  text-decoration: none;
}

.user-widget__log-out {
  display: flex;
  align-items: center;
  justify-content: center;
}

@include respond-to(tablet) {
  .user-widget__connect-wallet-btn {
    display: none;
  }
}
</style>

<template>
  <div class="user-widget fx-row">
    <template v-if="isLoggedIn">
      <BalanceButton @click="closeBurger" />
      <button
        class="user-widget__log-out app-ico-btn"
        type="button"
        @click="logOutAndLeave()"
      >
        <img src="~@/assets/icons/exit.svg" alt="Log out" />
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

@media (max-width: 768px) {
  .user-widget__log-out {
    display: none;
  }
}
</style>

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
        :to="{ name: 'Auth' }"
      >
        Connect Wallet
      </router-link>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAuthorization } from '@/composables/useAuthorization'
import BalanceButton from '@/components/BalanceButton.vue'
import router from '@/router'

export default defineComponent({
  components: { BalanceButton },
  emits: ['closeBurger'],
  setup(_, { emit }) {
    const auth = useAuthorization()
    const logOutAndLeave = () => {
      auth.logOut()
      router.push({ name: 'Auth' })
    }
    const closeBurger = () => {
      emit('closeBurger')
    }
    return { logOutAndLeave, closeBurger, isLoggedIn: auth.isLoggedIn }
  },
})
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

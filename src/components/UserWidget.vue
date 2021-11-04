<template>
  <div class="user-widget fx-row">
    <!--TEMP. Hide all unnecessary -->
    <!-- <Search /> -->
    <!-- <button class="nav-btn">
      <img src="~@/assets/icons/metamask.svg" alt="metamask" />
    </button> -->
    <MetaMask />
    <BalanceButton />
    <button
      class="app-ico-btn log-out-and-leave"
      type="button"
      @click="logOutAndLeave()"
    >
      <img src="~@/assets/icons/exit.svg" alt="Log out" />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAuthorization } from '@/composables/useAuthorization'
import BalanceButton from '@/components/BalanceButton.vue'
import MetaMask from '@/components/MetaMask/MetaMask.vue'
// import Search from '@/components/Search.vue'
import router from '@/router'

export default defineComponent({
  components: { BalanceButton, MetaMask },
  setup() {
    const auth = useAuthorization()
    const logOutAndLeave = () => {
      auth.logOut()
      router.push({ name: 'Auth' })
    }

    return { logOutAndLeave }
  },
})
</script>

<style scoped lang="scss">
.user-widget {
  gap: 2.4rem;
}

@media (max-width: 768px) {
  .log-out-and-leave {
    display: none;
  }
}
</style>

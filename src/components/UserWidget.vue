<template>
  <div class="user-widget fx-row">
    <Search />
    <BalanceButton />

    <button class="app-ico-btn logOutAndLeave" type="button" @click="logOutAndLeave()">
      <img src="~@/assets/icons/exit.svg" alt="Log out" />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAuthorization } from '@/composables/useAuthorization'
import BalanceButton from '@/components/BalanceButton.vue'
import Search from '@/components/Search.vue'
import router from '@/router'

export default defineComponent({
  components: { BalanceButton, Search },
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
  gap: 24px;
}
@media (min-width: 768px) {
  .logOutAndLeave {
    display: none;
  }
}
</style>

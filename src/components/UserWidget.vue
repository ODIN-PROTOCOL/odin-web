<template>
  <div class="user-widget fx-row">
    <BalanceButton />

    <button class="app-ico-btn mg-l8" type="button" @click="logOutAndLeave()">
      <img src="~@/assets/icons/exit.svg" alt="Log out" />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAuthorization } from '@/composables/useAuthorization'
import BalanceButton from '@/components/BalanceButton.vue'
import router from '@/router'

export default defineComponent({
  components: { BalanceButton },
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

<style scoped lang="scss"></style>

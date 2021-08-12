<template>
  <div class="user-widget fx-row gap-5">
    <BalanceButton />
    <button
      class="app-btn-2nd w-full"
      type="submit"
      @click.prevent="connectMetaMask"
    >
      Connect MetaMask
    </button>
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
import { showMetaMaskFormDialog } from '@/components/modals/MetaMaskModal.vue'

export default defineComponent({
  components: { BalanceButton },
  setup() {
    const auth = useAuthorization()
    const logOutAndLeave = () => {
      auth.logOut()
      router.push({ name: 'Auth' })
    }

    const connectMetaMask = (): void => {
      showMetaMaskFormDialog()
    }
    return { logOutAndLeave, connectMetaMask }
  },
})
</script>

<style scoped lang="scss"></style>

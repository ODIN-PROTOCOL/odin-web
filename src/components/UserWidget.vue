<template>
  <div class="user-widget fx-row gap-5">
    <BalanceButton />
    <button class="metamask-btn" type="submit" @click.prevent="connectMetaMask">
      <img src="~@/assets/brand/metamask-fox.svg" alt="metamask_logo" />
      <span>MetaMask</span>
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

<style scoped lang="scss">
.metamask-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.4rem 0.8rem;
  border-radius: 1.2rem;
  box-shadow: 0 0 1rem 1rem transparent;
  border: 1px solid var(--clr__action);
  transition: box-shadow 0.4s ease, color 0.4s ease, background-color 0.4s ease;
  img {
    width: 3rem;
    height: 3rem;
  }
  span {
    line-height: 1;
    padding-top: 0.2rem;
  }
  &:hover {
    background-color: var(--clr__action-extra-muted);
    box-shadow: 0 0 1rem 1rem var(--clr__action-extra-muted);
    color: var(--clr__action);
  }
}
</style>

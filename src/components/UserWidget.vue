<template>
  <div class="user-widget fx-row">
    <Search />
    <button class="nav-btn">
      <img src="~@/assets/icons/metamask.svg" alt="metamask" />
    </button>
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
  gap: 2.4rem;
}

.nav-btn {
  padding: 0.8rem;
  width: 4.8rem;
  height: 4.8rem;
  border: 1px solid var(--clr__action);
  border-radius: 4px;

  &:hover {
    background: var(--clr__action);
  }

  &:focus {
    border: 1px solid var(--clr__btn-normal);
    background: var(--clr__btn-hover);
  }

  &:hover {
    border: 1px solid transparent;
    background: var(--clr__action);
  }

  &:active {
    border: 1px solid transparent;
    background: var(--clr__btn-pressed);
  }
}

@media (max-width: 768px) {
  .log-out-and-leave {
    display: none;
  }
}
</style>

<template>
  <router-link class="balance-button" :to="{ name: 'Wallet' }">
    <WalletIcon />
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import WalletIcon from '@/components/icons/WalletIcon.vue'

export default defineComponent({
  components: {
    WalletIcon,
  },
})
</script>

<style lang="scss" scoped>
.balance-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  border: 0.1rem solid transparent;
  border-radius: 0.4rem;
  background: var(--clr__action);
  width: 4.8rem;
  height: 4.8rem;

  @include transition(background);
  &:hover {
    border: 0.1rem solid transparent;
    background: var(--clr__btn-hover);
  }
  &:active {
    border: 0.1rem solid transparent;
    background: var(--clr__btn-pressed);
  }
  &:disabled {
    border: 0.1rem solid transparent;
    background: var(--clr__btn-disabled);
  }
}
body.dark .balance-button {
    background: var(--d-clr__btn-normal);
  &:hover {
    background: var(--d-clr__btn-hover);
  }
  &:active {
    background: var(--d-clr__btn-pressed);
  }
  &:disabled {
    background: var(--d-clr__btn-disabled);
  }
}
</style>

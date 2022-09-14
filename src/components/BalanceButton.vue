<template>
  <router-link class="balance-button" :to="{ name: $routes.wallet }">
    <WalletIcon />
  </router-link>
</template>

<script lang="ts" setup>
import { WalletIcon } from '@/components/icons'
</script>

<style lang="scss" scoped>
.balance-button {
  width: 4.8rem;
  height: 4.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  position: relative;
  background-color: var(--clr__action);
  border: 0.1rem solid transparent;
  border-radius: 0.4rem;
  @include transition(background);

  &:hover {
    border: 0.1rem solid transparent;
    background-color: var(--clr__btn-hover);
  }

  &:active {
    border: 0.1rem solid transparent;
    background-color: var(--clr__btn-pressed);
  }

  &:disabled {
    border: 0.1rem solid transparent;
    background-color: var(--clr__btn-disabled);
  }
}
</style>

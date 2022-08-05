<template>
  <header class="app-header fx-row" :class="{ 'app-header--mobile': isOpen }">
    <div class="app-header__content">
      <img
        class="app-header__content-logo"
        src="~@/assets/brand/odin-logo-black.png"
        alt="Logo"
      />
      <app-nav :is-open="isOpen" @close-burger="closeBurger" />
      <user-widget @close-burger="closeBurger" class="fx-sae" />
      <burger-menu
        @click="burgerMenuHandler($event)"
        :is-open="isOpen"
        class="app-header__burger-menu"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppNav from '@/components/AppNav.vue'
import UserWidget from '@/components/UserWidget.vue'
import BurgerMenu from '@/components/BurgerMenu.vue'

const isOpen = ref(false)
const burgerMenuHandler = (event: Event | MouseEvent) => {
  event.preventDefault()
  isOpen.value = !isOpen.value
}

const closeBurger = () => {
  isOpen.value = false
}
</script>

<style scoped lang="scss">
.app-header {
  border-bottom: 0.1rem solid var(--clr__light-blue);
  margin-bottom: 3rem;
}

.app-header__burger-menu {
  display: none;
}
.app-header__content-logo {
  width: 9rem;
  height: 3.4rem;
}

.app-header__content {
  padding: 2.5rem 3.2rem;
  width: 100%;
  max-width: 140rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5.4rem;
  margin: 0 auto;
}

@include respond-to(tablet) {
  .app-header--mobile {
    position: fixed;
    width: 100%;
    z-index: 1;
    background: var(--clr__main-bg);
  }
  .app-header__content {
    gap: 0.4rem;
    position: relative;
    max-width: 100%;
    margin: 0;
    padding: 2.4rem 1.6rem;
  }
  .app-header__burger-menu {
    display: flex;
    flex-shrink: 0;
  }
}
</style>

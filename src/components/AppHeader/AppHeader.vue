<template>
  <header class="app-header" :class="{ 'app-header--mobile': isOpen }">
    <div class="app-header__content">
      <div class="app-header__content-logo">
        <app-logo-icon />
      </div>
      <app-nav :is-open="isOpen" @close-burger="onBurgerClose" />
      <user-widget class="fx-sae" @close-burger="onBurgerClose" />
      <div class="app-header__mobile-nav">
        <theme-switch
          class="theme-switch"
          :theme="currentTheme"
          :toggle-theme="toggleTheme"
        />
        <burger-menu
          class="app-header__burger-menu"
          :is-open="isOpen"
          @click="onBurgerMenuClick($event)"
        />
      </div>
    </div>
    <div class="app-header__search-bar">
      <div class="app-header__content">
        <search-bar />
        <theme-switch
          class="theme-switch"
          :theme="currentTheme"
          :toggle-theme="toggleTheme"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AppLogoIcon } from '@/components/icons'
import AppNav from '@/components/AppHeader/AppNav.vue'
import BurgerMenu from '@/components/AppHeader/BurgerMenu.vue'
import UserWidget from '@/components/AppHeader/UserWidget.vue'
import SearchBar from '@/components/SearchBar/SearchBar.vue'
import ThemeSwitch from '@/components/ThemeSwitch.vue'
import { Theme, ThemeMode } from '@/helpers/theme'

const isOpen = ref(false)
const currentTheme = ref(Theme.getTheme())

const toggleTheme = (theme: ThemeMode): void => {
  Theme.setTheme(theme)
  currentTheme.value = theme
}

const onBurgerMenuClick = (event: Event | MouseEvent) => {
  event.preventDefault()
  isOpen.value = !isOpen.value
}

const onBurgerClose = () => {
  isOpen.value = false
}
</script>

<style scoped lang="scss">
.app-header {
  background-color: var(--clr__header-bg);
}

.app-header__burger-menu {
  display: none;
}

.app-header__content-logo {
  width: 9rem;
  height: 3.4rem;
}

.app-header__content {
  width: 100%;
  max-width: 140rem;
  margin: 0 auto;
  padding: 2.5rem 3.2rem;
  gap: 5.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-header__mobile-nav {
  display: none;

  @include respond-to(tablet) {
    display: flex;
    align-items: center;
    gap: 2rem;
    flex-shrink: 0;
  }
}

.app-header__search-bar {
  height: 8.4rem;
  display: flex;
  align-items: center;
  background-color: var(--clr__search-bar-bg);

  .app__container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

@include respond-to(tablet) {
  .app-header--mobile {
    width: 100%;
    position: fixed;
    z-index: 1;
  }

  .app-header__content {
    max-width: 100%;
    margin: 0;
    padding: 2.4rem 1.6rem;
    gap: 0.4rem;
    position: relative;
  }

  .app-header__burger-menu {
    display: flex;
    flex-shrink: 0;
  }

  .app-header__search-bar {
    .theme-switch {
      display: none;
    }
  }
}
</style>

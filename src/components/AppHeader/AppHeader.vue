<template>
  <header class="app-header" :class="{ 'app-header--mobile': isOpen }">
    <div class="app-header__content">
      <!-- <div class="app-header__content-logo">
        <router-link :to="{ name: $routes.app }" @click="onBurgerClose">
          <app-logo-icon />
        </router-link>
      </div> -->
      <burger-menu
        class="app-header__burger-menu"
        className=""
        :is-open="false"
        @click="emits('toggleSidebar')"
      />
      <search-bar />
      <theme-switch
        class="theme-switch"
        :theme="currentTheme"
        :toggle-theme="toggleTheme"
      />
      <user-widget class="fx-sae" />
    </div>
    <!-- <div class="app-header__search-bar">
      <div class="app-header__content">
        <search-bar />
        <theme-switch
          class="theme-switch"
          :theme="currentTheme"
          :toggle-theme="toggleTheme"
        />
      </div>
    </div> -->
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BurgerMenu from '@/components/AppHeader/BurgerMenu.vue'
import UserWidget from '@/components/AppHeader/UserWidget.vue'
import SearchBar from '@/components/SearchBar/SearchBar.vue'
import ThemeSwitch from '@/components/ThemeSwitch.vue'
import { Theme, ThemeMode } from '@/helpers/theme'

const emits = defineEmits(['toggleSidebar'])

defineProps({
  open: {
    type: Boolean,
  },
})

const isOpen = ref(false)
const currentTheme = ref(Theme.getTheme())

const toggleTheme = (theme: ThemeMode): void => {
  Theme.setTheme(theme)
  currentTheme.value = theme
}
</script>

<style lang="scss">
.app-header {
  background-color: var(--clr__header-bg);
  border-bottom: 1px solid var(--clr__card-border);
}

.app-header__content-logo {
  width: 9rem;
  height: 2.8rem;
}

.app-header__content {
  width: 100%;
  max-width: 140rem;
  margin: 0 auto;
  padding: 1.8rem 3.2rem;
  gap: 2rem;
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
    padding: 1.8rem 1.6rem;
    gap: 1rem;
    position: relative;
  }

  .app-header__burger-menu {
    display: flex;
    flex-shrink: 0;
    svg {
      color: var(--clr__main-text) !important ;
    }
  }

  .app-header__search-bar {
    .theme-switch {
      display: none;
    }
  }
}
</style>

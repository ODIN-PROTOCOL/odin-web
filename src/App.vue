<template>
  <template v-if="isAppReady">
    <template v-if="isLoggedIn">
      <header class="view-header fx-row">
        <div class="header-wrapper">
          <img
            class="logo"
            src="~@/assets/brand/odin-logo-black.png"
            alt="Logo"
            width="120"
          />
          <Nav :isOpen="isOpen" @changeRoute="changeRoute" />
          <BurgerMenu
            class="burger-menu"
            :isOpen="isOpen"
            @click="burgerMenuHandler($event)"
          />
        </div>
      </header>
    </template>
    <router-view />
  </template>
  <div class="dialogs-container" ref="dialogsContainerRef"></div>
  <notifications width="100%" />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { dialogs } from '@/helpers/dialogs'
import { useAuthorization } from '@/composables/useAuthorization'
import Nav from '@/components/Nav.vue'
import BurgerMenu from '@/components/BurgerMenu.vue'

export default defineComponent({
  components: { Nav, BurgerMenu },
  setup() {
    const _readyStates = ref({
      dialogs: false,
    })
    const isAppReady = computed(() => {
      return Object.values(_readyStates.value).every((v) => v === true)
    })

    // Burger Menu
    const isOpen = ref<boolean>(false)
    const burgerMenuHandler = (event: Event | MouseEvent) => {
      event.preventDefault()
      isOpen.value = isOpen.value !== true
    }
    const changeRoute = (): void => {
      if (isOpen.value === true) isOpen.value = false
    }

    // Dialogs
    const dialogsContainerRef = ref<HTMLElement>()
    onMounted(() => {
      if (dialogsContainerRef.value instanceof HTMLElement) {
        dialogs.init(dialogsContainerRef.value)
        _readyStates.value.dialogs = true
      }
    })

    return {
      burgerMenuHandler,
      isOpen,
      changeRoute,
      isAppReady,
      dialogsContainerRef,
      isLoggedIn: useAuthorization().isLoggedIn,
    }
  },
})
</script>

<style lang="scss">
@import '~@/styles/reset.scss';
@import '~@/styles/root.scss';
@import '~@/styles/buttons.scss';
@import '~@/styles/tables.scss';
@import '~@/styles/views.scss';
@import '~@/styles/load-fog.scss';
@import '~@/styles/forms.scss';
@import '~@/styles/vue-notification.scss';
@import '~@/styles/shortcuts.scss';

#app {
  * {
    font-family: 'SF Display', serif;
  }
  width: 100%;
  @include flex-container;

  .burger-menu {
    display: none;
  }
  .logo {
    width: 90px;
    height: 34px;
  }

  @media (max-width: 768px) {
    .header-wrapper {
      gap: 0.4rem;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      padding: 2.5rem 1rem;
    }
    .burger-menu {
      display: flex;
      flex-shrink: 0;
    }
  }
}
</style>

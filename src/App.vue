<template>
  <template v-if="isAppReady">
    <template v-if="!isAuthPage">
      <header
        class="view-header fx-row"
        :class="{ 'view-header_mobile': isOpen }"
      >
        <div class="header-wrapper">
          <img
            class="header-wrapper__logo"
            src="~@/assets/brand/odin-logo-black.png"
            alt="Logo"
          />
          <Nav :isOpen="isOpen" @closeBurger="closeBurger" />
          <UserWidget @closeBurger="closeBurger" class="fx-sae" />
          <BurgerMenu
            @click="burgerMenuHandler($event)"
            :isOpen="isOpen"
            class="burger-menu"
          />
        </div>
      </header>
    </template>
    <router-view />
  </template>
  <div class="dialogs-container" ref="dialogsContainerRef"></div>
  <notifications width="100%" position="" animation-name="v-fade-left" :max="3">
    <template v-slot:body="props">
      <div
        class="app__notification"
        @click="props.close"
        :class="notification?.typeNotification.toLowerCase()"
      >
        <div>
          <InfoNotificationIcon
            class="app__notification-icon"
            v-if="notification?.typeNotification === 'Info'"
          />
          <SuccessNotificationIcon
            class="app__notification-icon"
            v-else-if="notification?.typeNotification === 'Success'"
          />
          <FailedNotificationIcon class="app__notification-icon" v-else />
        </div>
        <div class="app__notification-content-wrapper">
          <p class="app__notification-title">
            {{ notification?.typeNotification }}
          </p>
          <p class="app__notification-content">{{ notification?.error }}</p>
        </div>
        <div class="app__cancel-icon-wrapper">
          <CancelIcon @click="props.close" class="app__cancel-icon" />
        </div>
      </div>
    </template>
  </notifications>
</template>

<script lang="ts">
import '@invisiburu/vue-picker/dist/vue-picker.min.css'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { dialogs } from '@/helpers/dialogs'
import { useAuthorization } from '@/composables/useAuthorization'
import Nav from '@/components/Nav.vue'
import UserWidget from '@/components/UserWidget.vue'
import BurgerMenu from '@/components/BurgerMenu.vue'

import InfoNotificationIcon from '@/components/icons/InfoNotificationIcon.vue'
import SuccessNotificationIcon from '@/components/icons/SuccessNotificationIcon.vue'
import FailedNotificationIcon from '@/components/icons/FailedNotificationIcon.vue'
import CancelIcon from '@/components/icons/CancelIcon.vue'
import { notify } from '@kyvg/vue3-notification'
import emitter from '@/helpers/emmiter'
import { useRoute } from 'vue-router'
type NotificationInfo = {
  error: Error
  typeNotification?: string
}
export default defineComponent({
  components: {
    Nav,
    UserWidget,
    BurgerMenu,
    InfoNotificationIcon,
    FailedNotificationIcon,
    SuccessNotificationIcon,
    CancelIcon,
  },
  setup() {
    const notification = ref<NotificationInfo>()
    const _readyStates = ref({
      dialogs: false,
    })
    const isAppReady = computed(() => {
      return Object.values(_readyStates.value).every((v) => v === true)
    })

    // Dialogs
    const dialogsContainerRef = ref<HTMLElement>()
    onMounted(() => {
      if (dialogsContainerRef.value instanceof HTMLElement) {
        dialogs.init(dialogsContainerRef.value)
        _readyStates.value.dialogs = true
      }
    })

    // Burger Menu
    const isOpen = ref(false)
    const burgerMenuHandler = (event: Event | MouseEvent) => {
      event.preventDefault()
      isOpen.value = isOpen.value !== true
    }

    const closeBurger = () => {
      if (isOpen.value === true) isOpen.value = false
    }

    const route = useRoute()
    const isAuthPage = computed(() => route?.name?.toString().includes('Auth'))

    // Notification
    const DURATION = 7000
    emitter.on('handleNotification', (e) => {
      notification.value = e as NotificationInfo
      notify({
        ignoreDuplicates: true,
        duration: DURATION,
      })
    })

    return {
      isAppReady,
      dialogsContainerRef,
      isLoggedIn: useAuthorization().isLoggedIn,
      isOpen,
      burgerMenuHandler,
      closeBurger,
      notification,
      isAuthPage,
    }
  },
})
</script>

<style lang="scss">
@import '~@/styles/reset.scss';
@import '~@/styles/font.scss';
@import '~@/styles/root.scss';
@import '~@/styles/common.scss';
@import '~@/styles/buttons.scss';
@import '~@/styles/cards.scss';
@import '~@/styles/tables.scss';
@import '~@/styles/views.scss';
@import '~@/styles/forms.scss';
@import '~@/styles/vue-notification.scss';
@import '~@/styles/shortcuts.scss';
@import '~@/styles/atom-one-dark.scss';
#app {
  width: 100%;
  @include flex-container;
}
.animation--wave::before {
  animation: wave 0.5s linear 0.5s infinite;
}
.burger-menu {
  display: none;
}
.header-wrapper__logo {
  width: 9rem;
  height: 3.4rem;
}
@media (max-width: 768px) {
  .view-header_mobile {
    position: fixed;
    width: 100%;
    z-index: 1;
    background: var(--clr__main-bg);
  }
  .header-wrapper {
    gap: 0.4rem;
  }
  .burger-menu {
    display: flex;
    flex-shrink: 0;
  }
}
</style>

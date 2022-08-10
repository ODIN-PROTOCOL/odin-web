<template>
  <template v-if="isAppReady">
    <app-header v-if="!isAuthPage" />
    <router-view />
  </template>
  <div class="dialogs-container" ref="dialogsContainerRef"></div>
  <notifications-group />
</template>

<script setup lang="ts">
import '@invisiburu/vue-picker/dist/vue-picker.min.css'
import { computed, onMounted, ref } from 'vue'
import { dialogs } from '@/helpers/dialogs'
import { useRoute } from 'vue-router'
import { ROUTE_NAMES } from '@/enums'
import AppHeader from '@/components/AppHeader.vue'
import NotificationsGroup from '@/components/NotificationsGroup.vue'

const _readyStates = ref({
  dialogs: false,
})
const isAppReady = computed(() => {
  return Object.values(_readyStates.value).every(v => v === true)
})

// Dialogs
const dialogsContainerRef = ref<HTMLElement>()
onMounted(() => {
  if (dialogsContainerRef.value instanceof HTMLElement) {
    dialogs.init(dialogsContainerRef.value)
    _readyStates.value.dialogs = true
  }
})

const route = useRoute()

const isAuthPage = computed(
  () => route?.name?.toString().includes(ROUTE_NAMES.auth) ?? true,
)
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
@import '~@/styles/shortcuts.scss';
@import '~@/styles/atom-one-dark.scss';
@import '~@/styles/vue-skeletor.scss';

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
  body.dark {
    .view-header_mobile {
      background: var(--d-clr__main-bg);
    }
  }
}
</style>

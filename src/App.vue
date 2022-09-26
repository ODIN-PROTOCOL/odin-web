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
import { Theme } from '@/helpers/theme'
import { useRoute } from 'vue-router'
import { ROUTE_NAMES } from '@/enums'
import AppHeader from '@/components/AppHeader'
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
  const userTheme = Theme.getTheme() || Theme.getMediaPreference()
  Theme.setTheme(userTheme)

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
@import '~@/styles/custom.scss';
@import '~@/styles/dropdowns.scss';
@import '~@/styles/shortcuts.scss';
@import '~@/styles/atom-one-dark.scss';
@import '~@/styles/vue-skeletor.scss';

#app {
  width: 100%;
  @include flex-container;
}
</style>

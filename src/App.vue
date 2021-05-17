<template>
  <template v-if="isAppReady">
    <header class="fx-row fx-row_gap-8">
      <img class="logo" src="~@/assets/odin-logo.png" alt="Logo" width="120" />
      <Nav></Nav>
      <template v-if="isLoggedIn">
        <UserWidget class="fx-sae"></UserWidget>
      </template>
    </header>
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
import UserWidget from '@/components/UserWidget.vue'

export default defineComponent({
  components: { Nav, UserWidget },
  setup() {
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

    return {
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
@import '~@/styles/shortcuts.scss';
@import '~@/styles/load-fog.scss';
@import '~@/styles/forms.scss';
@import '~@/styles/vue-notification.scss';

#app {
  width: 100%;
  max-width: 144rem;
  padding: 0 4rem;
  margin: 0 auto;
  @include flex-container;
}
</style>

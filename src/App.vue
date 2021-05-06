<template>
  <template v-if="isAppReady">
    <Nav></Nav>
    <router-view />
  </template>
  <div class="dialogs-container" ref="dialogsContainerRef"></div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { initDialogs } from '@/helpers/dialogs'
import Nav from './components/Nav.vue'

export default defineComponent({
  components: { Nav },
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
        initDialogs(dialogsContainerRef.value)
        _readyStates.value.dialogs = true
      }
    })

    return { isAppReady, dialogsContainerRef }
  },
})
</script>

<style lang="scss">
@import '~@/styles/reset.scss';
@import '~@/styles/root.scss';
@import '~@/styles/buttons.scss';
@import '~@/styles/tables.scss';
@import '~@/styles/shortcuts.scss';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--clr__text);
  max-width: 550px;
  margin: 0 auto;
  @include flex-container;
}
</style>

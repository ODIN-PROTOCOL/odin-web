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
import { useAuthorization } from '@/composables/useAuthorization'
import router from '@/router'
import Nav from './components/Nav.vue'

export default defineComponent({
  components: { Nav },
  setup() {
    const _readyStates = ref({
      dialogs: false,
      session: false,
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

    // Session
    const { tryRestoreSession, isLoggedIn } = useAuthorization()
    tryRestoreSession().then((wallet) => {
      _readyStates.value.session = true
      if (wallet) {
        router.push({ name: 'Home' })
      }
    })

    return { isAppReady, dialogsContainerRef, isLoggedIn }
  },
})
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  max-width: 550px;
  margin: auto;
}
</style>

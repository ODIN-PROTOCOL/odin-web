<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div>
  <router-view />
  <div class="dialogs-container" ref="dialogsContainerRef"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { initDialogs } from '@/helpers/dialog-helpers'

export default defineComponent({
  setup() {
    const dialogsContainerRef = ref<HTMLElement>()

    onMounted(() => {
      if (dialogsContainerRef.value instanceof HTMLElement) {
        initDialogs(dialogsContainerRef.value)
      }
    })

    return { dialogsContainerRef }
  },
})
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

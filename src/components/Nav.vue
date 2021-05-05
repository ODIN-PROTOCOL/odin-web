<template>
  <div class="nav">
    <router-link :to="{ name: 'Home' }">Home</router-link> |
    <router-link :to="{ name: 'About' }">About</router-link> |
    <router-link :to="{ name: 'OracleScripts' }">Oracle Scripts</router-link>
    <template v-if="isLoggedIn">
      | <button type="button" @click="logOutAndLeave()">LogOut</button>
    </template>
  </div>
</template>

<script lang="ts">
import { useAuthorization } from '@/composables/useAuthorization'
import router from '@/router'
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const { isLoggedIn, logOut } = useAuthorization()

    const logOutAndLeave = () => {
      logOut()
      router.push({ name: 'Auth' })
    }

    return { isLoggedIn, logOutAndLeave }
  },
})
</script>

<style scoped lang="scss">
.nav {
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

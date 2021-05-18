<template>
  <div class="nav">
    <router-link :to="{ name: 'DataSources' }">Data Sources</router-link> |
    <router-link :to="{ name: 'OracleScripts' }">Oracle Scripts</router-link> |
    <router-link :to="{ name: 'Requests' }">Requests</router-link> |
    <router-link :to="{ name: 'Voting' }">Voting</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
</script>

<style scoped lang="scss">
.nav {
  padding: 3rem;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

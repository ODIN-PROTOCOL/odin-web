<template>
  <div class="nav">
    <div class="nav__wrap-cont">
      <!-- TODO: temp. hidden all but validators -->
      <!-- <router-link class="nav__link" :to="{ name: 'DataSources' }">
        Data Sources
      </router-link>
      <router-link class="nav__link" :to="{ name: 'OracleScripts' }">
        Oracle Scripts
      </router-link>
      <router-link class="nav__link" :to="{ name: 'Requests' }">
        Requests
      </router-link>
      <router-link class="nav__link" :to="{ name: 'Voting' }">
        Voting
      </router-link> -->
      <router-link class="nav__link" :to="{ name: 'Validators' }">
        Validators
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
</script>

<style scoped lang="scss">
.nav__wrap-cont {
  display: flex;
  flex-wrap: wrap;
  margin-block-start: -1.2rem;
  margin-inline-start: -1.2rem;
  width: calc(100% + 1.2rem);
}

.nav__link {
  display: inline-block;
  white-space: nowrap;
  color: inherit;
  text-decoration: none;
  margin-block-start: 1.2rem;
  margin-inline-start: 1.2rem;

  &.router-link-exact-active {
    font-weight: bold;
    border-bottom: 2px solid var(--clr__action);
  }
}
</style>

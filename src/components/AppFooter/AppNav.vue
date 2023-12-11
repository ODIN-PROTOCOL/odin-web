<template>
  <div class="app-nav">
    <a target="_blank" :href="links.odin_protocol"> ODIN Protocol </a>
    <a target="_blank" :href="links.docs"> Documentation </a>
  </div>
</template>

<script setup lang="ts">
import { links } from '@/const'
</script>

<style scoped>
.app-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  width: 100%;
}

.app-nav a {
  color: var(--clr__main-text);
  text-decoration: none;
  font-size: 1.5rem;
  white-space: nowrap;
}
</style>

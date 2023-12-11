<template>
  <footer class="app-footer">
    <div class="app-footer__content">
      <!-- <div class="app-header__content-logo">
        <router-link :to="{ name: $routes.app }">
          <app-logo-icon />
        </router-link>
      </div> -->
      <app-nav />
      <app-icon />
    </div>
  </footer>
</template>

<script setup lang="ts">
import AppNav from '@/components/AppFooter/AppNav.vue'
import AppIcon from '@/components/AppFooter/AppIcon.vue'
</script>

<style scoped lang="scss">
.app-footer {
  background-color: var(--clr__header-bg);
}

.app-footer__content {
  width: 100%;
  max-width: 140rem;
  margin: 0 auto;
  padding: 3.2rem;
  gap: 8rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@include respond-to(tablet) {
  .app-footer__content {
    flex-wrap: wrap;
    gap: 4rem;
  }
}
</style>

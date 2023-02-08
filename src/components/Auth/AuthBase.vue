<template>
  <div class="auth-base">
    <div class="auth-base__splash">
      <img
        class="auth-base__splash-logo"
        src="~@/assets/brand/odin-logo-white.png"
        alt="ODIN logo"
      />
    </div>

    <div class="auth-base__content">
      <form class="auth-base__form" @submit.prevent="emitSubmit">
        <app-logo-icon class="auth-base__form-logo" />
        <h2 class="auth-base__content-title">Sign in</h2>
        <slot name="content"></slot>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AppLogoIcon } from '@/components/icons'

enum EVENTS {
  submit = 'submit',
}

const emit = defineEmits<{
  (e: EVENTS.submit): void
}>()

const emitSubmit = () => emit(EVENTS.submit)
</script>

<style lang="scss" scoped>
.auth-base {
  height: 100vh;
  display: grid;
  grid: 100% / 1fr 0.85fr;
  flex: 1;
}

.auth-base__splash {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--clr__secondary);
}

.auth-base__splash-logo {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  width: 100%;
  min-width: 22rem;
  max-width: 25vw;
  max-height: 25rem;
}

.auth-base__content {
  padding: 3.2rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
  position: relative;
  background-color: var(--clr__main-bg);
}

.auth-base__content-title {
  margin-bottom: 2rem;
  text-align: center;
  font-size: 4rem;
  font-weight: 400;
}

.auth-base__form {
  width: 100%;
  max-width: 39.2rem;
  margin: 0 auto;
}

.auth-base__form-logo {
  display: none;
  max-width: 12rem;
  position: absolute;
  top: 4rem;
}

@include respond-to(tablet) {
  .auth-base {
    grid: 100% / 1fr;
  }
  .auth-base__splash {
    display: none;
  }

  .auth-base__form {
    margin: 0 auto;
  }

  .auth-base__form-logo {
    display: block;
    margin: 0 auto;
  }
}
</style>

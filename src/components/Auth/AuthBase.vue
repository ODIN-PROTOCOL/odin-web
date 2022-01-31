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
        <img
          class="auth-base__form-logo"
          src="~@/assets/brand/odin-logo-black.png"
          alt="ODIN logo"
        />
        <h2 class="auth-base__content-title">Sign in</h2>

        <slot name="content"></slot>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['submit'],
  setup(_, { emit }) {
    return { emitSubmit: () => emit('submit') }
  },
})
</script>

<style lang="scss" scoped>
.auth-base {
  display: grid;
  grid: 100% / 1fr 0.85fr;
  flex: 1;

  &__splash {
    background: url('~@/assets/images/auth_background.png') no-repeat
      center#031e3a;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__splash-logo {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    width: 100%;
    min-width: 22rem;
    max-width: 25vw;
    max-height: 25rem;
  }

  &__content {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex: 1;
    padding: 3.2rem;
    position: relative;
  }

  &__content-title {
    font-size: 4rem;
    font-weight: 400;
    margin-bottom: 4.8rem;
  }

  &__form {
    width: 100%;
    max-width: 30rem;
    margin-inline-start: 8vw;
  }

  &__form-logo {
    display: none;
    max-width: 12rem;
    position: absolute;
    top: 4rem;
  }
}

@include respond-to(tablet) {
  .auth-base {
    grid: 100% / 1fr;

    &__splash {
      display: none;
    }

    &__form {
      margin: 0 auto;
    }

    &__form-logo {
      display: block;
      margin: 0 auto;
    }
  }
}
</style>

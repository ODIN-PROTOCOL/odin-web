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

<script setup lang="ts">
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
  display: grid;
  grid: 100% / 1fr 0.85fr;
  flex: 1;
}
.auth-base__splash {
  background: url('~@/assets/images/auth_background.png') no-repeat center
    var(--clr__auth-base-bg);
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
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
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex: 1;
  padding: 3.2rem;
  position: relative;
}

.auth-base__content-title {
  font-size: 4rem;
  font-weight: 400;
  margin-bottom: 5.6rem;
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

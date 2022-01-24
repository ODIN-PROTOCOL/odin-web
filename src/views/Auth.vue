<template>
  <div class="auth">
    <div class="auth__splash">
      <img
        class="auth__splash-logo"
        src="~@/assets/brand/odin-logo-white.png"
        alt="ODIN Logo"
      />
    </div>

    <div class="auth__content fx-start">
      <form class="auth__form" @submit.prevent="submit()">
        <img
          class="auth__form-logo"
          src="~@/assets/brand/odin-logo-black.png"
          alt="ODIN Logo"
        />

        <h2 class="auth__content-title fs-40 mg-b48">Sign in</h2>

        <div class="app-form__field auth__field">
          <button class="app-btn w-full" type="submit" :disabled="isLoading">
            Connect with Keplr
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import router from '@/router'
import { CHAIN_CONFIG } from '@/api/api-config'
import { defineComponent, ref } from 'vue'
import { useAuthorization } from '@/composables/useAuthorization'
import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import InfoModal from '@/components/modals/InfoModal.vue'

export default defineComponent({
  setup() {
    const isLoading = ref(false)

    const submit = async () => {
      const auth = useAuthorization()
      isLoading.value = true
      try {
        await auth.logInWithKeplrWallet(CHAIN_CONFIG.chainId)
        await router.push({ name: 'Redirector' })
      } catch (error) {
        showInfo('Ooops!', (error as Error).message)
      }
      isLoading.value = false
    }

    const showInfo = async (title: string, text: string) => {
      await showDialogHandler(InfoModal, {}, { title, text })
    }

    return {
      isLoading,
      submit,
    }
  },
})
</script>

<style scoped lang="scss">
.auth {
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
    padding: 3.2rem;
    position: relative;
  }

  &__content-title {
    font-weight: 400;
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
  .auth {
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

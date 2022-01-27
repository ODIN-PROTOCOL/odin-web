<template>
  <div class="hidden-auth">
    <div class="hidden-auth__splash">
      <img
        class="hidden-auth__splash-logo"
        src="~@/assets/brand/odin-logo-white.png"
        alt="ODIN Logo"
      />
    </div>

    <div class="hidden-auth__content fx-start">
      <form class="hidden-auth__form" @submit.prevent="submit()">
        <img
          class="hidden-auth__form-logo"
          src="~@/assets/brand/odin-logo-black.png"
          alt="ODIN Logo"
        />

        <h2 class="hidden-auth__content-title fs-40 mg-b48">Sign in</h2>

        <div class="app-form__field">
          <label class="app-form__field-lbl"> Mnemonic </label>
          <input
            class="app-form__field-input"
            name="request-min-count"
            type="text"
            v-model="form.mnemonic"
            :disabled="isLoading"
          />
          <p class="hidden-auth__copy-warning" v-if="copyWarning">
            <span class="hidden-auth__copy-important">Important! </span>
            Copy this code, you cannot recover it!
          </p>
          <p v-if="form.mnemonicErr" class="app-form__field-err">
            {{ form.mnemonicErr }}
          </p>
          <button
            class="app-btn w-full mg-t32"
            type="submit"
            :disabled="!form.isValid || isLoading"
          >
            Log in
          </button>
          <button
            class="app-btn w-full mg-t32"
            type="submit"
            @click.prevent="generateKey"
          >
            Generate mnemonic key
          </button>
          <div class="hidden-auth__field-additional">
            <router-link
              class="hidden-auth__field-additional-btn"
              :to="{ name: 'Auth' }"
            >
              Use keplr login
            </router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useForm, validators } from '@/composables/useForm'
import { useAuthorization } from '@/composables/useAuthorization'
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'
import router from '@/router'
import { handleError } from '@/helpers/errors'
import { API_CONFIG } from '@/api/api-config'

const MNEMONIC_SIZE = 24

export default defineComponent({
  setup() {
    const form = useForm({
      mnemonic: ['', validators.required],
    })
    const isLoading = ref(false)
    const copyWarning = ref(false)

    const submit = async () => {
      const auth = useAuthorization()
      isLoading.value = true
      try {
        await auth.logInWithOdinWallet(form.mnemonic.val())
        await router.push({ name: 'Redirector' })
      } catch (error) {
        handleError(error as Error)
      }
      isLoading.value = false
    }

    const generateKey = async () => {
      const newWallet = await DirectSecp256k1HdWallet.generate(MNEMONIC_SIZE, {
        hdPaths: [API_CONFIG.hdDeviation],
        prefix: 'odin',
      })
      form.mnemonic.val(newWallet.mnemonic)
      copyWarning.value = true
    }

    return {
      form: form.flatten(),
      isLoading,
      submit,
      generateKey,
      copyWarning,
    }
  },
})
</script>

<style lang="scss" scoped>
.hidden-auth {
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

  &__field-additional {
    display: flex;
    justify-content: center;
    margin-top: 3.2rem;
  }

  &__field-additional-btn {
    text-decoration: none;
    font-weight: 600;
    color: var(--clr__action);

    &:hover {
      color: var(--clr__text);
    }
  }

  &__copy-warning {
    padding: 3.2rem 0;
  }

  &__copy-important {
    font-weight: 700;
  }
}

@include respond-to(tablet) {
  .hidden-auth {
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

<template>
  <div class="auth">
    <div class="auth__splash fx-end only-sm-above">
      <img
        class="auth__splash-logo"
        src="~@/assets/odin-logo-white.png"
        alt="ODIN Logo"
      />
    </div>

    <div class="auth__content fx-start">
      <form class="auth__form app-form" @submit.prevent="submit()">
        <img
          class="only-sm auth__form-logo"
          src="~@/assets/odin-logo-black.png"
          alt="ODIN Logo"
        />

        <h2 class="auth__content-title fs-40 mg-b48">Log in</h2>

        <div class="app-form__field">
          <label class="app-form__field-lbl"> Mnemonic </label>
          <input
            class="app-form__field-input"
            name="request-min-count"
            type="text"
            v-model="form.mnemonic"
            :disabled="isLoading"
          />
          <p v-if="form.mnemonicErr" class="app-form__field-err">
            {{ form.mnemonicErr }}
          </p>
        </div>

        <div class="app-form__footer mg-t32">
          <button
            class="app-btn w-full"
            type="submit"
            :disabled="!form.isValid || isLoading"
          >
            Log in
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import router from '@/router'
import { API_CONFIG } from '@/api/api-config'
import { defineComponent, ref } from 'vue'
import { useAuthorization } from '@/composables/useAuthorization'
import { handleError } from '@/helpers/errors'
import { useForm, validators } from '@/composables/useForm'

export default defineComponent({
  setup() {
    const form = useForm({
      mnemonic: ['', validators.required],
    })
    const isLoading = ref(false)

    const submit = async () => {
      const auth = useAuthorization()
      isLoading.value = true
      try {
        await auth.logIn(form.mnemonic.val())
        router.push({ name: 'Redirector' })
      } catch (error) {
        handleError(error)
      }
      isLoading.value = false
    }

    // TODO: remove fakeForm
    const _fakeForm = () => {
      form.mnemonic.val(API_CONFIG.mnemonic)
    }
    _fakeForm()

    return {
      form: form.flatten(),
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

  @include respond-to(sm) {
    grid: 100% / 1fr;
  }
}

.auth__splash {
  padding: 3.2rem;
  background: var(--clr__splash-bg);
}

.auth__splash-logo {
  width: 100%;
  min-width: 22rem;
  max-width: 25vw;
  margin-right: 8vw;
}

.auth__content {
  padding: 3.2rem;
  position: relative;
}

.auth__form {
  width: 100%;
  max-width: 30rem;
  margin-left: 8vw;

  @include respond-to(sm) {
    margin: auto;
  }
}

.auth__form-logo {
  max-width: 12rem;
  position: absolute;
  top: 4rem;
  left: 50%;
  transform: translateX(-50%);
}
</style>

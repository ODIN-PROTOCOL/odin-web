<template>
  <div class="auth">
    <h3>Auth</h3>

    <form class="auth__form" @submit.prevent="submit()">
      <div class="auth__form-field">
        <label class="auth__form-field-lbl"> Mnemonic </label>
        <input class="auth__form-field-input" type="text" v-model="mnemonic" />
      </div>

      <button class="auth__form-submit-btn app-btn" type="submit">
        Log in
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import router from '@/router'
import { API_CONFIG } from '@/api/api-config'
import { defineComponent, ref } from 'vue'
import { useAuthorization } from '@/composables/useAuthorization'
import { handleError } from '@/helpers/errors'

export default defineComponent({
  setup() {
    // TODO: remove default mnemonic
    const mnemonic = ref<string>(API_CONFIG.mnemonic)

    const submit = async () => {
      const auth = useAuthorization()
      try {
        await auth.logIn(mnemonic.value)
        router.push({ name: 'Redirector' })
      } catch (error) {
        handleError(error)
      }
    }

    return {
      mnemonic,
      submit,
    }
  },
})
</script>

<style scoped>
.auth__form-field {
  display: grid;
  grid: auto-flow auto / auto;
  gap: 0.8rem;
}

.auth__form-submit-btn {
  margin-top: 16px;
}
</style>

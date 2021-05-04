<template>
  <div class="auth">
    <h3>Auth</h3>

    <form class="auth__form" @submit.prevent="submit()">
      <label class="auth__form-field">
        <span class="auth__form-field-lbl"> Mnemonic </span>
        <input class="auth__form-field-input" type="text" v-model="mnemonic" />
      </label>

      <button class="auth__form-submit-btn" type="submit">Submit</button>
    </form>
  </div>
</template>

<script lang="ts">
import router from '@/router'
import { API_CONFIG } from '@/api/api-config'
import { defineComponent, ref } from 'vue'
import { useAuthorization } from '@/composables/useAuthorization'

export default defineComponent({
  setup() {
    // TODO: remove default mnemonic
    const mnemonic = ref<string>(API_CONFIG.mnemonic)

    const submit = async () => {
      const { logIn } = useAuthorization()
      const wallet = await logIn(mnemonic.value)
      if (!wallet) return

      router.push({ name: 'Home' })
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
  gap: 8px;
}

.auth__form-submit-btn {
  margin-top: 16px;
}
</style>

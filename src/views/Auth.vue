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

        <div class="app-form__field">
          <label class="app-form__field-lbl"> Mnemonic </label>
          <input
            class="app-form__field-input"
            name="request-min-count"
            type="text"
            v-model="form.mnemonic"
            :disabled="isLoading"
          />
          <p class="auth__copy-warning" v-if="copyWarning">
            <span class="auth__copy-important">Important! </span>
            Copy this code, you cannot recover it!
          </p>
          <p v-if="form.mnemonicErr" class="app-form__field-err">
            {{ form.mnemonicErr }}
          </p>
          <button
            class="app-btn w-full mg-t32"
            type="submit"
            :disabled="!form.isValid || isLoading"
            @click="changeLoginMethod(WalletTypes.ODIN_WALLET)"
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
          <button
            class="app-btn w-full mg-t64"
            type="submit"
            :disabled="isLoading"
            @click="changeLoginMethod(WalletTypes.KEPLR_WALLET)"
          >
            Connect with Keplr
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import router from '@/router'
import { API_CONFIG, CHAIN_CONFIG } from '@/api/api-config'
import { defineComponent, ref } from 'vue'
import { useAuthorization } from '@/composables/useAuthorization'
import { WalletTypes } from '@/api/wallet'
import { handleError } from '@/helpers/errors'
import { useForm, validators } from '@/composables/useForm'
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'

const MNEMONIC_SIZE = 24

export default defineComponent({
  setup() {
    const form = useForm({
      mnemonic: ['', validators.required],
    })
    const isLoading = ref(false)
    const copyWarning = ref(false)
    const loginType = ref()

    const submit = async () => {
      const auth = useAuthorization()
      isLoading.value = true
      try {
        if (loginType.value === WalletTypes.ODIN_WALLET) {
          await auth.logIn({
            walletType: WalletTypes.ODIN_WALLET,
            key: form.mnemonic.val(),
          })
        } else if (loginType.value === WalletTypes.KEPLR_WALLET) {
          await auth.logIn({
            walletType: WalletTypes.KEPLR_WALLET,
            key: CHAIN_CONFIG.chainId,
          })
        }
        await router.push({ name: 'Redirector' })
      } catch (error) {
        handleError(error as Error)
      }
      isLoading.value = false
    }

    const changeLoginMethod = (type: WalletTypes) => {
      loginType.value = type
    }

    const generateKey = async () => {
      const newWallet = await DirectSecp256k1HdWallet.generate(MNEMONIC_SIZE, {
        hdPaths: [API_CONFIG.hdDeviation],
        prefix: 'odin',
      })
      // const newAccount = await newWallet.getAccounts()
      form.mnemonic.val(newWallet.mnemonic)
      copyWarning.value = true
    }

    return {
      form: form.flatten(),
      isLoading,
      WalletTypes,
      submit,
      changeLoginMethod,
      generateKey,
      copyWarning,
    }
  },
})
</script>

<style scoped lang="scss">
.auth {
  display: grid;
  grid: 100% / 1fr 0.85fr;
  flex: 1;

  @media (max-width: 768px) {
    grid: 100% / 1fr;
  }
}

.auth__splash {
  background: url('~@/assets/images/auth_background.png') no-repeat center
    #031e3a;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
}

.auth__splash-logo {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  width: 100%;
  min-width: 22rem;
  max-width: 25vw;
  max-height: 25rem;
}

.auth {
  &__content {
    padding: 3.2rem;
    position: relative;
  }

  &__content-title {
    font-weight: 400;
  }
}

.auth__form {
  width: 100%;
  max-width: 30rem;
  margin-inline-start: 8vw;

  @media (max-width: 768px) {
    margin: 0 auto;
  }
}

.auth__form-logo {
  display: none;
  max-width: 12rem;
  position: absolute;
  top: 4rem;

  @media (max-width: 768px) {
    display: block;
    margin: 0 auto;
  }
}

.auth {
  &__copy-warning {
    padding: 3.2rem 0;
  }

  &__copy-important {
    font-weight: 700;
  }
}
</style>

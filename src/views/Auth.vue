<template>
  <AuthBase @submit="submit" class="auth">
    <template v-if="loginType === LOGIN_TYPE.KEPLR118" #content>
      <div class="app-form__field auth__field">
        <button class="app-btn w-full" type="submit" :disabled="isLoading">
          Connect with Keplr
        </button>
      </div>
    </template>

    <template v-else-if="loginType === LOGIN_TYPE.KEPLR494" #content>
      <div class="app-form__field auth__field">
        <label class="app-form__field-lbl auth__field-lbl auth__field-lbl_bold">
          Coin type 494
        </label>
        <button class="app-btn w-full" type="submit" :disabled="isLoading">
          Connect with Keplr
        </button>
        <div class="auth__field-additional">
          <router-link
            class="auth__field-additional-btn"
            :to="{ name: 'Auth' }"
          >
            Use keplr login with coin type 118
          </router-link>
        </div>
      </div>
    </template>

    <template v-else-if="loginType === LOGIN_TYPE.MNEMONIC494" #content>
      <div class="app-form__field auth__field">
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
        <div class="auth__field-additional">
          <router-link
            class="auth__field-additional-btn"
            :to="{ name: 'Auth' }"
          >
            Use keplr login
          </router-link>
        </div>
      </div>
    </template>

    <template v-else #content>
      <div class="app-form__field auth__field">
        <span>Unrecognized login type</span>
      </div>
    </template>
  </AuthBase>
</template>

<script lang="ts">
import router from '@/router'
import {
  API_CONFIG,
  CHAIN_CONFIG,
  COINS_TYPE,
  LOGIN_TYPE,
} from '@/api/api-config'
import { defineComponent, PropType, ref } from 'vue'
import { useAuthorization } from '@/composables/useAuthorization'
import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import InfoModal from '@/components/modals/InfoModal.vue'
import AuthBase from '@/components/Auth/AuthBase.vue'
import { handleError } from '@/helpers/errors'
import { useForm, validators } from '@/composables/useForm'
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'

const MNEMONIC_SIZE = 24

export default defineComponent({
  components: { AuthBase },
  props: {
    loginType: { type: Number as PropType<LOGIN_TYPE>, required: true },
  },
  setup(props) {
    const isLoading = ref(false)
    const form = useForm({
      mnemonic: ['', validators.required],
    })
    const copyWarning = ref(false)
    const auth = useAuthorization()

    const submit = async () => {
      isLoading.value = true
      try {
        if (props.loginType === LOGIN_TYPE.KEPLR118) {
          await auth.logInWithKeplrWallet(CHAIN_CONFIG.chainId, COINS_TYPE.MAIN)
        } else if (props.loginType === LOGIN_TYPE.KEPLR494) {
          await auth.logInWithKeplrWallet(
            CHAIN_CONFIG.chainId,
            COINS_TYPE.ADDITIONAL
          )
        } else if (props.loginType === LOGIN_TYPE.MNEMONIC494) {
          await auth.logInWithOdinWallet(form.mnemonic.val())
        }

        await router.push({ name: 'Redirector' })
      } catch (error) {
        if (props.loginType === LOGIN_TYPE.MNEMONIC494) {
          handleError(error as Error)
        } else {
          showInfo('Ooops!', (error as Error).message)
        }
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

    const showInfo = async (title: string, text: string) => {
      await showDialogHandler(InfoModal, {}, { title, text })
    }

    return {
      LOGIN_TYPE,
      isLoading,
      submit,
      form: form.flatten(),
      generateKey,
      copyWarning,
    }
  },
})
</script>

<style scoped lang="scss">
.auth {
  &__field-lbl {
    &_bold {
      font-weight: 600;
    }
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
</style>

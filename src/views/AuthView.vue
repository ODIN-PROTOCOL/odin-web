<template>
  <AuthBase @submit="submit" class="auth-view">
    <template v-if="loginType === LOGIN_TYPE.KEPLR118" #content>
      <div class="app-form__field auth__field">
        <button class="app-btn w-full" type="submit" :disabled="isLoading">
          Connect with Keplr
        </button>
      </div>
    </template>

    <template v-else-if="loginType === LOGIN_TYPE.KEPLR494" #content>
      <div class="app-form__field auth-view__field">
        <label
          class="app-form__field-lbl auth-view__field-lbl auth-view__field-lbl--bold"
        >
          Coin type 494
        </label>
        <button class="app-btn w-full" type="submit" :disabled="isLoading">
          Connect with Keplr
        </button>
        <div class="auth-view__field-additional">
          <router-link
            class="auth-view__field-additional-btn"
            :to="{ name: $routes.auth }"
          >
            Use keplr login with coin type 118
          </router-link>
        </div>
      </div>
    </template>

    <template v-else-if="loginType === LOGIN_TYPE.COSMOSTATION494" #content>
      <div class="app-form__field auth-view__field">
        <label
          class="app-form__field-lbl auth-view__field-lbl auth-view__field-lbl--bold"
        >
          Coin type 494
        </label>
        <button class="app-btn w-full" type="submit" :disabled="isLoading">
          Connect with Cosmostation
        </button>
        <div class="auth-view__field-additional">
          <router-link
            class="auth-view__field-additional-btn"
            :to="{ name: $routes.auth }"
          >
            Use keplr login with coin type 118
          </router-link>
        </div>
      </div>
    </template>

    <template v-else-if="loginType === LOGIN_TYPE.MNEMONIC494" #content>
      <div class="app-form__field auth-view__field">
        <label class="app-form__field-lbl"> Mnemonic </label>
        <input
          class="app-form__field-input"
          name="request-min-count"
          type="text"
          v-model="flattenForm.mnemonic"
          :disabled="isLoading"
          @keydown.enter="submit()"
        />
        <p class="auth-view__copy-warning" v-if="copyWarning">
          <span class="auth-view__copy-important">Important! </span>
          Copy this code, you cannot recover it!
        </p>
        <p v-if="flattenForm.mnemonicErr" class="app-form__field-err">
          {{ flattenForm.mnemonicErr }}
        </p>
        <button
          class="app-btn w-full mg-t16"
          type="submit"
          :disabled="!flattenForm.isValid || isLoading"
        >
          Log in
        </button>
        <button
          class="app-btn w-full mg-t12"
          type="submit"
          @click.prevent="generateKey"
        >
          Generate mnemonic key
        </button>
        <div class="auth-view__field-additional">
          <router-link
            class="auth-view__field-additional-btn"
            :to="{ name: $routes.auth }"
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

<script setup lang="ts">
import { ref } from 'vue'
import {
  API_CONFIG,
  CHAIN_CONFIG,
  COINS_TYPE,
  LOGIN_TYPE,
} from '@/api/api-config'
import { useAuthorization } from '@/composables/useAuthorization'
import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import { InfoModal } from '@/components/modals'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { useForm, validators } from '@/composables/useForm'
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { ROUTE_NAMES } from '@/enums'
import router from '@/router'
import AuthBase from '@/components/Auth/AuthBase.vue'

const MNEMONIC_SIZE = 24
const props = defineProps<{
  loginType: LOGIN_TYPE
}>()

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const { logInWithKeplrWallet, logInWithOdinWallet, logInWithCosmostation } =
  useAuthorization()
const form = useForm({
  mnemonic: ['', validators.required],
})
const flattenForm = form.flatten()
const copyWarning = ref(false)

const submit = async () => {
  // prevent double submit
  if (isLoading.value === true) return
  lockLoading()
  try {
    if (props.loginType === LOGIN_TYPE.KEPLR118) {
      await logInWithKeplrWallet(CHAIN_CONFIG.chainId, COINS_TYPE.MAIN)
    } else if (props.loginType === LOGIN_TYPE.KEPLR494) {
      await logInWithKeplrWallet(CHAIN_CONFIG.chainId, COINS_TYPE.ADDITIONAL)
    } else if (props.loginType === LOGIN_TYPE.COSMOSTATION494) {
      await logInWithCosmostation(CHAIN_CONFIG.chainId, COINS_TYPE.ADDITIONAL)
    } else if (props.loginType === LOGIN_TYPE.MNEMONIC494) {
      await logInWithOdinWallet(form.mnemonic.val())
    }

    await router.push({ name: ROUTE_NAMES.wallet })
  } catch (error) {
    if (props.loginType === LOGIN_TYPE.MNEMONIC494) {
      handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
    } else {
      showInfo('Ooops!', (error as Error).message)
    }
  }
  releaseLoading()
}

const generateKey = async () => {
  lockLoading()
  try {
    const newWallet = await DirectSecp256k1HdWallet.generate(MNEMONIC_SIZE, {
      hdPaths: [API_CONFIG.hdDeviation],
      prefix: 'odin',
    })
    form.mnemonic.val(newWallet.mnemonic)
    copyWarning.value = true
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

const showInfo = async (title: string, text: string) => {
  await showDialogHandler(InfoModal, {}, { title, text })
}
</script>

<style lang="scss" scoped>
.auth-view__field-lbl--bold {
  font-weight: 600;
}

.auth-view__field-additional {
  display: flex;
  justify-content: center;
  margin-top: 1.2rem;
}

.auth-view__field-additional-btn {
  text-decoration: none;
  font-weight: 600;
  color: var(--clr__action);

  &:hover {
    color: var(--clr__text);
  }
}

.auth-view__copy-warning {
  padding: 3.2rem 0;
}

.auth-view__copy-important {
  font-weight: 700;
}
</style>

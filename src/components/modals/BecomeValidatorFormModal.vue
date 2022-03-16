<template>
  <ModalBase class="become-validator-form-modal" @close="onClose()">
    <template #title>
      <h3 class="app-form__title">Become a validator</h3>
    </template>

    <template #main>
      <form
        class="app-form load-fog"
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent
      >
        <div class="app-form__main">
          <div class="app-form__field">
            <label class="app-form__field-lbl"> Validator </label>
            <input
              class="app-form__field-input"
              name="become-validator-moniker"
              type="text"
              placeholder="validator-x"
              v-model="form.moniker"
              :disabled="isLoading"
            />
            <p v-if="form.monikerErr" class="app-form__field-err">
              {{ form.monikerErr }}
            </p>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl"> Public key (base64) </label>
            <input
              class="app-form__field-input"
              name="become-validator-pubkey"
              type="text"
              placeholder="odinvalconspub1zcj…"
              v-model="form.pubKey"
              :disabled="isLoading"
            />
            <p v-if="form.pubKeyErr" class="app-form__field-err">
              {{ form.pubKeyErr }}
            </p>
          </div>

          <div class="app-form__field-composed">
            <div class="app-form__field">
              <label class="app-form__field-lbl"> Rate (%) </label>
              <input
                class="app-form__field-input"
                name="become-validator-rate"
                type="number"
                min="0"
                step="0.1"
                placeholder="0.1"
                v-model="form.rate"
                :disabled="isLoading"
              />
              <p v-if="form.rateErr" class="app-form__field-err">
                {{ form.rateErr }}
              </p>
            </div>

            <div class="app-form__field mg-l16">
              <label class="app-form__field-lbl"> Max rate (%) </label>
              <input
                class="app-form__field-input"
                name="become-validator-rate"
                type="number"
                min="0"
                step="0.1"
                placeholder="0.2"
                v-model="form.maxRate"
                :disabled="isLoading"
              />
              <p v-if="form.maxRateErr" class="app-form__field-err">
                {{ form.maxRateErr }}
              </p>
            </div>

            <div class="app-form__field mg-l16">
              <label class="app-form__field-lbl">
                Max change (%)
              </label>
              <input
                class="app-form__field-input"
                name="become-validator-rate"
                type="number"
                min="0"
                step="0.1"
                placeholder="0.1"
                v-model="form.maxChangeRate"
                :disabled="isLoading"
              />
              <p v-if="form.maxChangeRateErr" class="app-form__field-err">
                {{ form.maxChangeRateErr }}
              </p>
            </div>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl"> Min delegation </label>
            <div class="app-form__field-input-wrapper">
              <span>ODIN</span>
              <input
                class="app-form__field-input"
                name="become-validator-min-delegation"
                type="text"
                placeholder="0.000001"
                v-model="form.minDelegation"
                :disabled="isLoading"
              />
            </div>
            <p v-if="form.minDelegationErr" class="app-form__field-err">
              {{ form.minDelegationErr }}
            </p>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl"> Self delegation </label>
            <div class="app-form__field-input-wrapper">
              <span>ODIN</span>
              <input
                class="app-form__field-input"
                name="become-validator-self-delegation"
                type="text"
                placeholder="1"
                v-model="form.selfDelegation"
                :disabled="isLoading"
              />
            </div>
            <p v-if="form.selfDelegationErr" class="app-form__field-err">
              {{ form.selfDelegationErr }}
            </p>
          </div>
        </div>

        <div class="app-form__footer">
          <button
            class="app-btn"
            type="button"
            @click="submit()"
            :disabled="!form.isValid || isLoading"
          >
            Submit
          </button>
        </div>
      </form>
    </template>
  </ModalBase>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { loremIpsum } from 'lorem-ipsum'
import { wallet } from '@/api/wallet'
import { callers } from '@/api/callers'
import { COINS_LIST } from '@/api/api-config'
import { dialogs } from '@/helpers/dialogs'
import { handleError } from '@/helpers/errors'
import { preventIf } from '@/helpers/functions'
import { convertOdinToLoki } from '@/helpers/converters'
import { notifySuccess } from '@/helpers/notifications'
import { useForm, validators } from '@/composables/useForm'
import ModalBase from './ModalBase.vue'
import { Bech32, fromBase64 } from '@cosmjs/encoding'
import { big } from '@/helpers/bigMath'
import { PubKey } from '@cosmjs/stargate/build/codec/cosmos/crypto/secp256k1/keys'
import { coin } from '@cosmjs/amino'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Buffer } from 'buffer'

const BecomeValidatorFormModal = defineComponent({
  components: { ModalBase },
  setup() {
    const form = useForm({
      moniker: [
        '',
        validators.required,
        validators.withOutSpaceAtStart,
        validators.maxCharacters(128),
      ],
      pubKey: [
        '',
        validators.required,
        validators.erc20Address,
        validators.withOutSpaceAtStart,
        validators.maxCharacters(128),
      ],
      rate: [
        '',
        validators.required,
        ...validators.num(0),
        validators.maxCharacters(14),
      ],
      maxRate: [
        '',
        validators.required,
        ...validators.num(0),
        validators.maxCharacters(14),
      ],
      maxChangeRate: [
        '',
        validators.required,
        ...validators.num(0),
        validators.maxCharacters(14),
      ],
      minDelegation: [
        '',
        validators.required,
        validators.number,
        validators.sixDecimalNumber,
        ...validators.num(0.000001),
        validators.maxCharacters(32),
      ],
      selfDelegation: [
        '',
        validators.required,
        validators.number,
        validators.sixDecimalNumber,
        ...validators.num(0.000001),
        validators.maxCharacters(32),
      ],
    })
    const isLoading = ref(false)
    const onSubmit = dialogs.getHandler('onSubmit')

    const submit = async () => {
      isLoading.value = true
      try {
        await callers.createValidator({
          description: {
            identity: '',
            website: '',
            moniker: form.moniker.val(),
            securityContact: '',
            details: '',
          },
          commission: {
            rate: big.toPrecise(form.rate.val()).toString(),
            maxRate: big.toPrecise(form.maxRate.val()).toString(),
            maxChangeRate: big.toPrecise(form.maxChangeRate.val()).toString(),
          },
          minSelfDelegation: convertOdinToLoki(
            form.minDelegation.val()
          ).toString(),
          delegatorAddress: wallet.account.address,
          validatorAddress: Bech32.encode(
            'odinvaloper',
            Bech32.decode(wallet.account.address).data
          ),
          pubkey: {
            // TODO: key of ed25519 cannot be decoded
            typeUrl: '/cosmos.crypto.secp256k1.PubKey',
            value: PubKey.encode({
              key: Buffer.from(fromBase64(form.pubKey.val())),
            }).finish(),
          },
          value: coin(
            convertOdinToLoki(form.selfDelegation.val()),
            COINS_LIST.LOKI
          ),
        })

        onSubmit()
        notifySuccess('Promoted to validators election')
      } catch (error) {
        handleError(error as Error)
      }
      isLoading.value = false
    }

    // TODO: remove fakeForm
    const _fakeForm = () => {
      form.moniker.val('validator-' + loremIpsum({ units: 'words', count: 1 }))
      form.rate.val(big.fromPrecise('100000000000000000').toString())
      form.maxRate.val(big.fromPrecise('200000000000000000').toString())
      form.maxChangeRate.val(big.fromPrecise('100000000000000000').toString())
      form.pubKey.val('YVo5TzlCK5Y5C+7lnOKMlHZKoGfLrEKhmpci3xNs5HA=')
      form.minDelegation.val()
      form.selfDelegation.val()
    }

    _fakeForm()

    return {
      form: form.flatten(),
      isLoading,
      submit,
      onClose: preventIf(dialogs.getHandler('onClose'), isLoading),
    }
  },
})

export default BecomeValidatorFormModal
</script>

<style scoped lang="scss">
.app-form__field-lbl {
  white-space: nowrap;
}
</style>

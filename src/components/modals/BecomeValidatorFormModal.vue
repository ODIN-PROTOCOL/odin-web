<template>
  <ModalBase class="become-validator-form-modal" @close="onClose()">
    <template #title>
      <h3>Become a validator</h3>
    </template>

    <template #main>
      <form
        class="app-form load-fog"
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent
      >
        <div class="app-form__field">
          <label class="app-form__field-lbl"> Moniker </label>
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
            <label class="app-form__field-lbl"> Max change (%) </label>
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
          <label class="app-form__field-lbl"> Min delegation (LOKI) </label>
          <input
            class="app-form__field-input"
            name="become-validator-min-delegation"
            type="number"
            min="1"
            step="1000"
            placeholder="1000"
            v-model="form.minDelegation"
            :disabled="isLoading"
          />
          <p v-if="form.minDelegationErr" class="app-form__field-err">
            {{ form.minDelegationErr }}
          </p>
        </div>

        <div class="app-form__field">
          <label class="app-form__field-lbl"> Self delegation (LOKI) </label>
          <input
            class="app-form__field-input"
            name="become-validator-self-delegation"
            type="number"
            min="1"
            step="1000"
            placeholder="1000"
            v-model="form.selfDelegation"
            :disabled="isLoading"
          />
          <p v-if="form.selfDelegationErr" class="app-form__field-err">
            {{ form.selfDelegationErr }}
          </p>
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
import { DialogHandler, dialogs } from '@/helpers/dialogs'
import { handleError } from '@/helpers/errors'
import { preventIf } from '@/helpers/functions'
import { notifySuccess } from '@/helpers/notifications'
import { useForm, validators } from '@/composables/useForm'
import ModalBase from './ModalBase.vue'
import { Bech32, fromBase64 } from '@cosmjs/encoding'
import { bigMath } from '@/helpers/bigMath'
import { PubKey } from '@cosmjs/stargate/build/codec/cosmos/crypto/secp256k1/keys'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { Buffer } from 'buffer'

const BecomeValidatorFormModal = defineComponent({
  components: { ModalBase },
  setup() {
    const form = useForm({
      moniker: ['', validators.required],
      pubKey: ['', validators.required, validators.erc20Address],
      rate: ['', validators.required, ...validators.num(0)],
      maxRate: ['', validators.required, ...validators.num(0)],
      maxChangeRate: ['', validators.required, ...validators.num(0)],
      minDelegation: ['', validators.required, ...validators.num(1)],
      selfDelegation: ['', validators.required, ...validators.num(0)],
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
            rate: bigMath.toPrecise(form.rate.val()).toString(),
            maxRate: bigMath.toPrecise(form.maxRate.val()).toString(),
            maxChangeRate: bigMath
              .toPrecise(form.maxChangeRate.val())
              .toString(),
          },
          minSelfDelegation: form.minDelegation.val(),
          delegatorAddress: wallet.account.address,
          validatorAddress: Bech32.encode(
            'odinvaloper',
            Bech32.decode(wallet.account.address).data
          ),
          pubkey: {
            // TODO: key of ed25519 cannot be decoded
            typeUrl: '/cosmos.crypto.ed25519.PubKey',
            value: PubKey.encode({
              key: Buffer.from(fromBase64(form.pubKey.val())),
            }).finish(),
          },
          value: {
            denom: 'loki',
            amount: form.selfDelegation.val(),
          },
        })

        onSubmit()
        notifySuccess('Promoted to validators election')
      } catch (error) {
        handleError(error)
      }
      isLoading.value = false
    }

    // TODO: remove fakeForm
    const _fakeForm = () => {
      form.moniker.val('validator-' + loremIpsum({ units: 'words', count: 1 }))
      form.rate.val(bigMath.fromPrecise('100000000000000000').toString())
      form.maxRate.val(bigMath.fromPrecise('200000000000000000').toString())
      form.maxChangeRate.val(
        bigMath.fromPrecise('100000000000000000').toString()
      )
      form.pubKey.val('YVo5TzlCK5Y5C+7lnOKMlHZKoGfLrEKhmpci3xNs5HA=')
      form.minDelegation.val('1')
      form.selfDelegation.val('10000000')
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
export function showBecomeValidatorFormDialog(callbacks: {
  onSubmit?: DialogHandler
  onClose?: DialogHandler
}): Promise<unknown | null> {
  return dialogs.show(BecomeValidatorFormModal, callbacks)
}
</script>

<style scoped lang="scss"></style>

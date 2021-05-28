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
            name="validator-moniker"
            type="text"
            v-model="form.moniker"
            :disabled="isLoading"
          />
          <p v-if="form.monikerErr" class="app-form__field-err">
            {{ form.monikerErr }}
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
import { Bech32 } from '@cosmjs/encoding'
import { strToUnit8Array } from '@/helpers/casts'

const BecomeValidatorFormModal = defineComponent({
  props: { dataSourceId: String },
  components: { ModalBase },
  setup() {
    const form = useForm({
      moniker: ['', validators.required],
      // TODO:
      // commission x3
      // minSelfDelegation
      // selfDelegation
      // pubKey
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
            rate: '100000000000000000',
            maxRate: '200000000000000000',
            maxChangeRate: '100000000000000000',
          },
          minSelfDelegation: '1',
          delegatorAddress: wallet.account.address,
          validatorAddress: Bech32.encode(
            'odinvaloper',
            Bech32.decode(wallet.account.address).data
          ),
          pubkey: {
            typeUrl: '/cosmos.crypto.ed25519.PubKey',
            value: strToUnit8Array(
              'odinvalconspub1zcjduepqjmlpnfqa8e8ep4pk4wrlp02cf3gjgpx5j82pmup4kwt3yxfqk0vqs7k799'
            ),
          },
          value: {
            denom: 'loki',
            amount: '10000000',
          },
        })

        onSubmit()
        notifySuccess('Data source created')
      } catch (error) {
        handleError(error)
      }
      isLoading.value = false
    }

    // TODO: remove fakeForm
    const _fakeForm = () => {
      form.moniker.val('validator-' + loremIpsum({ units: 'words', count: 1 }))
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
export function showBecomeValidatorFormDialog(
  callbacks: {
    onSubmit?: DialogHandler
    onClose?: DialogHandler
  },
  props?: { dataSourceId?: string }
): Promise<unknown | null> {
  return dialogs.show(BecomeValidatorFormModal, callbacks, { props })
}
</script>

<style scoped lang="scss"></style>

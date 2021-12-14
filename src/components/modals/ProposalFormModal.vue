<template>
  <ModalBase class="modal-base_right" @close="onClose()">
    <template #title>
      <h3 class="app-form__title">Proposal creating</h3>
    </template>
    <template #main>
      <form
        class="app-form load-fog"
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent
      >
        <div class="app-form__main">
          <div class="app-form__field">
            <label class="app-form__field-lbl">Name</label>
            <input
              class="app-form__field-input"
              name="proposal-name"
              type="text"
              v-model="form.name"
              :disabled="isLoading"
              placeholder="Proposal name"
            />
            <p v-if="form.nameErr" class="app-form__field-err">
              {{ form.nameErr }}
            </p>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl"> Description </label>
            <textarea
              class="app-form__field-input"
              name="proposal-description"
              rows="5"
              v-model="form.description"
              :disabled="isLoading"
              placeholder="Proposal Description"
            ></textarea>
            <p v-if="form.descriptionErr" class="app-form__field-err">
              {{ form.descriptionErr }}
            </p>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl">Deposit</label>
            <input
              class="app-form__field-input"
              name="proposal-deposit"
              v-model="form.deposit"
              type="text"
              :disabled="isLoading"
              placeholder="Proposal deposit"
            />
            <p v-if="form.depositErr" class="app-form__field-err">
              {{ form.depositErr }}
            </p>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl">Subspace</label>
            <VuePicker
              class="_vue-picker"
              placeholder="ODIN"
              v-model="sendAsset"
            >
              <template #dropdownInner>
                <div class="_vue-picker__dropdown-custom">
                  <VuePickerOption value="loki" text="LOKI">
                    LOKI
                  </VuePickerOption>
                  <VuePickerOption value="odin" text="ODIN">
                    ODIN
                  </VuePickerOption>
                </div>
              </template>
            </VuePicker>
          </div>
        </div>

        <div class="app-form__footer">
          <button
            class="app-btn app-btn_outlined"
            type="button"
            @click="onClose()"
            :disabled="isLoading"
          >
            Cancel
          </button>
          <button
            class="app-btn"
            type="button"
            @click="submit()"
            :disabled="!form.isValid || isLoading"
          >
            Create
          </button>
        </div>
      </form>
    </template>
  </ModalBase>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
// import { coins } from '@cosmjs/launchpad'
// import { wallet } from '@/api/wallet'
// import { callers } from '@/api/callers'
import { DialogHandler, dialogs } from '@/helpers/dialogs'
import { handleError } from '@/helpers/errors'
import { preventIf } from '@/helpers/functions'
import { notifySuccess } from '@/helpers/notifications'
import { useForm, validators } from '@/composables/useForm'
import { ProposalChanges } from '@/helpers/Types'
import ModalBase from './ModalBase.vue'

const ProposalFormModal = defineComponent({
  props: {
    proposalChanges: {
      type: Object as PropType<ProposalChanges>,
      required: true,
    },
  },
  components: { ModalBase },
  setup(props) {
    const form = useForm({
      name: ['', validators.required],
      description: ['', validators.required],
      deposit: [0, validators.required, ...validators.num(1)],
    })

    const isLoading = ref(false)
    const onSubmit = dialogs.getHandler('onSubmit')

    const submit = async () => {
      isLoading.value = true
      try {
        console.log(props.proposalChanges)

        onSubmit()
        notifySuccess('Proposal created!')
      } catch (error) {
        handleError(error as Error)
      }
      isLoading.value = false
    }

    return {
      form: form.flatten(),
      isLoading,
      submit,
      onClose: preventIf(dialogs.getHandler('onClose'), isLoading),
    }
  },
})

export default ProposalFormModal
export function showProposalFormDialog(
  callbacks: {
    onSubmit?: DialogHandler
    onClose?: DialogHandler
  },
  props?: { proposalChanges?: ProposalChanges }
): Promise<unknown | null> {
  return dialogs.show(ProposalFormModal, callbacks, { props })
}
</script>

<style lang="scss" scoped></style>

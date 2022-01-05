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
            <TextareaField
              v-model="form.description"
              name="proposal-description"
              :rows="5"
              :disabled="isLoading"
              placeholder="Proposal Description"
            />
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
              placeholder="Subspace"
              v-model="form.changesSubspace"
            >
              <template #dropdownInner>
                <div class="_vue-picker__dropdown-custom">
                  <VuePickerOption
                    v-for="(val, key) in proposalChanges"
                    :key="key"
                    :value="key"
                    :text="key"
                  >
                    {{ key }}
                  </VuePickerOption>
                </div>
              </template>
            </VuePicker>
          </div>

          <div class="app-form__field" v-if="form.changesSubspace">
            <label class="app-form__field-lbl">Key</label>
            <VuePicker
              class="_vue-picker"
              placeholder="Key"
              v-model="form.changesKey"
            >
              <template #dropdownInner>
                <div class="_vue-picker__dropdown-custom">
                  <VuePickerOption
                    v-for="(item, idx) in proposalChanges[form.changesSubspace]"
                    :key="item.Key + idx"
                    :value="item.Key"
                    :text="item.Key"
                  >
                    {{ item.Key }}
                  </VuePickerOption>
                </div>
              </template>
            </VuePicker>
          </div>

          <div class="app-form__field" v-if="form.changesKey">
            <div class="app-form__field-lbl app-form__field-lbl_ext">
              <label>Value</label>
              <div class="app-form__info-wrapper">
                <div class="app-form__info">
                  <img src="~@/assets/icons/info.svg" alt="info" />
                </div>
                <div class="tooltip">
                  <span>Value type:</span>
                  <p>
                    {{ changesValueType }}
                  </p>
                </div>
              </div>
            </div>
            <input
              class="app-form__field-input"
              name="proposal-deposit"
              v-model="form.changesValue"
              type="text"
              :disabled="isLoading"
              placeholder="Value"
            />
            <p v-if="form.changesValueErr" class="app-form__field-err">
              {{ form.changesValueErr }}
            </p>
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
import { computed, defineComponent, PropType, ref, toRef, watch } from 'vue'
import { coins } from '@cosmjs/launchpad'
import { wallet } from '@/api/wallet'
import { callers } from '@/api/callers'
import { dialogs } from '@/helpers/dialogs'
import { handleError } from '@/helpers/errors'
import { preventIf } from '@/helpers/functions'
import { notifySuccess } from '@/helpers/notifications'
import { useForm, validators } from '@/composables/useForm'
import { ProposalChanges, ProposalChangesItem } from '@/helpers/Types'
import { ParameterChangeProposal } from '@provider/codec/cosmos/params/v1beta1/params'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { VuePicker, VuePickerOption } from '@invisiburu/vue-picker'
import ModalBase from './ModalBase.vue'
import TextareaField from '@/components/fields/TextareaField.vue'

const ProposalFormModal = defineComponent({
  props: {
    proposalChanges: {
      type: Object as PropType<ProposalChanges>,
      required: true,
    },
  },
  components: { ModalBase, VuePicker, VuePickerOption, TextareaField },
  setup(props) {
    const _proposalChanges = toRef(props, 'proposalChanges')
    const form = useForm({
      name: ['', validators.required],
      description: ['', validators.required],
      deposit: [0, validators.required, ...validators.num(1)],
      changesSubspace: ['', validators.required],
      changesKey: ['', validators.required],
      changesValue: ['', validators.required],
    })

    const changesValueType = computed(() => {
      return _proposalChanges.value[
        form.changesSubspace.val() as keyof ProposalChanges
      ].find((item: ProposalChangesItem) => item.Key === form.changesKey.val())
        ?.ValueType
    })

    const isLoading = ref(false)
    const onSubmit = dialogs.getHandler('onSubmit')

    const submit = async () => {
      isLoading.value = true
      try {
        await callers.createProposal({
          content: {
            typeUrl: '/cosmos.params.v1beta1.ParameterChangeProposal',
            value: ParameterChangeProposal.encode({
              title: form.name.val(),
              description: form.description.val(),
              changes: [
                {
                  subspace: form.changesSubspace.val(),
                  key: form.changesKey.val(),
                  value: form.changesValue.val(),
                },
              ],
            }).finish(),
          },
          initialDeposit: coins(Number(form.deposit.val()), 'loki'),
          proposer: wallet.account.address,
        })

        onSubmit()
        notifySuccess('Proposal created!')
      } catch (error) {
        handleError(error as Error)
      }
      isLoading.value = false
    }

    watch(
      () => form.changesSubspace.val(),
      () => {
        form.changesKey.current.value = ''
        form.changesValue.current.value = ''
      }
    )

    return {
      form: form.flatten(),
      isLoading,
      submit,
      changesValueType,
      onClose: preventIf(dialogs.getHandler('onClose'), isLoading),
    }
  },
})

export default ProposalFormModal
</script>

<style lang="scss" scoped>
.app-form__info {
  &-wrapper {
    position: relative;
  }

  &:hover {
    & + .tooltip {
      display: block;
    }
  }
}

.app-form__field-lbl_ext {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tooltip {
  display: none;
  position: absolute;
  bottom: 130%;
  right: -5px;
  max-width: 22rem;
  min-width: 15rem;
  padding: 1.2rem 2.4rem;
  background: var(--clr__tooltip-bg);
  border-radius: 8px;
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 1.6rem;
  color: var(--clr__tooltip-text);

  &:before {
    content: '';
    display: block;
    width: 0.6rem;
    height: 0.6rem;
    position: absolute;
    bottom: -0.3rem;
    right: 10px;
    transform: rotate(45deg);
    background: var(--clr__tooltip-bg);
  }

  span {
    display: inline-block;
    color: var(--clr__input-border);
    margin-bottom: 1rem;
  }
}
</style>

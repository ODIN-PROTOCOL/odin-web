<template>
  <ModalBase class="modal-base--right" @close="onClose()">
    <template #title>
      <h3 class="app-form__title">Proposal creating</h3>
    </template>
    <template #main>
      <form
        class="app-form load-fog"
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent="submit"
      >
        <div class="app-form__main">
          <div class="app-form__field">
            <label class="app-form__field-lbl">Name</label>
            <input
              class="app-form__field-input"
              name="proposal-name"
              type="text"
              v-model="flattenForm.name"
              :disabled="isLoading"
              placeholder="Proposal name"
            />
            <p v-if="flattenForm.nameErr" class="app-form__field-err">
              {{ flattenForm.nameErr }}
            </p>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl"> Description </label>
            <TextareaField
              v-model="flattenForm.description"
              name="proposal-description"
              :rows="5"
              :disabled="isLoading"
              placeholder="Proposal Description"
            />
            <p v-if="flattenForm.descriptionErr" class="app-form__field-err">
              {{ flattenForm.descriptionErr }}
            </p>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl">Deposit</label>
            <div class="app-form__field-input-wrapper">
              <span>ODIN</span>
              <input
                class="app-form__field-input"
                name="proposal-deposit"
                v-model="flattenForm.deposit"
                type="text"
                :disabled="isLoading"
                placeholder="1"
              />
            </div>
            <p v-if="flattenForm.depositErr" class="app-form__field-err">
              {{ flattenForm.depositErr }}
            </p>
          </div>

          <div class="app-form__field">
            <label class="app-form__field-lbl">Subspace</label>
            <VuePicker
              class="_vue-picker"
              placeholder="Subspace"
              v-model="flattenForm.changesSubspace"
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

          <div class="app-form__field" v-if="flattenForm.changesSubspace">
            <label class="app-form__field-lbl">Key</label>
            <VuePicker
              class="_vue-picker"
              placeholder="Key"
              v-model="flattenForm.changesKey"
            >
              <template #dropdownInner>
                <div class="_vue-picker__dropdown-custom">
                  <VuePickerOption
                    v-for="(item, idx) in proposalChanges[
                      flattenForm.changesSubspace
                    ]"
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

          <div class="app-form__field" v-if="flattenForm.changesKey">
            <div class="app-form__field-lbl app-form__field-lbl_ext">
              <label>Value</label>
            </div>
            <input
              class="app-form__field-input"
              name="changes-value"
              v-model="flattenForm.changesValue"
              type="text"
              :disabled="isLoading"
              placeholder="Value"
            />
            <p v-if="flattenForm.changesValueErr" class="app-form__field-err">
              {{ flattenForm.changesValueErr }}
            </p>
            <div
              v-if="changesValueType"
              class="proposal-form-modal__field-info"
            >
              <div class="proposal-form-modal__field-lbl--info">
                <label>Value type:</label>
              </div>
              <div class="proposal-form-modal__value-type">
                {{ changesValueType }}
              </div>
            </div>
          </div>
        </div>

        <div class="app-form__footer">
          <button
            class="app-btn app-btn--outlined app-btn--medium"
            type="button"
            @click="onClose()"
            :disabled="isLoading"
          >
            Cancel
          </button>
          <button
            class="app-btn app-btn--medium"
            type="submit"
            :disabled="!flattenForm.isValid || isLoading"
          >
            Create
          </button>
        </div>
      </form>
    </template>
  </ModalBase>
</template>

<script setup lang="ts">
import { computed, ref, toRef, watch } from 'vue'
import { coins } from '@cosmjs/launchpad'
import { wallet } from '@/api/wallet'
import { callers } from '@/api/callers'
import { COINS_LIST } from '@/api/api-config'
import { dialogs } from '@/helpers/dialogs'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { preventIf } from '@/helpers/functions'
import { convertOdinToLoki } from '@/helpers/converters'
import { useForm, validators } from '@/composables/useForm'
import { ProposalChanges, ProposalChangesItem } from '@/helpers/Types'
import { ParameterChangeProposal } from '@provider/codec/cosmos/params/v1beta1/params'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { VuePicker, VuePickerOption } from '@invisiburu/vue-picker'
import { ModalBase } from '@/components/modals'
import TextareaField from '@/components/fields/TextareaField.vue'

const props = defineProps<{
  proposalChanges: ProposalChanges
}>()

const _proposalChanges = toRef(props, 'proposalChanges')
const form = useForm({
  name: ['', validators.required, validators.maxCharacters(128)],
  description: ['', validators.required, validators.maxCharacters(256)],
  deposit: [
    '',
    validators.required,
    validators.number,
    validators.sixDecimalNumber,
    ...validators.num(0.000001),
    validators.maxCharacters(32),
  ],
  changesSubspace: ['', validators.required],
  changesKey: ['', validators.required],
  changesValue: ['', validators.required, validators.maxCharacters(128)],
})

const changesValueType = computed(() => {
  return _proposalChanges.value[
    form.changesSubspace.val() as keyof ProposalChanges
  ].find((item: ProposalChangesItem) => item.Key === form.changesKey.val())
    ?.ValueType
})

const isLoading = ref(false)
const flattenForm = form.flatten()
const onClose = preventIf(dialogs.getHandler('onClose'), isLoading)
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
      initialDeposit: coins(
        convertOdinToLoki(form.deposit.val()),
        COINS_LIST.LOKI,
      ),
      proposer: wallet.account.address,
    })
    onSubmit()
    handleNotificationInfo('Proposal created!', TYPE_NOTIFICATION.success)
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  isLoading.value = false
}

watch(
  () => form.changesSubspace.val(),
  () => {
    form.changesKey.current.value = ''
    form.changesValue.current.value = ''
  },
)
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
.proposal-form-modal__field-info {
  margin-top: 0.4rem;
  color: var(--clr__text-muted);
  font-size: 1.4rem;
  line-height: 2rem;
}
.proposal-form-modal__field-lbl--info {
  font-weight: 400;
}
.proposal-form-modal__value-type {
  overflow-wrap: break-word;
  font-weight: 300;
}
</style>

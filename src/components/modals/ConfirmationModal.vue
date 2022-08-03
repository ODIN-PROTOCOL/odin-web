<template>
  <ModalBase class="confirmation-modal" @close="onClose">
    <template #title>
      <h3 class="app-form__title">Are you sure?</h3>
    </template>
    <template #main>
      <form
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent
        class="app-form"
      >
        <div class="app-form__main">
          <div class="app-form__field">
            {{ text }}
          </div>
        </div>
        <div class="app-form__footer">
          <button
            class="app-btn w-full app-btn--outlined app-btn--medium"
            :disabled="isLoading"
            @click="onClose"
          >
            No
          </button>
          <button
            class="app-btn w-full app-btn--medium"
            :disabled="isLoading"
            @click="submit()"
          >
            Yes
          </button>
        </div>
      </form>
    </template>
  </ModalBase>
</template>

<script setup lang="ts">
import { dialogs } from '@/helpers/dialogs'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { callers } from '@/api/callers'
import { wallet } from '@/api/wallet'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { voteStatusType } from '@/helpers/statusTypes'
import { ModalBase } from '@/components/modals'
import Long from 'long'

const props = withDefaults(
  defineProps<{
    text?: string
    pickedOption: number
    id: number
  }>(),
  {
    text: 'Choose some',
  },
)
const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const onSubmit = dialogs.getHandler('onSubmit')
const onClose = dialogs.getHandler('onClose')

const submit = async () => {
  lockLoading()
  try {
    await callers.proposalVote({
      proposalId: new Long(Number(props.id)),
      voter: wallet.account.address,
      option: props.pickedOption,
    })
    onSubmit()
    handleNotificationInfo(
      `Successfully voted for ${voteStatusType[props.pickedOption].name}`,
      TYPE_NOTIFICATION.success,
    )
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}
</script>

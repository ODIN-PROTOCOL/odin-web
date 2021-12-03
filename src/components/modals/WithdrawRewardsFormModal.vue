<template>
  <ModalBase class="withdraw-form-modal" @close="onClose()">
    <template #title>
      <h3 class="app-form__title">Claim delegation rewards</h3>
    </template>

    <template #main>
      <form
        class="app-form load-fog"
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent
      >
        <div class="app-form__main">
          <template v-if="rewards?.length">
            <div class="app-form__field">
              <label class="app-form__field-lbl">Your rewards:</label>
              <p v-for="item in rewards" :key="item.denom">
                {{ $preciseAsFormatedCoin(item) }}
              </p>
            </div>
          </template>
          <template v-else>
            <div class="app-form__field">
              <label class="app-form__field-lbl">
                You have no rewards yet!
              </label>
            </div>
          </template>
        </div>

        <div class="app-form__footer">
          <button
            class="app-btn"
            type="button"
            @click="submit()"
            :disabled="!rewards?.length || isLoading"
          >
            Claim
          </button>
        </div>
      </form>
    </template>
  </ModalBase>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, PropType, ref } from 'vue'
import { wallet } from '@/api/wallet'
import { callers } from '@/api/callers'
import { DialogHandler, dialogs } from '@/helpers/dialogs'
import { handleError } from '@/helpers/errors'
import { preventIf } from '@/helpers/functions'
import { notifySuccess } from '@/helpers/notifications'
import { ValidatorDecoded } from '@/helpers/validatorDecoders'
import ModalBase from './ModalBase.vue'
import { usePoll } from '@/composables/usePoll'

const WithdrawRewardsFormDialog = defineComponent({
  props: {
    validator: { type: Object as PropType<ValidatorDecoded>, required: true },
  },
  components: { ModalBase },
  setup(props) {
    const isLoading = ref(false)
    const onSubmit = dialogs.getHandler('onSubmit')
    const rewards = ref()

    const getRewards = async () => {
      try {
        const response = await callers.getDelegationDelegatorReward(
          wallet.account.address,
          props.validator.operatorAddress
        )
        rewards.value = response.rewards
      } catch (error) {
        handleError(error as Error)
      }
    }

    const rewardsPoll = usePoll(getRewards, 5000)

    const submit = async () => {
      isLoading.value = true
      try {
        await callers.withdrawDelegatorRewards({
          delegatorAddress: wallet.account.address,
          validatorAddress: props.validator.operatorAddress,
        })
        onSubmit()
        notifySuccess('Successfully claimed')
      } catch (error) {
        handleError(error as Error)
      }
      isLoading.value = false
    }

    onMounted(async () => {
      await getRewards()
      rewardsPoll.start()
    })

    onUnmounted(() => {
      rewardsPoll.stop()
    })

    return {
      rewards,
      isLoading,
      submit,
      onClose: preventIf(dialogs.getHandler('onClose'), isLoading),
    }
  },
})

export default WithdrawRewardsFormDialog
export function showWithdrawRewardsFormDialog(
  callbacks: {
    onSubmit?: DialogHandler
    onClose?: DialogHandler
  },
  props: { validator: ValidatorDecoded }
): Promise<unknown | null> {
  return dialogs.show(WithdrawRewardsFormDialog, callbacks, { props })
}
</script>

<style lang="scss" scoped></style>

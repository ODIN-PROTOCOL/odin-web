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
              <p :title="odinRewardsValue">{{ odinRewardsValue }} ODIN</p>
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
            class="app-btn w-full app-btn--medium"
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
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { preventIf } from '@/helpers/functions'
import { ValidatorDecoded } from '@/helpers/validatorDecoders'
import ModalBase from './ModalBase.vue'
import { usePoll } from '@/composables/usePoll'
import { convertLokiToOdin } from '@/helpers/converters'

const WithdrawFormDialog = defineComponent({
  props: {
    validator: { type: Object as PropType<ValidatorDecoded>, required: true },
  },
  components: { ModalBase },
  setup(props) {
    const isLoading = ref(false)
    const onSubmit = dialogs.getHandler('onSubmit')
    const rewards = ref()
    const odinRewardsValue = ref()
    const getRewards = async () => {
      try {
        const response = await callers.getDelegationDelegatorReward(
          wallet.account.address,
          props.validator.operatorAddress
        )
        rewards.value = response.rewards
        odinRewardsValue.value = convertLokiToOdin(response.rewards[0].amount, {
          withPrecise: true,
          onlyNumber: true,
        })
        odinRewardsValue.value = Number(odinRewardsValue.value.toFixed(6))
      } catch (error) {
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
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
        handleNotificationInfo(
          'Successfully claimed',
          TYPE_NOTIFICATION.success
        )
      } catch (error) {
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
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
      odinRewardsValue,
    }
  },
})
export default WithdrawFormDialog
export function showWithdrawFormDialog(callbacks: {
  onSubmit?: DialogHandler
  onClose?: DialogHandler
}): Promise<unknown | null> {
  return dialogs.show(WithdrawFormDialog, callbacks)
}
</script>

<style lang="scss" scoped></style>

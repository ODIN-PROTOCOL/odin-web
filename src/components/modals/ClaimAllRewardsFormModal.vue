<template>
  <ModalBase class="claim-all-rewards-form-modal" @close="onClose">
    <template #title>
      <h3 class="app-form__title">Claim all delegation rewards</h3>
    </template>

    <template #main>
      <form
        class="app-form load-fog"
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent
      >
        <div class="app-form__main">
          <div class="app-form__field claim-all-rewards-form-modal__field">
            <template v-if="totalRewards.length">
              <label
                class="app-form__field-lbl claim-all-rewards-form-modal__field-lbl"
              >
                Your rewards:
              </label>
              <p
                class="claim-all-rewards-form-modal__field-value"
                :title="odinRewardsValue"
              >
                {{ odinRewardsValue }} ODIN
              </p>
            </template>
            <template v-else>
              <p class="claim-all-rewards-form-modal__field-value--empty">
                You have no rewards yet!
              </p>
            </template>
          </div>
        </div>

        <div class="app-form__footer">
          <button
            class="app-btn app-btn--medium w-full"
            type="button"
            @click="submit"
            :disabled="!totalRewards.length || isLoading"
          >
            Claim
          </button>
        </div>
      </form>
    </template>
  </ModalBase>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { callers } from '@/api/callers'
import { wallet } from '@/api/wallet'
import { dialogs } from '@/helpers/dialogs'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { usePoll } from '@/composables/usePoll'
import { preventIf } from '@/helpers/functions'
import { DelegationDelegatorReward } from 'cosmjs-types/cosmos/distribution/v1beta1/distribution'
import { DecCoin } from 'cosmjs-types/cosmos/base/v1beta1/coin'
import { ModalBase } from '@/components/modals'
import { convertLokiToOdin } from '@/helpers/converters'
import { trimLeadingZeros } from '@/helpers/formatters'

const isLoading = ref(false)
const onSubmit = dialogs.getHandler('onSubmit')
const totalRewards = ref<DecCoin[]>([])
const rewards = ref<DelegationDelegatorReward[]>([])
const odinRewardsValue = ref()

const getRewards = async () => {
  try {
    const response = await callers.getDelegationRewards(wallet.account.address)
    totalRewards.value = response.total
    rewards.value = response.rewards
    odinRewardsValue.value = convertLokiToOdin(response.total[0].amount, {
      withPrecise: true,
      onlyNumber: true,
    })
    odinRewardsValue.value = trimLeadingZeros(odinRewardsValue.value)
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
}

const rewardsPoll = usePoll(getRewards, 5000)

const submit = async () => {
  isLoading.value = true
  try {
    await callers.withdrawMultiDelegatorRewards(
      rewards.value.map(item => ({
        delegatorAddress: wallet.account.address,
        validatorAddress: item.validatorAddress,
      })),
    )
    onSubmit()
    handleNotificationInfo('Successfully claimed', TYPE_NOTIFICATION.info)
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

const onClose = preventIf(dialogs.getHandler('onClose'), isLoading)
</script>

<style scoped lang="scss">
.claim-all-rewards-form-modal__field {
  background: var(--clr__modal-field-bg);
  border-radius: 0.8rem;
  padding: 0.8rem;
  width: 100%;
}
.claim-all-rewards-form-modal__field-value {
  font-weight: 600;
  margin: 0;
  font-size: 1.6rem;
  line-height: 2.4rem;
  &--empty {
    font-weight: 600;
    margin: 1rem;
    font-size: 1.8rem;
    text-align: center;
  }
}
.claim-all-rewards-form-modal__field-lbl {
  font-weight: 400;
  line-height: 2rem;
  color: var(--clr__modal-backdrop-bg);
  margin: 0;
}
</style>

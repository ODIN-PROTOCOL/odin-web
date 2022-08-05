<template>
  <ModalBase class="claim-rewards-form-modal" @close="onClose()">
    <template #title>
      <h3 class="app-form__title">Claim delegation rewards</h3>
    </template>

    <template #main>
      <form
        class="app-form load-fog"
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent="submit"
      >
        <div class="app-form__main">
          <template v-if="rewards?.length && validator.descriptions?.length">
            <div class="app-form__field claim-rewards-form-modal__field">
              <div class="claim-rewards-form-modal__field-descriptions">
                <label
                  class="app-form__field-lbl claim-rewards-form-modal__field-lbl"
                >
                  {{ validator.descriptions[0]?.moniker }}
                </label>
                <p
                  :title="validator.info.operatorAddress"
                  class="claim-rewards-form-modal__field-value"
                >
                  {{ validator.info.operatorAddress }}
                </p>
              </div>
              <div class="claim-rewards-form-modal__field-info">
                <p
                  :title="odinRewardsValue"
                  class="claim-rewards-form-modal__field-value"
                >
                  {{ odinRewardsValue }} ODIN
                </p>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="app-form__field claim-rewards-form-modal__field">
              <p class="claim-rewards-form-modal__field-value--empty">
                You have no rewards yet!
              </p>
            </div>
          </template>
        </div>

        <div class="app-form__footer">
          <button
            class="app-btn w-full app-btn--medium"
            type="submit"
            :disabled="!rewards?.length || isLoading"
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
import { wallet } from '@/api/wallet'
import { callers } from '@/api/callers'
import { dialogs } from '@/helpers/dialogs'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { preventIf } from '@/helpers/functions'
import { usePoll } from '@/composables/usePoll'
import { convertLokiToOdin } from '@/helpers/converters'
import { ValidatorInfoModify } from '@/helpers/validatorHelpers'
import { trimLeadingZeros } from '@/helpers/formatters'
import { ModalBase } from '@/components/modals'

const props = defineProps<{
  validator: ValidatorInfoModify
}>()

const isLoading = ref(false)
const onSubmit = dialogs.getHandler('onSubmit')
const rewards = ref()
const odinRewardsValue = ref()
const getRewards = async () => {
  try {
    const response = await callers.getDelegationDelegatorReward(
      wallet.account.address,
      props.validator.info.operatorAddress,
    )
    rewards.value = response.rewards
    if (response.rewards.length) {
      odinRewardsValue.value = convertLokiToOdin(response.rewards[0].amount, {
        withPrecise: true,
        onlyNumber: true,
      })
      odinRewardsValue.value = trimLeadingZeros(odinRewardsValue.value)
    } else {
      odinRewardsValue.value = 0
    }
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
      validatorAddress: props.validator.info.operatorAddress,
    })
    onSubmit()
    handleNotificationInfo('Successfully claimed', TYPE_NOTIFICATION.success)
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
.claim-rewards-form-modal__field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--clr__modal-field-bg);
  border-radius: 0.8rem;
  padding: 1.2rem 1.6rem;
  width: 100%;
  overflow: hidden;
}
.claim-rewards-form-modal__field-descriptions {
  max-width: 8rem;
}
.claim-rewards-form-modal__field-info {
  max-width: 17rem;
}
.claim-rewards-form-modal__field-value {
  font-weight: 600;
  margin: 0;
  font-size: 1.6rem;
  line-height: 2.4rem;
  &--empty {
    font-weight: 600;
    margin: 1rem;
    font-size: 1.8rem;
    text-align: center;
    width: 100%;
  }
  @include ellipsis();
}
.claim-rewards-form-modal__field-lbl {
  font-weight: 400;
  line-height: 2rem;
  color: var(--clr__modal-backdrop-bg);
  margin: 0;
  @include ellipsis();
}
</style>

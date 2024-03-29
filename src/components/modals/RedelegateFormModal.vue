<template>
  <ModalBase class="redelegate-form-modal" @close="onClose">
    <template #title>
      <h3 class="app-form__title">Redelegate</h3>
    </template>

    <template #main>
      <form
        class="app-form load-fog"
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent="submit"
      >
        <div class="app-form__main">
          <template v-if="isAvailableCoin">
            <div class="app-form__field redelegate-form-modal__field">
              <div class="redelegate-form-modal__field-descriptions">
                <label
                  class="app-form__field-lbl redelegate-form-modal__field-lbl"
                >
                  {{ validator.descriptions[0]?.moniker }}
                </label>
                <p
                  :title="validator.info.operatorAddress"
                  class="redelegate-form-modal__field-value"
                >
                  {{ validator.info.operatorAddress }}
                </p>
              </div>
              <div class="redelegate-form-modal__field-info">
                <p
                  :title="$convertLokiToOdin(availableCoinForRedelegate.amount)"
                  class="redelegate-form-modal__field-value"
                >
                  {{
                    $convertLokiToOdin(availableCoinForRedelegate.amount, {
                      withDenom: true,
                    })
                  }}
                </p>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="app-form__field redelegate-form-modal__field">
              <p class="redelegate-form-modal__field-value--empty">
                Not enough coins!
              </p>
            </div>
          </template>
        </div>

        <div class="app-form__footer">
          <button
            class="app-btn w-full app-btn--medium"
            :disabled="!isAvailableCoin || isLoading"
          >
            Redelegate
          </button>
        </div>
      </form>
    </template>
  </ModalBase>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { callers } from '@/api/callers'
import { wallet } from '@/api/wallet'
import { API_CONFIG, COINS_LIST } from '@/api/api-config'
import { DelegationResponse } from 'cosmjs-types/cosmos/staking/v1beta1/staking'
import { Coin, DecCoin } from 'cosmjs-types/cosmos/base/v1beta1/coin'
import { dialogs } from '@/helpers/dialogs'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { preventIf } from '@/helpers/functions'
import { usePoll } from '@/composables/usePoll'
import { big } from '@/helpers/bigMath'
import { coin } from '@cosmjs/amino'
import { parseLogsToGetRewardsAmount } from '@/helpers/helpers'
import { ModalBase } from '@/components/modals'
import { ValidatorInfoModify } from '@/helpers/validatorHelpers'

const defaultBalanceBlank: Coin = { amount: '0', denom: COINS_LIST.LOKI }

const props = defineProps<{
  validator: ValidatorInfoModify
  delegation: DelegationResponse
}>()

const isLoading = ref(false)
const rewards = ref<DecCoin[]>([])
const fee = ref(API_CONFIG.fee)

const availableCoinForRedelegate = computed(() => {
  const reward = rewards.value.find(item => {
    return item.denom === COINS_LIST.LOKI
  })
  return reward || defaultBalanceBlank
})
const isAvailableCoin = computed(
  () => Number(availableCoinForRedelegate.value.amount) > 0,
)

const getRewards = async () => {
  try {
    const response = await callers.getDelegationDelegatorReward(
      wallet.account.address,
      props.validator.info.operatorAddress,
    )
    rewards.value = deductFee(response.rewards)
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
}

const deductFee = (rewards: DecCoin[]): DecCoin[] => {
  return rewards.map(item => {
    if (item.denom === COINS_LIST.LOKI) {
      return {
        ...item,
        amount: Number(
          big.subtract(big.fromPrecise(item.amount), fee.value),
        ).toFixed(),
      }
    }
    return item
  })
}

const rewardsPoll = usePoll(getRewards, 5000)
const onSubmit = dialogs.getHandler('onSubmit')
const onClose = preventIf(dialogs.getHandler('onClose'), isLoading)
const submit = async () => {
  isLoading.value = true
  try {
    const amount = availableCoinForRedelegate.value.amount
    const claimTx = await callers.withdrawDelegatorRewards({
      delegatorAddress: wallet.account.address,
      validatorAddress: props.validator.info.operatorAddress,
    })

    let claimedAmount = parseLogsToGetRewardsAmount(
      'withdraw_rewards',
      claimTx.rawLog,
    )
    // if the claim rewards transaction logs could not be parsed,
    // the number of coins with getRewards is used
    if (!claimedAmount) claimedAmount = amount

    await callers.validatorDelegate({
      delegatorAddress: wallet.account.address,
      validatorAddress: props.validator.info.operatorAddress,
      amount: coin(Number(claimedAmount), COINS_LIST.LOKI),
    })
    onSubmit()
    handleNotificationInfo(
      'Successfully redelegated',
      TYPE_NOTIFICATION.success,
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
</script>

<style scoped lang="scss">
.redelegate-form-modal__field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--clr__modal-field-bg);
  border-radius: 0.8rem;
  padding: 1.2rem 1.6rem;
  width: 100%;
  overflow: hidden;
}
.redelegate-form-modal__field-descriptions {
  max-width: 8rem;
}
.redelegate-form-modal__field-info {
  max-width: 17rem;
}
.redelegate-form-modal__field-value {
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
.redelegate-form-modal__field-lbl {
  font-weight: 400;
  line-height: 2rem;
  color: var(--clr__modal-backdrop-bg);
  margin: 0;
  @include ellipsis();
}
</style>

<template>
  <ModalBase class="redelegate-form-modal" @close="onClose">
    <template #title>
      <h3 class="app-form__title">Redelegate</h3>
    </template>

    <template #main>
      <form
        class="app-form load-fog"
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent
      >
        <div class="app-form__main">
          <template v-if="isAvailableCoin">
            <div class="app-form__field">
              <label class="app-form__field-lbl">Available:</label>
              <p :title="$convertLokiToOdin(availableCoinForRedelegate.amount)">
                {{
                  $convertLokiToOdin(availableCoinForRedelegate.amount, {
                    withDenom: true,
                  })
                }}
              </p>
            </div>
          </template>
          <template v-else>
            <div class="app-form__field">
              <label class="app-form__field-lbl">Not enough coins!</label>
            </div>
          </template>
        </div>

        <div class="app-form__footer">
          <button
            class="app-btn w-full app-btn--medium"
            type="button"
            @click="submit"
            :disabled="!isAvailableCoin || isLoading"
          >
            Redelegate
          </button>
        </div>
      </form>
    </template>
  </ModalBase>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  PropType,
  ref,
} from 'vue'
import { callers } from '@/api/callers'
import { wallet } from '@/api/wallet'
import { API_CONFIG, COINS_LIST } from '@/api/api-config'
import { ValidatorDecoded } from '@/helpers/validatorDecoders'
import { DelegationResponse } from 'cosmjs-types/cosmos/staking/v1beta1/staking'
import { Coin, DecCoin } from 'cosmjs-types/cosmos/base/v1beta1/coin'
import { dialogs } from '@/helpers/dialogs'
import { handleError } from '@/helpers/errors'
import { preventIf } from '@/helpers/functions'
import { notifySuccess } from '@/helpers/notifications'
import { usePoll } from '@/composables/usePoll'
import { big } from '@/helpers/bigMath'
import { coin } from '@cosmjs/amino'
import { parseLogsToGetRewardsAmount } from '@/helpers/helpers'
import ModalBase from '@/components/modals/ModalBase.vue'

const defaultBalanceBlank: Coin = { amount: '0', denom: COINS_LIST.LOKI }

export default defineComponent({
  components: { ModalBase },
  props: {
    validator: { type: Object as PropType<ValidatorDecoded>, required: true },
    delegation: { type: Object as PropType<DelegationResponse> },
  },
  setup(props) {
    const isLoading = ref(false)
    const onSubmit = dialogs.getHandler('onSubmit')
    const rewards = ref<DecCoin[]>([])
    const fee = ref(API_CONFIG.fee)

    const availableCoinForRedelegate = computed(() => {
      const reward = rewards.value.find((item) => {
        return item.denom === COINS_LIST.LOKI
      })
      return reward || defaultBalanceBlank
    })
    const isAvailableCoin = computed(
      () => Number(availableCoinForRedelegate.value.amount) >= 0
    )

    const getRewards = async () => {
      try {
        const response = await callers.getDelegationDelegatorReward(
          wallet.account.address,
          props.validator.operatorAddress
        )
        rewards.value = deductFee(response.rewards)
      } catch (error) {
        handleError(error as Error)
      }
    }

    const deductFee = (rewards: DecCoin[]): DecCoin[] => {
      return rewards.map((item) => {
        if (item.denom === COINS_LIST.LOKI) {
          return {
            ...item,
            amount: Number(
              big.subtract(big.fromPrecise(item.amount), fee.value)
            ).toFixed(),
          }
        }
        return item
      })
    }

    const rewardsPoll = usePoll(getRewards, 5000)

    const submit = async () => {
      isLoading.value = true
      try {
        const amount = availableCoinForRedelegate.value.amount
        const claimTx = await callers.withdrawDelegatorRewards({
          delegatorAddress: wallet.account.address,
          validatorAddress: props.validator.operatorAddress,
        })

        let claimedAmount = parseLogsToGetRewardsAmount(
          'withdraw_rewards',
          claimTx.rawLog
        )
        // if the claim rewards transaction logs could not be parsed,
        // the number of coins with getRewards is used
        if (!claimedAmount) claimedAmount = amount

        await callers.validatorDelegate({
          delegatorAddress: wallet.account.address,
          validatorAddress: props.validator.operatorAddress,
          amount: coin(Number(claimedAmount), COINS_LIST.LOKI),
        })
        onSubmit()
        notifySuccess('Successfully redelegated')
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
      availableCoinForRedelegate,
      isAvailableCoin,
      isLoading,
      submit,
      onClose: preventIf(dialogs.getHandler('onClose'), isLoading),
    }
  },
})
</script>

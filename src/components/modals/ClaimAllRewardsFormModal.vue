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
          <template v-if="totalRewards.length">
            <div class="app-form__field">
              <label class="app-form__field-lbl">Your rewards:</label>
              <p v-for="item in totalRewards" :key="item.denom">
                {{
                  $convertLokiToOdin(item.amount, {
                    withDenom: true,
                    withPrecise: true,
                  })
                }}
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
            @click="submit"
            :disabled="!rewards.length || isLoading"
          >
            Claim
          </button>
        </div>
      </form>
    </template>
  </ModalBase>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import { callers } from '@/api/callers'
import { wallet } from '@/api/wallet'
import { dialogs } from '@/helpers/dialogs'
import { handleError } from '@/helpers/errors'
import { usePoll } from '@/composables/usePoll'
import { preventIf } from '@/helpers/functions'
import { notifySuccess } from '@/helpers/notifications'
import { DelegationDelegatorReward } from '@cosmjs/stargate/build/codec/cosmos/distribution/v1beta1/distribution'
import { DecCoin } from 'cosmjs-types/cosmos/base/v1beta1/coin'
import ModalBase from '@/components/modals/ModalBase.vue'

export default defineComponent({
  components: { ModalBase },
  setup() {
    const isLoading = ref(false)
    const onSubmit = dialogs.getHandler('onSubmit')
    const totalRewards = ref<DecCoin[]>([])
    const rewards = ref<DelegationDelegatorReward[]>([])

    const getRewards = async () => {
      try {
        const response = await callers.getDelegationRewards(
          wallet.account.address
        )
        totalRewards.value = response.total
        rewards.value = response.rewards
      } catch (error) {
        handleError(error as Error)
      }
    }

    const rewardsPoll = usePoll(getRewards, 5000)

    const submit = async () => {
      isLoading.value = true
      try {
        await callers.withdrawMultiDelegatorRewards(
          rewards.value.map((item) => ({
            delegatorAddress: wallet.account.address,
            validatorAddress: item.validatorAddress,
          }))
        )
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
      totalRewards,
      rewards,
      isLoading,
      submit,
      onClose: preventIf(dialogs.getHandler('onClose'), isLoading),
    }
  },
})
</script>

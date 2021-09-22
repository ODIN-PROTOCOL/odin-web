<template>
  <div
    class="validators view-main load-fog"
    :class="{ 'load-fog_show': isLoading && validators?.length }"
  >
    <div class="fx-row mg-b32">
      <h2 class="view-title">Validators</h2>
      <button
        class="app-btn app-btn_small fx-sae"
        type="button"
        @click="becomeValidator()"
      >
        Become a validator
      </button>
    </div>
    <template v-if="validators?.length">
      <ValidatorCard
        v-for="item in validators"
        :key="item.operatorAddress"
        class="mg-b32"
        :validator="item"
        :delegation="delegations[item.operatorAddress]"
        @delegationChanged="loadValidators() & loadDelegations()"
      />
    </template>
    <template v-else>
      <p v-if="isLoading">Loading…</p>
      <p v-else>No items yet</p>
    </template>
  </div>
</template>

<script lang="ts">
import { callers } from '@/api/callers'
import { wallet } from '@/api/wallet'
import { showBecomeValidatorFormDialog } from '@/components/modals/BecomeValidatorFormModal.vue'
import ValidatorCard from '@/components/ValidatorCard.vue'
import { handleError } from '@/helpers/errors'
import { DelegationResponse } from '@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/staking'
import { defineComponent, ref } from 'vue'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'

export default defineComponent({
  components: { ValidatorCard },
  setup() {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()

    const validators = ref()
    const loadValidators = async () => {
      lockLoading()
      try {
        const response = await callers.getValidators('BOND_STATUS_BONDED')
        validators.value = response.validators

        console.debug('Validators:', response)
      } catch (error) {
        handleError(error)
      }
      releaseLoading()
    }
    loadValidators()

    const delegations = ref<{ [k: string]: DelegationResponse }>({})
    const loadDelegations = async () => {
      lockLoading()
      try {
        // TODO: delegations returns invalid delegator's amount?
        const response = await callers.getDelegations(wallet.account.address)

        const _delegations: { [k: string]: DelegationResponse } = {}
        for (const delegation of response.delegationResponses) {
          if (!delegation.delegation?.validatorAddress) continue
          _delegations[delegation.delegation.validatorAddress] = delegation
        }
        delegations.value = _delegations

        console.debug('Delegations:', response)
      } catch (error) {
        // error is ignored, since no delegations also throws the error
      }
      releaseLoading()
    }
    loadDelegations()

    const becomeValidator = async () => {
      showBecomeValidatorFormDialog({
        onSubmit: (d) => {
          d.kill()
          loadValidators()
          loadDelegations()
        },
      })
    }

    return {
      validators,
      delegations,
      isLoading,
      becomeValidator,
      loadValidators,
      loadDelegations,
    }
  },
})
</script>

<style scoped></style>

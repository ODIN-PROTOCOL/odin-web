<template>
  <div
    class="validators view-main load-fog"
    :class="{ 'load-fog_show': isLoading && validators?.length }"
  >
    <div class="fx-row mg-b32">
      <h2 class="view-title">Validators</h2>
    </div>

    <template v-if="validatorsCount">
      <div class="validators__count-info">
        <p>{{ validatorsCount }} validators found</p>
      </div>
    </template>

    <template v-if="validators?.length">
      <ValidatorCard
        v-for="item in filteredValidators"
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

    <template v-if="validatorsCount > ITEMS_PER_PAGE">
      <Pagination
        @changePageNumber="paginationHandler($event)"
        :blocksPerPage="ITEMS_PER_PAGE"
        :total-length="validatorsCount"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { callers } from '@/api/callers'
import { wallet } from '@/api/wallet'
import { showBecomeValidatorFormDialog } from '@/components/modals/BecomeValidatorFormModal.vue'
import ValidatorCard from '@/components/ValidatorCard.vue'
import Pagination from '@/components/pagination/pagination.vue'
import { handleError } from '@/helpers/errors'
import { DelegationResponse } from '@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/staking'
import { defineComponent, ref } from 'vue'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'

export default defineComponent({
  components: { ValidatorCard, Pagination },
  setup() {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const ITEMS_PER_PAGE = 3
    const currentPage = ref(1)
    const validatorsCount = ref(0)
    const filteredValidators = ref()
    const validators = ref()

    const loadValidators = async () => {
      lockLoading()
      try {
        const response = await callers.getValidators('BOND_STATUS_BONDED')
        validators.value = response.validators
        validatorsCount.value = response.validators.length
        filterValidators(currentPage.value)
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

    const filterValidators = (newPage: number) => {
      let tempArr = validators.value

      if (newPage === 1) {
        filteredValidators.value = tempArr.slice(0, newPage * ITEMS_PER_PAGE)
      } else {
        filteredValidators.value = tempArr.slice(
          (newPage - 1) * ITEMS_PER_PAGE,
          (newPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        )
      }
      currentPage.value = newPage
    }

    const paginationHandler = (num: number) => {
      filterValidators(num)
    }

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
      ITEMS_PER_PAGE,
      validatorsCount,
      filteredValidators,
      validators,
      delegations,
      isLoading,
      becomeValidator,
      loadValidators,
      loadDelegations,
      paginationHandler,
    }
  },
})
</script>

<style lang="scss" scoped>
.validators__count-info {
  margin-bottom: 3.2rem;

  @media screen and (max-width: 768px) {
    margin-bottom: 0;
  }
}
</style>

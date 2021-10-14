<template>
  <div
    class="validators view-main load-fog"
    :class="{ 'load-fog_show': isLoading && validators?.length }"
  >
    <div class="fx-row mg-b32">
      <h2 class="view-title">All Validators</h2>
    </div>

    <template v-if="validatorsCount">
      <div class="validators__count-info">
        <p>{{ validatorsCount }} validators found</p>
      </div>
    </template>

    <!-- <template v-if="validators?.length">
      <ValidatorCard
        v-for="item in filteredValidators"
        :key="item.operatorAddress"
        class="mg-b32"
        :validator="item"
        :delegation="delegations[item.operatorAddress]"
        @delegationChanged="getValidators() & getDelegations()"
      />
    </template> -->
    <Tabs @changeTab="tabHandler($event)">
      <Tab title="Active" />
      <Tab title="Inactive" />
    </Tabs>

    <div class="app-table">
      <div class="app-table__head">
        <span>Rank</span>
        <span>Validator</span>
        <span>Delegator Share</span>
        <span>Commission</span>
        <span>Oracle Status</span>
        <span></span>
      </div>
      <div class="app-table__body">
        <template v-if="validators?.length">
          <div
            v-for="item in filteredValidators"
            :key="item.operatorAddress"
            class="app-table__row"
          >
            <div class="app-table__cell">
              <span class="app-table__title">Rank</span>
              <span>{{ item.rank }}</span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Validator</span>
              <TitledLink
                class="app-table__cell-txt app-table__link"
                :text="item.operatorAddress"
                :to="`/validators/${item.operatorAddress}`"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Delegator Share</span>
              <span>{{ $preciseAsPercents(item.delegatorShares) }}</span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Commission</span>
              <span>
                {{ $preciseAsPercents(item.commission.commissionRates.rate) }}
              </span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Oracle Status</span>
              <StatusIcon
                :status="item.isOracleValidator ? 'success' : 'error'"
              />
            </div>
            <div class="app-table__cell">
              <div class="app-table__activities">
                <div class="app-table__activities-item">
                  <button
                    class="app-btn app-btn_outlined app-btn_small"
                    type="button"
                    @click="withdraw(item)"
                  >
                    Withdraw stake
                  </button>
                  <button
                    class="app-btn app-btn_small mg-l24"
                    type="button"
                    @click="delegate(item)"
                  >
                    Delegate
                  </button>
                </div>
                <div
                  v-if="delegations[item.operatorAddress]"
                  class="app-table__activities-item"
                >
                  <button
                    class="app-btn app-btn_outlined app-btn_small"
                    type="button"
                    @click="undelegate"
                  >
                    Undelegate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <p v-if="isLoading">Loading…</p>
          <p v-else>No items yet</p>
        </template>
      </div>
    </div>

    <template v-if="validatorsCount > ITEMS_PER_PAGE">
      <Pagination
        @changePageNumber="paginationHandler($event)"
        :blocksPerPage="ITEMS_PER_PAGE"
        :total-length="validatorsCount"
        :startFrom="currentPage"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { callers } from '@/api/callers'
import { wallet } from '@/api/wallet'
import { handleError } from '@/helpers/errors'
import { ValidatorDecoded } from '@/helpers/validatorDecoders'
import { DelegationResponse } from '@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/staking'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { showBecomeValidatorFormDialog } from '@/components/modals/BecomeValidatorFormModal.vue'
// import ValidatorCard from '@/components/ValidatorCard.vue'
import Tabs from '@/components/tabs/Tabs.vue'
import Tab from '@/components/tabs/Tab.vue'
import TitledLink from '@/components/TitledLink.vue'
import StatusIcon from '@/components/StatusIcon.vue'
import Pagination from '@/components/pagination/pagination.vue'
import { showWithdrawFormDialog } from '@/components/modals/WithdrawFormModal.vue'
import { showDelegateFormDialog } from '@/components/modals/DelegateFormModal.vue'
import { showUndelegateFormDialog } from '@/components/modals/UndelegateFormModal.vue'

export default defineComponent({
  components: { Tabs, Tab, TitledLink, StatusIcon, Pagination },
  setup() {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const ITEMS_PER_PAGE = 6
    const currentPage = ref(1)
    const validatorsStatus = ref('Active')
    const validatorsCount = ref(0)
    const filteredValidators = ref()
    const validators = ref()

    const getValidators = async () => {
      lockLoading()
      try {
        let _validators: ValidatorDecoded[] = []

        if (validatorsStatus.value === 'Active') {
          const bonded = await callers.getValidators('BOND_STATUS_BONDED')
          const unbonding = await callers.getValidators('BOND_STATUS_UNBONDING')
          _validators = [...bonded.validators, ...unbonding.validators]
        } else if (validatorsStatus.value === 'Inactive') {
          const unbonded = await callers.getValidators('BOND_STATUS_UNBONDED')
          _validators = [...unbonded.validators]
        }

        validators.value = await Promise.all(
          _validators.map(async (item, idx) => {
            return {
              ...item,
              rank: idx + 1,
              isOracleValidator: await isOracleValidator(item.operatorAddress),
            }
          })
        )

        validatorsCount.value = _validators.length
        filterValidators(currentPage.value)
      } catch (error) {
        handleError(error)
      }
      releaseLoading()
    }

    const delegations = ref<{ [k: string]: DelegationResponse }>({})
    const getDelegations = async () => {
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

    const isOracleValidator = async (validatorAddress: string) => {
      const response = await callers.getReports(validatorAddress)
      return response.reporter.length ? true : false
    }

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

    const tabHandler = async (title: string) => {
      if (title !== validatorsStatus.value) {
        validatorsStatus.value = title
        currentPage.value = 1
        await getValidators()
      }
    }

    const becomeValidator = async () => {
      showBecomeValidatorFormDialog({
        onSubmit: (d) => {
          d.kill()
          getValidators()
          getDelegations()
        },
      })
    }

    const withdraw = (validator: ValidatorDecoded) => {
      showWithdrawFormDialog({
        onSubmit: (d) => {
          d.kill()
          console.log(validator)
        },
      })
    }

    const delegate = (validator: ValidatorDecoded) => {
      showDelegateFormDialog(
        {
          onSubmit: (d) => {
            d.kill()
            getValidators()
            getDelegations()
          },
        },
        { validator, delegation: delegations.value[validator.operatorAddress] }
      )
    }

    const undelegate = (validator: ValidatorDecoded) => {
      if (!delegations.value[validator.operatorAddress]) return
      showUndelegateFormDialog(
        {
          onSubmit: (d) => {
            d.kill()
            getValidators()
            getDelegations()
          },
        },
        { validator, delegation: delegations.value[validator.operatorAddress] }
      )
    }

    onMounted(async () => {
      await getValidators()
      await getDelegations()
    })

    return {
      ITEMS_PER_PAGE,
      currentPage,
      validatorsCount,
      filteredValidators,
      validators,
      delegations,
      isLoading,
      getValidators,
      getDelegations,
      paginationHandler,
      tabHandler,
      becomeValidator,
      withdraw,
      delegate,
      undelegate,
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

.app-table__head,
.app-table__row {
  grid:
    auto /
    minmax(3rem, 1fr)
    minmax(8rem, 4fr)
    minmax(8rem, 4fr)
    minmax(8rem, 4fr)
    minmax(8rem, 4fr)
    minmax(28.5rem, 4fr);
}

.app-table__activities {
  & > *:not(:last-child) {
    margin-bottom: 2.4rem;
  }
}

@media screen and (max-width: 768px) {
  .app-table__row {
    grid: none;
  }

  .app-table__activities {
    width: 100%;

    &-item {
      display: flex;

      & > * {
        flex: 1;
      }
    }
  }
}
</style>

<template>
  <div
    class="validators view-main load-fog"
    :class="{ 'load-fog_show': isLoading && validators?.length }"
  >
    <div class="page-title">
      <h2 class="view-title">All Validators</h2>
      <button
        class="
          app-btn app-btn_small
          become-validator-btn become-validator-btn_top
          fx-sae
        "
        type="button"
        @click="becomeValidator()"
      >
        Become a validator
      </button>
    </div>

    <template v-if="validatorsCount">
      <div class="validators__count-info">
        <p>{{ validatorsCount }} validators found</p>
      </div>
    </template>

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
                :text="item.description.moniker"
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
            <div class="app-table__cell" style="display: flex; justify-content: flex-end;">
              <div class="app-table__activities">
                <div class="app-table__activities-item">
                  <!--TEMP. Hide all unnecessary -->
                  <!-- <button
                    class="app-btn app-btn_outlined app-btn_small"
                    type="button"
                    @click="withdraw(item)"
                  >
                    Withdraw stake
                  </button> -->
                  <button
                    class="app-btn app-btn_small mg-l24 w-min150"
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
                    class="app-btn app-btn_outlined app-btn_small w-min150"
                    type="button"
                    @click="undelegate(item)"
                  >
                    Undelegate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="app-table__empty-stub">
            <p v-if="isLoading">Loading…</p>
            <p v-else>No items yet</p>
          </div>
        </template>
      </div>
    </div>

    <template v-if="filteredValidatorsCount > ITEMS_PER_PAGE">
      <Pagination
        @changePageNumber="paginationHandler($event)"
        :blocksPerPage="ITEMS_PER_PAGE"
        :total-length="filteredValidatorsCount"
        :startFrom="currentPage"
      />
    </template>

    <button
      class="
        app-btn app-btn_small
        become-validator-btn become-validator-btn_bottom
        fx-sae
      "
      type="button"
      @click="becomeValidator()"
    >
      Become a validator
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { callers } from '@/api/callers'
import { wallet } from '@/api/wallet'
import { handleError } from '@/helpers/errors'
import { getTransformedValidators } from '@/helpers/validatorHelpers'
import { ValidatorDecoded } from '@/helpers/validatorDecoders'
import { DelegationResponse } from '@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/staking'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import Tabs from '@/components/tabs/Tabs.vue'
import Tab from '@/components/tabs/Tab.vue'
import TitledLink from '@/components/TitledLink.vue'
import StatusIcon from '@/components/StatusIcon.vue'
import Pagination from '@/components/pagination/pagination.vue'
import { showWithdrawFormDialog } from '@/components/modals/WithdrawFormModal.vue'
import { showDelegateFormDialog } from '@/components/modals/DelegateFormModal.vue'
import { showUndelegateFormDialog } from '@/components/modals/UndelegateFormModal.vue'
import { showBecomeValidatorFormDialog } from '@/components/modals/BecomeValidatorFormModal.vue'
// import { showBecomeValidatorInfoModal } from '@/components/modals/BecomeValidatorInfoModal.vue'

export default defineComponent({
  components: { Tabs, Tab, TitledLink, StatusIcon, Pagination },
  setup() {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const ITEMS_PER_PAGE = 6
    const currentPage = ref(1)
    const validatorsStatus = ref('Active')
    const filteredValidatorsCount = ref(0)
    const validatorsCount = ref(0)
    const filteredValidators = ref()
    const validators = ref()

    let activeValidators: ValidatorDecoded[] = []
    let inactiveValidators: ValidatorDecoded[] = []

    const getValidators = async () => {
      lockLoading()
      try {
        const bonded = await callers.getValidators('BOND_STATUS_BONDED')
        const unbonding = await callers.getValidators('BOND_STATUS_UNBONDING')
        const unbonded = await callers.getValidators('BOND_STATUS_UNBONDED')

        activeValidators = await getTransformedValidators([
          ...bonded.validators,
          ...unbonding.validators,
        ])
        inactiveValidators = await getTransformedValidators([
          ...unbonded.validators,
        ])

        if (validatorsStatus.value === 'Active') {
          validators.value = [...activeValidators]
        } else if (validatorsStatus.value === 'Inactive') {
          validators.value = [...inactiveValidators]
        }

        validatorsCount.value =
          activeValidators.length + inactiveValidators.length
        filteredValidatorsCount.value = validators.value.length
        filterValidators(currentPage.value)
      } catch (error) {
        handleError(error as Error)
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
        delegations.value = {}
      }
      releaseLoading()
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

        if (validatorsStatus.value === 'Active') {
          validators.value = [...activeValidators]
        } else if (validatorsStatus.value === 'Inactive') {
          validators.value = [...inactiveValidators]
        }

        filteredValidatorsCount.value = validators.value.length
        currentPage.value = 1
        filterValidators(currentPage.value)
      }
    }

    // TODO: delete if become a validator modal works fine
    // const becomeValidator = () => {
    //   showBecomeValidatorInfoModal({})
    // }

    const becomeValidator = async () => {
      showBecomeValidatorFormDialog({
        onSubmit: (d) => {
          d.kill()
          getDelegations()
          getValidators()
        },
      })
    }

    const withdraw = (validator: ValidatorDecoded) => {
      showWithdrawFormDialog(
        {
          onSubmit: (d) => {
            d.kill()
            getValidators()
            getDelegations()
          },
        },
        { validator }
      )
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
      filteredValidatorsCount,
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
    minmax(8rem, 2fr)
    minmax(8rem, 2fr)
    minmax(32.5rem, 4fr);
}

.app-table__activities {
  &-item {
    display: flex;
    justify-content: flex-end;
  }

  & > *:not(:last-child) {
    margin-bottom: 2.4rem;
  }
}

.become-validator-btn {
  &_bottom {
    display: none;
    width: 100%;
    @media screen and (max-width: 768px) {
      display: block;
    }
  }
  &_top {
    display: block;
    @media screen and (max-width: 768px) {
      display: none;
    }
  }
}

@media screen and (max-width: 768px) {
  .app-table__row {
    grid: none;
  }

  .app-table__activities {
    width: 100%;

    &-item {
      & > * {
        flex: 1;
      }
    }
  }
}
</style>

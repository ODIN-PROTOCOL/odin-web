<template>
  <div
    class="view-main validators load-fog"
    :class="{
      'load-fog_show': isLoading && validators?.length,
      'validators--large-padding': isDelegator,
    }"
  >
    <div class="view-main__title-wrapper validators__title-wrapper">
      <h2 class="view-main__title">All Validators</h2>
      <div class="validators__title-activities fx-sae">
        <button
          class="validators__title-btn app-btn app-btn_small"
          type="button"
          @click="becomeValidator()"
        >
          Become a validator
        </button>
        <button
          v-if="isDelegator"
          class="validators__title-btn app-btn app-btn_small"
          type="button"
          @click="claimAllRewards"
        >
          Claim all rewards
        </button>
      </div>
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

    <div class="app-table validators__table">
      <div class="app-table__head validators__table-head">
        <span class="validators__table-head-item">Rank</span>
        <span class="validators__table-head-item">Validator</span>
        <span class="validators__table-head-item"> Delegated </span>
        <span class="validators__table-head-item"> Commission </span>
        <span class="validators__table-head-item"> Uptime </span>
        <span class="validators__table-head-item"> Oracle Status </span>
        <span class="validators__table-head-item"></span>
      </div>
      <div class="app-table__body">
        <template v-if="validators?.length">
          <div
            v-for="item in filteredValidators"
            :key="item.operatorAddress"
            class="app-table__row validators__table-row"
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
            <div class="app-table__cell app-table__cell-txt">
              <span class="app-table__title">Delegated</span>
              <span
                :title="
                  $convertLokiToOdin(item.delegatorShares, {
                    withDenom: true,
                    withPrecise: true,
                    forTitle: true,
                  })
                "
              >
                {{
                  $convertLokiToOdin(item.delegatorShares, {
                    withDenom: true,
                    withPrecise: true,
                  })
                }}
              </span>
            </div>
            <div class="app-table__cell validators__table-cell--center">
              <span class="app-table__title">Commission</span>
              <span>
                {{ $getPrecisePercents(item.commission.commissionRates.rate) }}
              </span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Uptime</span>
              <Progressbar
                v-if="item.uptimeInfo.uptime"
                :min="0"
                :max="100"
                :current="Number(item.uptimeInfo.uptime) || 0"
                :forValidators="true"
              />
              <span v-else>N/A</span>
            </div>
            <div class="app-table__cell validators__table-cell--center">
              <span class="app-table__title">Oracle Status</span>
              <StatusIcon :status="item?.isActive ? 'success' : 'error'" />
            </div>
            <div class="app-table__cell">
              <div class="app-table__activities validators__table-activities">
                <div
                  class="app-table__activities-item validators__table-activities-item"
                >
                  <button
                    v-if="delegations[item.operatorAddress]"
                    class="app-btn app-btn_outlined app-btn--very-small w-min108"
                    type="button"
                    @click="redelegate(item)"
                  >
                    Redelegate
                  </button>
                  <button
                    class="app-btn app-btn--very-small w-min108"
                    type="button"
                    @click="delegate(item)"
                  >
                    Delegate
                  </button>
                </div>
                <div
                  v-if="delegations[item.operatorAddress]"
                  class="app-table__activities-item validators__table-activities-item"
                >
                  <button
                    class="app-btn app-btn_outlined app-btn--very-small w-min108"
                    type="button"
                    @click="withdrawRewards(item)"
                  >
                    Claim rewards
                  </button>
                  <button
                    class="app-btn app-btn_outlined app-btn--very-small w-min108"
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
      <AppPagination
        class="mg-t32"
        v-model="currentPage"
        :pages="totalPages"
        @update:modelValue="paginationHandler"
      />
    </template>

    <div class="view-main__mobile-activities validators__mobile-activities">
      <button class="app-btn w-full" type="button" @click="becomeValidator()">
        Become a validator
      </button>
      <button
        v-if="isDelegator"
        class="app-btn w-full"
        type="button"
        @click="claimAllRewards"
      >
        Claim all rewards
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { callers } from '@/api/callers'
import { wallet } from '@/api/wallet'
import { COINS_LIST } from '@/api/api-config'
import { handleError } from '@/helpers/errors'
import { getTransformedValidators } from '@/helpers/validatorHelpers'
import { ValidatorDecoded } from '@/helpers/validatorDecoders'
import { DelegationResponse } from 'cosmjs-types/cosmos/staking/v1beta1/staking'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import Tabs from '@/components/tabs/Tabs.vue'
import Tab from '@/components/tabs/Tab.vue'
import TitledLink from '@/components/TitledLink.vue'
import StatusIcon from '@/components/StatusIcon.vue'
import AppPagination from '@/components/AppPagination/AppPagination.vue'

import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import WithdrawRewardsFormModal from '@/components/modals/WithdrawRewardsFormModal.vue'
import DelegateFormModal from '@/components/modals/DelegateFormModal.vue'
import UndelegateFormModal from '@/components/modals/UndelegateFormModal.vue'
import BecomeValidatorFormModal from '@/components/modals/BecomeValidatorFormModal.vue'
import ClaimAllRewardsFormModal from '@/components/modals/ClaimAllRewardsFormModal.vue'
import RedelegateFormModal from '@/components/modals/RedelegateFormModal.vue'
import { isActiveValidator } from '@/helpers/validatorHelpers'
import Progressbar from '@/components/Progressbar.vue'

export default defineComponent({
  components: { Tabs, Tab, TitledLink, StatusIcon, AppPagination, Progressbar },
  setup() {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const ITEMS_PER_PAGE = 50
    const currentPage = ref(1)
    const totalPages = ref()
    const validatorsStatus = ref('Active')
    const filteredValidatorsCount = ref(0)
    const validatorsCount = ref(0)
    const filteredValidators = ref()
    const validators = ref()
    const delegations = ref<{ [k: string]: DelegationResponse }>({})
    const isDelegator = computed(
      () => Object.keys(delegations.value).length !== 0
    )

    let activeValidators: ValidatorDecoded[] = []
    let inactiveValidators: ValidatorDecoded[] = []

    const getValidators = async () => {
      lockLoading()
      try {
        const bonded = await callers.getValidators('BOND_STATUS_BONDED')
        const unbonding = await callers.getValidators('BOND_STATUS_UNBONDING')
        const unbonded = await callers.getValidators('BOND_STATUS_UNBONDED')

        const allUptime = await callers
          .getValidatorUptime()
          .then((resp) => resp.json())

        activeValidators = await Promise.all(
          await getTransformedValidators([
            ...bonded.validators,
            ...unbonding.validators,
          ]).then((validators) =>
            validators.map(async (item) => {
              return {
                ...item,
                isActive: await isActiveValidator(item.operatorAddress),
                uptimeInfo: allUptime.find(
                  (name: { operator_address: string }) =>
                    name.operator_address === item.operatorAddress
                ),
              }
            })
          )
        )

        inactiveValidators = await Promise.all(
          await getTransformedValidators([...unbonded.validators]).then(
            (validators) =>
              validators.map(async (item) => {
                return {
                  ...item,
                  isActive: await isActiveValidator(item.operatorAddress),
                  uptimeInfo: allUptime.find(
                    (name: { operator_address: string }) =>
                      name.operator_address === item.operatorAddress
                  ),
                }
              })
          )
        )

        if (validatorsStatus.value === 'Active') {
          validators.value = [...activeValidators]
        } else if (validatorsStatus.value === 'Inactive') {
          validators.value = [...inactiveValidators]
        }

        validatorsCount.value =
          activeValidators.length + inactiveValidators.length
        filteredValidatorsCount.value = validators.value.length
        totalPages.value = Math.ceil(
          filteredValidatorsCount.value / ITEMS_PER_PAGE
        )
        filterValidators(currentPage.value)
      } catch (error) {
        handleError(error as Error)
      }
      releaseLoading()
    }

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
        totalPages.value = Math.ceil(
          filteredValidatorsCount.value / ITEMS_PER_PAGE
        )
        currentPage.value = 1
        filterValidators(currentPage.value)
      }
    }

    const loadData = async () => {
      await getDelegations()
      await getValidators()
    }

    const becomeValidator = async () => {
      await showDialogHandler(BecomeValidatorFormModal, {
        onSubmit: async (d) => {
          d.kill()
          await loadData()
        },
      })
    }

    const claimAllRewards = async () => {
      await showDialogHandler(ClaimAllRewardsFormModal, {
        onSubmit: async (d) => {
          d.kill()
          await loadData()
        },
      })
    }

    const withdrawRewards = async (validator: ValidatorDecoded) => {
      if (!delegations.value[validator.operatorAddress]) return
      await showDialogHandler(
        WithdrawRewardsFormModal,
        {
          onSubmit: async (d) => {
            d.kill()
            await loadData()
          },
        },
        { validator }
      )
    }

    const delegate = async (validator: ValidatorDecoded) => {
      await showDialogHandler(
        DelegateFormModal,
        {
          onSubmit: async (d) => {
            d.kill()
            await loadData()
          },
        },
        { validator, delegation: delegations.value[validator.operatorAddress] }
      )
    }

    const redelegate = async (validator: ValidatorDecoded) => {
      await showDialogHandler(
        RedelegateFormModal,
        {
          onSubmit: async (d) => {
            d.kill()
            await loadData()
          },
        },
        { validator, delegation: delegations.value[validator.operatorAddress] }
      )
    }

    const undelegate = async (validator: ValidatorDecoded) => {
      if (!delegations.value[validator.operatorAddress]) return
      await showDialogHandler(
        UndelegateFormModal,
        {
          onSubmit: async (d) => {
            d.kill()
            await loadData()
          },
        },
        { validator, delegation: delegations.value[validator.operatorAddress] }
      )
    }

    onMounted(async () => {
      await loadData()
    })

    return {
      COINS_LIST,
      ITEMS_PER_PAGE,
      totalPages,
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
      withdrawRewards,
      claimAllRewards,
      delegate,
      redelegate,
      undelegate,
      isDelegator,
    }
  },
})
</script>

<style lang="scss" scoped>
.validators {
  padding-bottom: 10rem;
}
.validators__title-wrapper {
  align-items: flex-start;
}

.validators__title-activities {
  display: flex;
  flex-direction: column;

  & > *:not(:last-child) {
    margin-bottom: 1.6rem;
  }
}

.validators__count-info {
  margin-bottom: 3.2rem;
}

.validators__table-head,
.validators__table-row {
  gap: 3.4rem;
  grid:
    auto /
    minmax(2rem, 5rem)
    minmax(5rem, 1fr)
    minmax(6rem, 0.5fr)
    minmax(8rem, 0.5fr)
    minmax(7rem, 1fr)
    minmax(6rem, 8rem)
    minmax(24rem, 1.5fr);
}
.validators__table-row {
  padding: 3.2rem 0 2rem;
}
.validators__table-activities {
  width: 100%;

  & > *:not(:last-child) {
    margin-bottom: 1.6rem;
  }
}

.validators__table-activities-item {
  display: flex;
  justify-content: flex-end;
  gap: 1.6rem;
}

.validators__table-cell--center {
  justify-content: center;
}

.validators__table-head-item--center {
  text-align: center;
}
.validators__table-head-item--end {
  text-align: end;
}

.validators__mobile-activities {
  & > *:not(:last-child) {
    margin-bottom: 1.6rem;
  }
}

.validators--large-padding {
  padding-bottom: 17rem;
}
@include respond-to(medium) {
  .validators__table-head,
  .validators__table-row {
    gap: 1.6rem;
  }
}
@include respond-to(tablet) {
  .validators__count-info {
    margin-bottom: 0;
  }

  .validators__title-activities {
    display: none;
  }

  .validators__table-row {
    grid: none;
  }

  .validators__table-activities {
    width: 100%;
  }

  .validators__table-activities-item {
    & > * {
      flex: 1;
    }
  }

  .validators__table-cell--center {
    justify-content: flex-start;
  }

  .validators__table-head--center {
    text-align: start;
  }
  .validators__table-head--end {
    text-align: start;
  }
}
</style>

<template>
  <div
    class="view-main validators"
    :class="{
      'validators--large-padding': isDelegator,
    }"
  >
    <div class="view-main__title-wrapper">
      <h2 class="view-main__title">All Validators</h2>
      <div class="validators__title-btn-wrraper">
        <button
          class="validators__title-btn app-btn app-btn--medium"
          type="button"
          @click="becomeValidator()"
        >
          Become a validator
        </button>
        <button
          v-if="isDelegator && delegations && validators"
          class="validators__title-btn app-btn app-btn--medium"
          type="button"
          @click="stakeTransfer"
        >
          Stake transfer
        </button>
        <button
          v-if="isDelegator && delegations && validators"
          class="validators__title-btn--white app-btn app-btn--medium"
          type="button"
          @click="claimAllRewards"
        >
          Claim all rewards
        </button>
      </div>
    </div>

    <div class="validators__count-info">
      <skeleton-loader
        v-if="isLoading"
        :height="24"
        :rounded="true"
        animation="wave"
        color="rgb(225, 229, 233)"
      />
      <p v-else>{{ validatorsCount }} validators found</p>
    </div>
    <div class="validators__filter">
      <div class="validators__tabs">
        <button
          v-if="isDisabledDelegationsTab"
          @click="selectTab(myValidatorsTitle)"
          class="validators__tab"
          :class="{
            selected: myValidatorsTitle === tabStatus,
          }"
        >
          {{ myValidatorsTitle }}
        </button>
        <button
          @click="selectTab(activeValidatorsTitle)"
          class="validators__tab"
          :class="{
            selected: activeValidatorsTitle === tabStatus,
          }"
        >
          {{ activeValidatorsTitle }}
        </button>
        <button
          @click="selectTab(inactiveValidatorsTitle)"
          class="validators__tab"
          :class="{
            selected: inactiveValidatorsTitle === tabStatus,
          }"
        >
          {{ inactiveValidatorsTitle }}
        </button>
      </div>
      <div class="validators__filter-search">
        <div class="validators__filter-search-input-wrapper">
          <InputField
            v-model="searchValue"
            placeholder="Search validator"
            class="validators__filter-search-input"
            @keydown.enter="filterValidators()"
          />
        </div>
        <button
          class="validators__filter-search-button"
          @click="filterValidators()"
        >
          <SearchIcon />
        </button>
      </div>
    </div>
    <div
      class="app-table validators__table"
      :class="{
        'validators__table--inactive': tabStatus === inactiveValidatorsTitle,
      }"
    >
      <div class="app-table__head validators__table-head">
        <span class="validators__table-head-item">Rank</span>
        <span class="validators__table-head-item">Validator</span>
        <span class="validators__table-head-item">Delegated</span>
        <span class="validators__table-head-item">Commission</span>
        <span
          v-if="tabStatus !== inactiveValidatorsTitle"
          class="validators__table-head-item"
        >
          Uptime
        </span>
        <span
          class="validators__table-head-item validators__table-head-item--center"
          >Status</span
        >
        <span class="validators__table-head-item"></span>
      </div>
      <div class="app-table__body">
        <template v-if="filteredValidators?.length">
          <template v-if="windowInnerWidth > 768">
            <ValidatorsTable
              v-for="validator in filteredValidators"
              :key="validator.operatorAddress"
              @selectedBtn="openModal"
              :validator="validator"
              :tabStatus="tabStatus"
              :inactiveValidatorsTitle="inactiveValidatorsTitle"
              :delegations="delegations"
            />
          </template>
          <template v-else>
            <ValidatorsTableMobile
              v-for="validator in filteredValidators"
              :key="validator.operatorAddress"
              @selectedBtn="openModal"
              :validator="validator"
              :tabStatus="tabStatus"
              :inactiveValidatorsTitle="inactiveValidatorsTitle"
              :delegations="delegations"
            />
          </template>
        </template>
        <template v-else>
          <SkeletonTable
            v-if="isLoading"
            :header-titles="headerTitles"
            class-string="validators__table-row"
          />
          <div v-else class="app-table__empty-stub">
            <p class="empty mg-t32">No items yet</p>
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
      <button
        class="app-btn w-full app-btn--medium"
        type="button"
        @click="becomeValidator()"
      >
        Become a validator
      </button>
      <button
        v-if="isDelegator && delegations && validators"
        class="app-btn w-full app-btn--medium"
        type="button"
        @click="stakeTransfer"
      >
        Stake transfer
      </button>
      <button
        v-if="isDelegator && delegations && validators"
        class="validators__title-btn--white app-btn w-full app-btn--medium"
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
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { getTransformedValidators } from '@/helpers/validatorHelpers'
import { ValidatorDecoded } from '@/helpers/validatorDecoders'
import { DelegationResponse } from 'cosmjs-types/cosmos/staking/v1beta1/staking'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import AppPagination from '@/components/AppPagination/AppPagination.vue'

import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import WithdrawRewardsFormModal from '@/components/modals/WithdrawRewardsFormModal.vue'
import DelegateFormModal from '@/components/modals/DelegateFormModal.vue'
import UndelegateFormModal from '@/components/modals/UndelegateFormModal.vue'
import BecomeValidatorFormModal from '@/components/modals/BecomeValidatorFormModal.vue'
import StakeTransferFormModal from '@/components/modals/StakeTransferFormModal.vue'
import ClaimAllRewardsFormModal from '@/components/modals/ClaimAllRewardsFormModal.vue'
import RedelegateFormModal from '@/components/modals/RedelegateFormModal.vue'
import { isActiveValidator } from '@/helpers/validatorHelpers'
import InputField from '@/components/fields/InputField.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import SkeletonTable from '@/components/SkeletonTable.vue'
import ValidatorsTableMobile from '@/components/ValidatorsTableMobile.vue'
import ValidatorsTable from '@/components/ValidatorsTable.vue'

export default defineComponent({
  components: {
    AppPagination,
    InputField,
    SearchIcon,
    SkeletonTable,
    ValidatorsTableMobile,
    ValidatorsTable,
  },
  setup() {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const ITEMS_PER_PAGE = 50
    const currentPage = ref(1)
    const totalPages = ref()
    const filteredValidatorsCount = ref(0)
    const validatorsCount = ref(0)
    const filteredValidators = ref()
    const validators = ref()
    const delegations = ref<{ [k: string]: DelegationResponse }>({})
    const isDelegator = computed(
      () => Object.keys(delegations.value).length !== 0
    )
    const activeValidators = ref<ValidatorDecoded[]>([])
    const inactiveValidators = ref<ValidatorDecoded[]>([])
    const allValitors = ref<ValidatorDecoded[]>([])
    const delegatedAdress = ref<string[]>([])
    const activeValidatorsTitle = computed(() =>
      activeValidators.value?.length
        ? `Active (${activeValidators.value?.length})`
        : 'Active'
    )
    const myValidatorsTitle = computed(() =>
      activeValidators.value?.length
        ? `My delegations (${myDelegationsValitors.value?.length})`
        : 'My delegations'
    )
    const myDelegationsValitors = computed(() =>
      delegatedAdress.value.map((validatorAddress: string) => {
        return {
          ...allValitors.value.find(
            (validator: ValidatorDecoded) =>
              validator.operatorAddress === validatorAddress
          ),
        }
      })
    )
    const windowInnerWidth = ref(document.documentElement.clientWidth)
    const updateWidth = () => {
      windowInnerWidth.value = document.documentElement.clientWidth
    }
    const inactiveValidatorsTitle = ref('Inactive')
    const tabStatus = ref(activeValidatorsTitle.value)
    const searchValue = ref('')
    const isDisabledDelegationsTab = computed(() =>
      Boolean(myDelegationsValitors.value.length)
    )
    const headerTitles = computed(() => {
      if (windowInnerWidth.value > 768) {
        return [
          { title: 'Rank' },
          { title: 'Validator' },
          { title: 'Delegated' },
          { title: 'Commission' },
          { title: 'Uptime' },
          { title: 'Oracle Status' },
        ]
      } else {
        return [{ title: '' }, { title: 'Delegated' }]
      }
    })
    const getValidators = async () => {
      lockLoading()
      try {
        const bonded = await callers.getValidators('BOND_STATUS_BONDED')
        const unbonding = await callers.getValidators('BOND_STATUS_UNBONDING')
        const unbonded = await callers.getValidators('BOND_STATUS_UNBONDED')
        const allUptime = await callers
          .getValidatorUptime()
          .then((resp) => resp.json())

        activeValidators.value = await Promise.all(
          await getTransformedValidators([...bonded.validators]).then(
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

        inactiveValidators.value = await Promise.all(
          await getTransformedValidators([
            ...unbonded.validators,
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
        allValitors.value = [
          ...inactiveValidators.value,
          ...activeValidators.value,
        ]
        validators.value = isDisabledDelegationsTab.value
          ? [...myDelegationsValitors.value]
          : [...activeValidators.value]
        tabStatus.value = isDisabledDelegationsTab.value
          ? myValidatorsTitle.value
          : activeValidatorsTitle.value
        validatorsCount.value =
          activeValidators.value.length + inactiveValidators.value.length
        filterValidators(currentPage.value)
      } catch (error) {
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
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
        delegatedAdress.value = Object.keys(delegations.value)
        tabStatus.value = isDisabledDelegationsTab.value
          ? myValidatorsTitle.value
          : activeValidatorsTitle.value
      } catch (error) {
        // error is ignored, since no delegations also throws the error
        delegations.value = {}
        tabStatus.value = activeValidatorsTitle.value
      }
      releaseLoading()
    }

    const filterValidators = (newPage = 1) => {
      let tempArr = validators.value
      if (searchValue.value.trim()) {
        tempArr = tempArr.filter((item: { description: { moniker: string } }) =>
          item.description.moniker
            .toLowerCase()
            .includes(searchValue.value.toLowerCase())
        )
      }
      if (newPage === 1) {
        filteredValidators.value = tempArr?.slice(0, newPage * ITEMS_PER_PAGE)
      } else {
        filteredValidators.value = tempArr?.slice(
          (newPage - 1) * ITEMS_PER_PAGE,
          (newPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        )
      }
      filteredValidatorsCount.value = tempArr.length
      totalPages.value = Math.ceil(
        filteredValidatorsCount.value / ITEMS_PER_PAGE
      )
      currentPage.value = newPage
    }

    const paginationHandler = (num: number) => {
      filterValidators(num)
    }
    const selectTab = async (title: string) => {
      if (title !== tabStatus.value) {
        tabStatus.value = title
        if (tabStatus.value === activeValidatorsTitle.value) {
          validators.value = [...activeValidators.value]
        } else if (tabStatus.value === inactiveValidatorsTitle.value) {
          validators.value = [...inactiveValidators.value]
        } else if (tabStatus.value === myValidatorsTitle.value) {
          validators.value = [...myDelegationsValitors.value]
        }
        filterValidators(1)
      }
    }
    const validatorStatus = (validator: {
      status: number
      isActive: boolean
    }) => {
      if (validator.status === 3) {
        return validator.isActive ? 'success' : 'error'
      } else {
        return 'inactive'
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

    const stakeTransfer = async () => {
      if (!delegations.value) return
      await showDialogHandler(
        StakeTransferFormModal,
        {
          onSubmit: async (d) => {
            d.kill()
            await loadData()
          },
        },
        {
          validators: activeValidators.value,
          delegation: delegations.value,
        }
      )
    }
    const openModal = (event: {
      typeBtn: string
      validator: ValidatorDecoded
    }) => {
      if (event.typeBtn === 'Delegate') {
        delegate(event.validator)
      } else if (event.typeBtn === 'Regelate') {
        redelegate(event.validator)
      } else if (event.typeBtn === 'Claim rewards') {
        withdrawRewards(event.validator)
      } else if (event.typeBtn === 'Undelegate') {
        undelegate(event.validator)
      }
    }
    onMounted(async () => {
      window.addEventListener('resize', updateWidth)
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
      selectTab,
      becomeValidator,
      withdrawRewards,
      claimAllRewards,
      delegate,
      redelegate,
      undelegate,
      isDelegator,
      activeValidatorsTitle,
      inactiveValidatorsTitle,
      searchValue,
      filterValidators,
      stakeTransfer,
      myValidatorsTitle,
      myDelegationsValitors,
      isDisabledDelegationsTab,
      tabStatus,
      headerTitles,
      validatorStatus,
      windowInnerWidth,
      openModal,
    }
  },
})
</script>

<style lang="scss" scoped>
.validators {
  padding-bottom: 10rem;
}

.validators__title-btn-wrraper {
  display: flex;
  flex-direction: row-reverse;
  gap: 2.4rem;
}
.validators__title-activities {
  display: flex;
  flex-direction: row-reverse;
  align-items: flex-start;
  gap: 2.4rem;
  & > *:not(:last-child) {
    margin-bottom: 1.6rem;
  }
}
.validators__table--inactive {
  .validators__table-head,
  .validators__table-row {
    gap: 2rem;
    grid:
      auto /
      minmax(2rem, 5rem)
      minmax(5rem, 1.5fr)
      minmax(6rem, 1fr)
      minmax(8rem, 0.5fr)
      minmax(7rem, 8.7rem)
      minmax(24rem, 1.5fr);
  }
}
.validators__count-info {
  margin-bottom: 3.2rem;
}

.validators__table-head-item--center {
  text-align: center;
}
.validators__table-head-item--end {
  text-align: end;
}

.validators__mobile-activities {
  & > *:not(:last-child) {
    margin-bottom: 0.8rem;
  }
}

.validators__filter-search {
  display: flex;
  align-items: center;
  border-bottom: 0.1rem solid var(--clr__input-border);
  transition: all 0.5s ease;
  color: var(--clr__input-border);
  svg {
    transition: all 0.5s ease;
    fill: var(--clr__input-border);
  }
  &:hover,
  &:active,
  &:focus,
  &:focus-within {
    color: var(--clr__text);
    border-color: var(--clr__text);
    svg {
      fill: var(--clr__text);
    }
  }
  &:disabled {
    border-color: var(--clr__input-border);
    color: var(--clr__input-border);
    svg {
      fill: var(--clr__input-border);
    }
  }
}
.validators__filter-search-input-wrapper {
  position: relative;
  z-index: 0;
}
.validators__filter-search-input {
  border: none;
  &:focus::-webkit-input-placeholder {
    color: transparent;
  }
  &::-webkit-search-cancel-button {
    position: relative;
    right: 0.2rem;
  }
  &:active,
  &:hover,
  &:focus {
    border: none;
  }
}
.validators__filter-search-button {
  position: relative;
  width: 4.8rem;
  height: 4.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.validators__filter {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2.4rem;
  align-items: center;
}
.validators__title-btn {
  &--white {
    background: var(--clr__main-bg);
    color: var(--clr__action);

    &:hover {
      opacity: 0.7;
    }
    &:active {
      transform: scale(0.9);
    }
  }
}
.validators__tabs {
  display: flex;
  padding: 0;
  margin: 0 0 2.4rem 0;
  list-style: none;
  overflow: auto;
}
.validators__tab {
  padding: 1.2rem;
  font-size: 2rem;
  white-space: nowrap;
  border-bottom: 0.2rem solid var(--clr__table-head);
  cursor: pointer;
  &.selected {
    font-weight: 600;
    border-bottom: 0.2rem solid var(--clr__action);
  }
}
@include respond-to(tablet) {
  .validators--large-padding {
    padding-bottom: 20rem;
  }
  .validators__table--inactive {
    .validators__table-head,
    .validators__table-row {
      grid: none;
    }
  }
  .validators__count-info {
    margin-bottom: 0;
  }

  .validators__title-btn-wrraper {
    display: none;
  }

  .validators__filter {
    margin-bottom: 0;
    flex-direction: column;
    align-items: stretch;
  }
  .validators__filter-search {
    margin-bottom: 1.6rem;
  }
  .validators__filter-search-input-wrapper {
    width: 100%;
  }
  .validators__filter-search-input {
    width: 100%;
  }
}
</style>

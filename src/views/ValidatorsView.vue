<template>
  <div
    class="app__main-view validators-view load-fog"
    :class="{
      'load-fog_show': isLoading && validators?.length,
      'validators-view--large-padding': isDelegator,
    }"
  >
    <div class="validators-view__container">
      <div class="app__main-view-table-header">
        <div class="app__main-view-table-header-prefix">
          <span>Vd</span>
        </div>
        <div class="app__main-view-table-header-info">
          <h3 class="app__main-view-table-header-info-title">Validators</h3>
          <skeleton-loader
            v-if="isLoading || isValidatorsResponseLoading"
            width="100"
            height="24"
            pill
            shimmer
          />
          <span v-else class="app__main-view-table-header-info-count">
            {{ validatorsCount.toLocaleString() }} validators found
          </span>
        </div>
      </div>
      <div class="validators-view__title-btn-wrraper">
        <button
          v-if="isDelegator && delegations && validators"
          class="validators-view__title-btn app-btn app-btn--medium"
          type="button"
          @click="stakeTransfer"
        >
          Stake transfer
        </button>
        <button
          v-if="isDelegator && delegations && validators"
          class="validators-view__title-btn--white app-btn app-btn--medium"
          type="button"
          @click="claimAllRewards"
        >
          Claim all rewards
        </button>
      </div>
    </div>
    <div class="validators-view__filter">
      <template v-if="isDisabledDelegationsTab">
        <AppTabs @changeTab="tabHandler($event)">
          <AppTab :title="myValidatorsTitle" />
          <AppTab :title="activeValidatorsTitle" />
          <AppTab :title="inactiveValidatorsTitle" />
        </AppTabs>
      </template>
      <template v-else>
        <AppTabs @changeTab="tabHandler($event)">
          <AppTab :title="activeValidatorsTitle" />
          <AppTab :title="inactiveValidatorsTitle" />
        </AppTabs>
      </template>
      <div class="validators-view__filter-search">
        <div class="validators-view__filter-search-input-wrapper">
          <InputField
            :placeholder="inputPlaceholder"
            class="validators-view__filter-search-input"
            v-model="searchValue"
          />
          <template v-if="searchValue">
            <button
              @click="clearText()"
              class="validators-view__filter-search-clear-btn"
            >
              <CancelIcon
                :className="'validators__filter-search-clear-btn-icon'"
              />
            </button>
          </template>
        </div>
        <button
          class="validators-view__filter-search-button"
          @click="filterValidators()"
        >
          <SearchIcon />
        </button>
      </div>
    </div>

    <div
      class="app-table"
      :class="{
        'validators-view__table--inactive':
          tabStatus === inactiveValidatorsTitle,
      }"
    >
      <div class="app-table__head validators-view__table-head">
        <span class="validators-view__table-head-item">Rank</span>
        <span class="validators-view__table-head-item">Validator</span>
        <span class="validators-view__table-head-item">Delegator Share</span>
        <span class="validators-view__table-head-item">Commission</span>
        <span class="validators-view__table-head-item">Oracle Status</span>
        <span
          v-if="tabStatus !== inactiveValidatorsTitle"
          class="validators-view__table-head-item"
        >
          Uptime
        </span>
      </div>
      <div>
        <template v-if="filteredValidators?.length">
          <template v-if="windowInnerWidth > 768">
            <ValidatorsTableRow
              v-for="validator in filteredValidators"
              :delegations="delegations"
              :key="validator.operatorAddress"
              :has-action-buttons="Boolean(accountAddress)"
              :inactive-validators-title="inactiveValidatorsTitle"
              :tab-status="tabStatus"
              :validator="validator"
              @selectedBtn="openModal"
            />
          </template>
          <template v-else>
            <ValidatorsTableRowMobile
              v-for="validator in filteredValidators"
              :current-page="currentPage"
              :delegations="delegations"
              :key="validator.operatorAddress"
              :has-action-buttons="Boolean(accountAddress)"
              :inactive-validators-title="inactiveValidatorsTitle"
              :validator="validator"
              :tab-status="tabStatus"
              @selectedBtn="openModal"
            />
          </template>
        </template>
        <template v-else>
          <SkeletonTable
            v-if="isLoading || isValidatorsResponseLoading"
            :header-titles="headerTitles"
            class-string="validators-view-table-row"
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

    <div
      v-if="accountAddress"
      class="view-main__mobile-activities validators-view__mobile-activities"
    >
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
        class="validators-view__title-btn--white app-btn w-full app-btn--medium"
        type="button"
        @click="claimAllRewards"
      >
        Claim all rewards
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
import { DelegationResponse } from 'cosmjs-types/cosmos/staking/v1beta1/staking'
import { callers } from '@/api/callers'
import { wallet } from '@/api/wallet'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import {
  isActiveValidator,
  ValidatorInfoModify,
  VALIDATOR_STATUS,
} from '@/helpers/validatorHelpers'
import { useQuery } from '@vue/apollo-composable'
import { DetailedValidatorsQuery } from '@/graphql/queries'
import { ValidatorsInfo, DetailedValidatorsResponse } from '@/graphql/types'
import { CancelIcon, SearchIcon } from '@/components/icons'
import {
  ClaimAllRewardsFormModal,
  ClaimRewardsFormModal,
  DelegateFormModal,
  RedelegateFormModal,
  StakeTransferFormModal,
  UndelegateFormModal,
} from '@/components/modals'
import AppTabs from '@/components/tabs/AppTabs.vue'
import AppTab from '@/components/tabs/AppTab.vue'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import InputField from '@/components/fields/InputField.vue'
import SkeletonTable from '@/components/SkeletonTable.vue'
import ValidatorsTableRowMobile from '@/components/ValidatorsTableRowMobile.vue'
import ValidatorsTableRow from '@/components/ValidatorsTableRow.vue'
import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const ITEMS_PER_PAGE = 50
const currentPage = ref(1)
const totalPages = ref()
const filteredValidatorsCount = ref(0)
const validatorsCount = ref(0)
const filteredValidators = ref()
const validators = ref()
const delegations = ref<{ [k: string]: DelegationResponse }>({})
const isDelegator = computed(() => Object.keys(delegations.value).length !== 0)
const allValidators = ref<ValidatorsInfo[]>([])
const activeValidators = ref<ValidatorsInfo[]>([])
const inactiveValidators = ref<ValidatorsInfo[]>([])
const delegatedAdress = ref<string[]>([])
const accountAddress = ref(wallet.isEmpty ? '' : wallet.account.address)
const inputPlaceholder = ref('Search')

const activeValidatorsTitle = computed(() =>
  activeValidators.value?.length
    ? `Active (${activeValidators.value?.length})`
    : 'Active',
)

const myValidatorsTitle = computed(() =>
  activeValidators.value?.length
    ? `My delegations (${myDelegationsValitors.value?.length})`
    : 'My delegations',
)

const myDelegationsValitors = computed(() =>
  delegatedAdress.value.map((validatorAddress: string) => {
    return {
      ...allValidators.value.find(
        (validator: ValidatorsInfo) =>
          validator.info.operatorAddress === validatorAddress,
      ),
    }
  }),
)

const inactiveValidatorsTitle = ref('Inactive')
const tabStatus = ref(activeValidatorsTitle.value)
const searchValue = ref('')

const isDisabledDelegationsTab = computed(() =>
  Boolean(myDelegationsValitors.value.length),
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
const windowInnerWidth = ref(document.documentElement.clientWidth)
const updateWidth = () => {
  windowInnerWidth.value = document.documentElement.clientWidth
}
const { result, loading: isValidatorsResponseLoading } =
  useQuery<DetailedValidatorsResponse>(DetailedValidatorsQuery)

const signedBlocks = computed(() =>
  Number(result.value?.slashingParams[0]?.params?.signed_blocks_window),
)

const getValidators = async () => {
  if (isValidatorsResponseLoading.value) {
    return
  }

  lockLoading()

  try {
    const copyActiveValidator =
      result.value?.validator?.filter(
        (item: ValidatorsInfo) =>
          item?.statuses[0]?.status === VALIDATOR_STATUS.active,
      ) || []
    const copyInactiveValidator =
      result.value?.validator?.filter(
        (item: ValidatorsInfo) =>
          item?.statuses[0]?.status !== VALIDATOR_STATUS.active,
      ) || []

    activeValidators.value = (await Promise.all(
      copyActiveValidator.map(async (item: ValidatorsInfo, index: number) => {
        return {
          ...item,
          rank: index + 1,
          uptime:
            ((signedBlocks.value - item.signingInfos[0]?.missedBlocksCounter) /
              signedBlocks.value) *
            100,
          isActive: await isActiveValidator(item.info?.operatorAddress).then(
            req => req,
          ),
        }
      }),
    )) as unknown as ValidatorsInfo[]

    inactiveValidators.value = (await Promise.all(
      copyInactiveValidator.map(async (item: ValidatorsInfo, index: number) => {
        return {
          ...item,
          rank: index + 1,
          uptime:
            ((signedBlocks.value - item.signingInfos[0]?.missedBlocksCounter) /
              signedBlocks.value) *
            100,
          isActive: await isActiveValidator(item.info?.operatorAddress).then(
            req => req,
          ),
        }
      }),
    )) as unknown as ValidatorsInfo[]

    allValidators.value = [
      ...inactiveValidators.value,
      ...activeValidators.value,
    ]

    validators.value = isDisabledDelegationsTab.value
      ? [...myDelegationsValitors.value]
      : [...activeValidators.value]
    tabStatus.value = isDisabledDelegationsTab.value
      ? myValidatorsTitle.value
      : activeValidatorsTitle.value
    validatorsCount.value = allValidators.value.length
    filterValidators(currentPage.value)
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }

  releaseLoading()
}

const filterValidators = (newPage = 1) => {
  let tempArr = validators.value
  if (searchValue.value.trim()) {
    tempArr = tempArr.filter((item: ValidatorsInfo) => {
      console.log(item.descriptions)
      if (item.descriptions === undefined) {
        return false
      }
      if (!item.descriptions?.length) {
        return false
      }
      if (item.descriptions[0].moniker === undefined) {
        return false
      }

      const processed = item.descriptions[0].moniker
        .toLowerCase()
        .includes(searchValue.value.toLowerCase())
      return processed
    })
  }
  if (newPage === 1) {
    filteredValidators.value = tempArr?.slice(0, newPage * ITEMS_PER_PAGE)
  } else {
    filteredValidators.value = tempArr?.slice(
      (newPage - 1) * ITEMS_PER_PAGE,
      (newPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
    )
  }
  filteredValidatorsCount.value = tempArr.length
  totalPages.value = Math.ceil(filteredValidatorsCount.value / ITEMS_PER_PAGE)
  currentPage.value = newPage
}

const paginationHandler = (num: number) => {
  filterValidators(num)
}

const loadData = async () => {
  lockLoading()
  try {
    await getDelegations()
    await getValidators()
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

const stakeTransfer = async () => {
  if (!delegations.value) return
  await showDialogHandler(
    StakeTransferFormModal,
    {
      onSubmit: async d => {
        d.kill()
        await loadData()
      },
    },
    {
      activeValidators: activeValidators.value,
      delegation: delegations.value,
      allValidators: allValidators.value,
    },
  )
}

const claimAllRewards = async () => {
  await showDialogHandler(ClaimAllRewardsFormModal, {
    onSubmit: async d => {
      d.kill()
      await loadData()
    },
  })
}

const getDelegations = async () => {
  if (!accountAddress.value) {
    return
  }

  lockLoading()

  try {
    // TODO: delegations returns invalid delegator's amount?
    const response = await callers.getDelegations(accountAddress.value)
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

const tabHandler = async (title: string) => {
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
const clearText = (): void => {
  searchValue.value = ''
}

const openModal = (event: { typeBtn: string; validator: ValidatorsInfo }) => {
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

const delegate = async (validator: ValidatorInfoModify) => {
  await showDialogHandler(
    DelegateFormModal,
    {
      onSubmit: async d => {
        d.kill()
        await loadData()
      },
    },
    {
      validator,
      delegation: delegations.value[validator.info.operatorAddress],
    },
  )
}

const redelegate = async (validator: ValidatorInfoModify) => {
  await showDialogHandler(
    RedelegateFormModal,
    {
      onSubmit: async d => {
        d.kill()
        await loadData()
      },
    },
    {
      validator,
      delegation: delegations.value[validator.info.operatorAddress],
    },
  )
}

const undelegate = async (validator: ValidatorInfoModify) => {
  if (!delegations.value[validator.info.operatorAddress]) return
  await showDialogHandler(
    UndelegateFormModal,
    {
      onSubmit: async d => {
        d.kill()
        await loadData()
      },
    },
    {
      validator,
      delegation: delegations.value[validator.info.operatorAddress],
    },
  )
}

const withdrawRewards = async (validator: ValidatorInfoModify) => {
  if (!delegations.value[validator.info.operatorAddress]) return
  await showDialogHandler(
    ClaimRewardsFormModal,
    {
      onSubmit: async d => {
        d.kill()
        await loadData()
      },
    },
    { validator },
  )
}

onMounted(async () => {
  window.addEventListener('resize', updateWidth)
  await loadData()
})

onUnmounted(async () => {
  window.removeEventListener('resize', updateWidth)
})

watch([isValidatorsResponseLoading], async () => {
  await getValidators()
})

watch([searchValue], async () => {
  filterValidators()
})
</script>

<style lang="scss" scoped>
.validators-view__container {
  margin-bottom: 4.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.validators-view__count-info {
  margin-bottom: 3.2rem;
}

.validators-view__title-btn-wrraper {
  display: flex;
  flex-direction: row-reverse;
  gap: 2.4rem;
}

.validators-view__title-btn {
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

.validators-view__table-cell--center {
  justify-content: center;
}
.validators-view__table-cell--end {
  justify-content: flex-end;
}

.validators-view__table-head-item--center {
  text-align: center;
}
.validators-view__table-head-item--end {
  text-align: end;
}

.validators-view__filter-search {
  margin-bottom: 4rem;
  display: flex;
  align-items: center;
  background-color: var(--clr__table-border);
  border-radius: 0.8rem;
  transition: all 0.5s ease;

  svg {
    transition: all 0.5s ease;
    fill: var(--clr__white);
  }

  &:hover,
  &:active,
  &:focus,
  &:focus-within {
    color: var(--clr__white);
    border-color: var(--clr__white);

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

  svg.validators__filter-search-clear-btn-icon {
    fill: var(--clr__white);
  }
}
.validators-view__filter-search-input-wrapper {
  position: relative;
  z-index: 0;
}
.validators-view__filter-search-input {
  width: 35rem;
  padding-right: 2rem;
  color: var(--clr__main-text);
  background-color: inherit;
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

.validators-view__filter-search-clear-btn {
  overflow: visible;
  position: absolute;
  right: 0rem;
  top: 1.3rem;
}
.validators-view__filter-search-button {
  position: relative;
  width: 4.8rem;
  height: 4.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  &::v-deep path {
    fill: var(--clr__main-text);
  }
}
.validators-view__filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.validators-view__mobile-activities {
  & > *:not(:last-child) {
    margin-bottom: 0.8rem;
  }
}

@include respond-to(tablet) {
  .validators-view--large-padding {
    padding-bottom: 20rem;
  }

  .validators-view__table-head {
    display: none;
  }

  .validators-view__count-info {
    margin-bottom: 0;
  }

  .validators-view__title-btn-wrraper {
    display: none;
  }

  .validators-view__table-cell--center {
    justify-content: flex-start;
  }

  .validators-view__table-cell--end {
    justify-content: flex-start;
  }

  .validators-view__filter {
    margin-bottom: 0;
    flex-direction: column;
    align-items: stretch;
  }

  .validators-view__filter-search {
    margin-bottom: 1.6rem;
  }

  .validators-view__filter-search-input-wrapper {
    width: 100%;
  }

  .validators-view__filter-search-input {
    width: 100%;
  }
}

.app__main-view-table-header {
  margin-bottom: 0;
}
</style>

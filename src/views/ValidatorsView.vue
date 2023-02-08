<template>
  <div
    class="app__main-view validators-view load-fog"
    :class="{ 'load-fog_show': isLoading && validators?.length }"
  >
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
    <div class="validators-view__filter">
      <AppTabs @changeTab="tabHandler($event)">
        <AppTab :title="activeValidatorsTitle" />
        <AppTab :title="inactiveValidatorsTitle" />
      </AppTabs>
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
              :key="validator.operatorAddress"
              :validator="validator"
              :tab-status="tabStatus"
              :inactive-validators-title="inactiveValidatorsTitle"
            />
          </template>
          <template v-else>
            <ValidatorsTableRowMobile
              v-for="validator in filteredValidators"
              :key="validator.operatorAddress"
              :validator="validator"
              :tab-status="tabStatus"
              :inactive-validators-title="inactiveValidatorsTitle"
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
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { isActiveValidator, VALIDATOR_STATUS } from '@/helpers/validatorHelpers'
import { useQuery } from '@vue/apollo-composable'
import { ValidatorsQuery } from '@/graphql/queries'
import { ValidatorsResponse, ValidatorsInfo } from '@/graphql/types'
import { CancelIcon, SearchIcon } from '@/components/icons'
import AppTabs from '@/components/tabs/AppTabs.vue'
import AppTab from '@/components/tabs/AppTab.vue'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import InputField from '@/components/fields/InputField.vue'
import SkeletonTable from '@/components/SkeletonTable.vue'
import ValidatorsTableRowMobile from '@/components/ValidatorsTableRowMobile.vue'
import ValidatorsTableRow from '@/components/ValidatorsTableRow.vue'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const ITEMS_PER_PAGE = 50
const currentPage = ref(1)
const totalPages = ref()
const filteredValidatorsCount = ref(0)
const validatorsCount = ref(0)
const filteredValidators = ref()
const validators = ref()
const activeValidators = ref<ValidatorsInfo[]>([])
const inactiveValidators = ref<ValidatorsInfo[]>([])
const inputPlaceholder = ref('Search')
const activeValidatorsTitle = computed(() =>
  activeValidators.value?.length
    ? `Active (${activeValidators.value?.length})`
    : 'Active',
)
const inactiveValidatorsTitle = ref('Inactive')
const tabStatus = ref(activeValidatorsTitle.value)
const searchValue = ref('')
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
  useQuery<ValidatorsResponse>(ValidatorsQuery)
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

    validators.value = activeValidators.value
    tabStatus.value = activeValidatorsTitle.value
    validatorsCount.value = result.value?.validator?.length || 0
    filterValidators(currentPage.value)
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

const filterValidators = (newPage = 1) => {
  let tempArr = validators.value
  if (searchValue.value.trim()) {
    tempArr = tempArr.filter((item: ValidatorsInfo) =>
      item.descriptions[0].moniker
        .toLowerCase()
        .includes(searchValue.value.toLowerCase()),
    )
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

watch([searchValue], async () => {
  filterValidators()
})

const tabHandler = async (title: string) => {
  if (title !== tabStatus.value) {
    tabStatus.value = title
    if (tabStatus.value === activeValidatorsTitle.value) {
      validators.value = [...activeValidators.value]
    } else if (tabStatus.value === inactiveValidatorsTitle.value) {
      validators.value = [...inactiveValidators.value]
    }
    filterValidators(1)
  }
}
const clearText = (): void => {
  searchValue.value = ''
}

watch([isValidatorsResponseLoading], async () => {
  await getValidators()
})

onMounted(async () => {
  window.addEventListener('resize', updateWidth)
  await getValidators()
})

onUnmounted(async () => {
  window.removeEventListener('resize', updateWidth)
})
</script>

<style lang="scss" scoped>
.validators-view__count-info {
  margin-bottom: 3.2rem;
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
@include respond-to(tablet) {
  .validators-view__table-head {
    display: none;
  }

  .validators-view__count-info {
    margin-bottom: 0;
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
</style>

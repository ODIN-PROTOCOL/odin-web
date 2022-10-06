<template>
  <div class="app__main-view top-accounts">
    <div class="app__main-view-table-header">
      <div class="app__main-view-table-header-prefix">
        <span>Ta</span>
      </div>
      <div class="app__main-view-table-header-info">
        <h3 class="app__main-view-table-header-info-title">Top accounts</h3>
        <skeleton-loader
          v-if="isLoading || isSupplyLoading"
          width="100"
          height="24"
          pill
          shimmer
        />
        <span v-else class="app__main-view-table-header-info-count">
          {{ totalAccounts.toLocaleString() }} accounts found
        </span>
      </div>
    </div>
    <div class="top-accounts__selection">
      <div class="top-accounts__selection-item">
        <span class="top-accounts__selection-item-title">Sorting by:</span>
        <VuePicker
          class="top-accounts__vue-picker _vue-picker"
          name="sorting"
          v-model="sortingValue"
          :is-disabled="isLoading || isSupplyLoading"
        >
          <template #dropdownInner>
            <div class="_vue-picker__dropdown-custom">
              <VuePickerOption
                v-for="{ text, value } in sortingTypeAccounts"
                :key="text"
                :value="value"
                :text="text"
              >
                {{ text }}
              </VuePickerOption>
            </div>
          </template>
        </VuePicker>
      </div>
    </div>
    <div class="app-table top-accounts__table">
      <div class="app-table__head top-accounts__table-head">
        <span>Rank</span>
        <span>Address</span>
        <span>ODIN balance</span>
        <span>Delegated Amount</span>
        <span>Total Amount</span>
        <span>ODIN token percentage</span>
        <span>Transaction count</span>
      </div>
      <div>
        <template v-if="accounts?.length">
          <AccountsLine
            v-for="(item, index) in accounts"
            :key="index"
            :account="item"
            :odin-supply="odinSupply"
            :rank="(+currentPage - 1) * +ITEMS_PER_PAGE + (index + 1)"
          />
        </template>
        <template v-else>
          <SkeletonTable
            v-if="isLoading || isSupplyLoading"
            :header-titles="headerTitles"
            table-size="10"
            class-string="accounts-line"
          />
          <div v-else class="app-table__empty-stub">
            <p class="empty mg-t32">No items yet</p>
          </div>
        </template>
      </div>
    </div>
    <AppPagination
      v-if="totalAccounts > ITEMS_PER_PAGE"
      class="mg-t32"
      v-model="currentPage"
      :pages="totalPages"
      @update:modelValue="updateHandler"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { callers } from '@/api/callers'
import { Coin, TempBalanceType } from '@/helpers/Types'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { useQuery } from '@vue/apollo-composable'
import { SupplyQuery } from '@/graphql/queries'
import { SupplyResponse } from '@/graphql/types'
import { sortingTypeAccounts, TYPE_ACCOUNTS_SORT } from '@/helpers/helpers'
import AccountsLine from '@/components/AccountsLine.vue'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import SkeletonTable from '@/components/SkeletonTable.vue'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()

const accounts = ref<TempBalanceType[]>([])
const totalSupply = ref<Coin[]>([])
const odinSupply = ref<Coin>({ denom: 'loki', amount: '0' })
const totalPages = ref(1)
const totalAccounts = ref(0)
const currentPage = ref(1)
const sortingValue = ref(TYPE_ACCOUNTS_SORT.totalAmount)

const ITEMS_PER_PAGE = 20

const headerTitles = [
  { title: 'Rank' },
  { title: 'Address' },
  { title: 'ODIN balance' },
  { title: 'Delegated Amount' },
  { title: 'Total Amount' },
  { title: 'ODIN token percentage' },
  { title: 'Transaction count' },
]

const {
  result,
  loading: isSupplyLoading,
  onResult,
  refetch,
} = useQuery<SupplyResponse>(SupplyQuery)

const getAccounts = async (): Promise<void> => {
  lockLoading()

  try {
    const data = await callers
      .getTopAccounts(
        ITEMS_PER_PAGE,
        (currentPage.value - 1) * ITEMS_PER_PAGE,
        sortingValue.value,
      )
      .then(res => res.data)
    accounts.value = data.accounts
    totalAccounts.value = data.total_count
    totalPages.value = Math.ceil(totalAccounts.value / ITEMS_PER_PAGE)
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }

  releaseLoading()
}

const getAccountOdinPercentage = () => {
  odinSupply.value = totalSupply.value.find(
    (item: Coin) => item.denom === 'loki',
  ) || { denom: 'loki', amount: '0' }
}

const updateHandler = async () => {
  accounts.value = []
  await refetch()
}

onResult(async (): Promise<void> => {
  if (result.value?.supply.length) {
    totalSupply.value = result.value?.supply[0].coins
    getAccountOdinPercentage()
  }

  await getAccounts()
})

watch([sortingValue], async () => {
  currentPage.value = 1
  totalAccounts.value = 0
  await updateHandler()
})

onMounted(async (): Promise<void> => {
  await updateHandler()
})
</script>

<style scoped lang="scss">
.top-accounts {
  .app__main-view-table-header {
    margin-bottom: 0;
  }
}

.top-accounts__sort-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3.2rem;
}

.top-accounts__sort-field {
  display: flex;
  align-items: center;
}

.top-accounts__vue-picker {
  width: 20rem;
  margin-left: 1rem;
  background: var(--clr__white);
}

.top-accounts__selection {
  margin-bottom: 4rem;
  display: flex;
  justify-content: flex-end;
}

.top-accounts__selection-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.top-accounts__selection-item-title {
  font-size: 1.4rem;
  font-weight: 300;
  margin-right: 0.4rem;
  word-break: keep-all;
  width: 100%;
}

@include respond-to(tablet) {
  .top-accounts__sort-info {
    margin-bottom: 1.6rem;
  }

  .top-accounts__table-head {
    grid: none;
  }

  .top-accounts__selection {
    width: 100%;
    flex-direction: column;
    margin-bottom: 0;
  }

  .top-accounts__subtitle-line {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }

  .top-accounts__selection-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 1.6rem 0;
  }

  .top-accounts__vue-picker {
    width: 100%;
    margin-left: 0;
  }

  .top-accounts__selection-item-title {
    margin-bottom: 1rem;
  }

  .top-accounts__sort-wrapper {
    flex-direction: column;
    align-items: flex-start;
    margin: 0;
  }
}

@include respond-to(medium) {
  .top-accounts__table-head {
    display: none;
  }
}
</style>

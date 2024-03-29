<template>
  <div class="app__main-view wallet-view">
    <div class="app__main-view-table-header">
      <h3 class="app__main-view-table-header-info-title">Wallet</h3>
    </div>
    <PersonalInfo />
    <div class="wallet-view__subtitle-wrapper">
      <div class="wallet-view__subtitle app__view-main__subtitle mg-b32">
        <div class="wallet-view__tx-info">
          <InfoIcon message="Based on last transactions in system" />
        </div>
        <h3 class="app__view-main__subtitle">Transaction list</h3>
      </div>
      <div class="wallet-view__selection">
        <div class="wallet-view__selection-item">
          <span class="wallet-view__selection-item-title">Filter:</span>
          <VuePicker
            class="wallet-view__vue-picker _vue-picker"
            name="filter"
            v-model="sortingValue"
            :isDisabled="isLoading"
          >
            <template #dropdownInner>
              <div class="_vue-picker__dropdown-custom">
                <VuePickerOption
                  v-for="{ text, value } in sortingTypeTx"
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
    </div>
    <div v-if="transactions" class="app-table">
      <div class="app-table__head">
        <span v-for="(item, index) in headerTitles" :key="index">
          {{ item.title }}
        </span>
      </div>
      <div class="app-table__body">
        <template v-if="transactions?.length">
          <AccountTxLine
            v-for="(item, index) in transactions"
            :key="index"
            :tx="item.attributes"
          />
        </template>
        <template v-else>
          <SkeletonTable
            v-if="isLoading"
            :header-titles="headerTitles"
            table-size="10"
            class-string="data-sources__table-row"
          />
          <div v-else class="app-table__empty-stub">
            <p class="empty mg-t32">No items yet</p>
          </div>
        </template>
      </div>
    </div>

    <template>
      <AppPagination
        v-if="transactionsCount > ITEMS_PER_PAGE"
        class="mg-t32 mg-b32"
        v-model="currentPage"
        :pages="totalPages"
        @update:modelValue="paginationHandler"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { callers } from '@/api/callers'
import { wallet } from '@/api/wallet'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { sortingTypeTx, TYPE_TX_SORT } from '@/helpers/sortingHelpers'
import { InfoIcon } from '@/components/icons'
import AccountTxLine from '@/components/AccountTxLine.vue'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import PersonalInfo from '@/components/PersonalInfo.vue'
import SkeletonTable from '@/components/SkeletonTable.vue'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()

const ITEMS_PER_PAGE = 20
const currentPage = ref(1)
const totalPages = ref()
const transactionsCount = ref(0)
const transactions = ref()
const sortingValue = ref(TYPE_TX_SORT.all)
const headerTitles = [
  { title: 'Transaction Hash' },
  { title: 'Type' },
  { title: 'Block' },
  { title: 'Date' },
  { title: 'Sender' },
  { title: 'Receiver' },
  { title: 'Transaction Fee' },
  { title: 'Amount' },
]

onMounted(async () => {
  await getTransactions()
})

const getTransactions = async () => {
  lockLoading()

  try {
    const tx = await callers
      .getAccountTx(
        currentPage.value - 1,
        ITEMS_PER_PAGE,
        wallet.account.address,
        'desc',
        sortingValue.value,
      )
      .then(resp => resp.json())

    transactions.value = tx.data
    transactionsCount.value = tx.total_count
    totalPages.value = Math.ceil(transactionsCount.value / ITEMS_PER_PAGE)
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }

  releaseLoading()
}

const paginationHandler = async (num: number) => {
  currentPage.value = num
  await getTransactions()
}

watch([sortingValue], async () => {
  currentPage.value = 1
  await getTransactions()
})
</script>

<style lang="scss" scoped>
.wallet-view__subtitle-wrapper {
  display: flex;
  justify-content: space-between;
}

.wallet-view__subtitle {
  display: flex;
  align-items: center;
}

.wallet-view__vue-picker {
  margin-left: 1rem;
}

.wallet-view__selection-item-title {
  margin-right: 0.4rem;
  font-size: 1.4rem;
  font-weight: 300;
}

.wallet-view__tx-info {
  margin-right: 0.9rem;
  height: 2.3rem;
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
}

@include respond-to(tablet) {
  .wallet-view__selection {
    margin-bottom: 1.6rem;
    width: 100%;
    flex-direction: column;
  }

  .wallet-view__subtitle-wrapper {
    flex-direction: column;
  }

  .wallet-view__selection-item {
    display: flex;
    flex-direction: column;
  }

  .wallet-view__selection-item-title {
    margin: 0 0 0.4rem;
  }

  .wallet-view__vue-picker {
    margin-left: 0;
    width: 100%;
  }
}

@include respond-to(medium) {
  .app-table__head {
    display: none;
  }
}
</style>

<template>
  <div class="app__main-view">
    <div class="app__main-view-table-header">
      <div class="app__main-view-table-header-prefix">
        <span>Tx</span>
      </div>
      <div class="app__main-view-table-header-info">
        <h3 class="app__main-view-table-header-info-title">Transactions</h3>
        <skeleton-loader
          v-if="isLoading"
          width="100"
          height="24"
          pill
          shimmer
        />
        <span v-else class="app__main-view-table-header-info-count">
          {{ totalTransactions.toLocaleString() }} transactions found
        </span>
      </div>
    </div>
    <div class="charts-view__section">
      <div
        v-for="item in blockChainDataTransactions"
        class="charts-view__chart-wrapper"
        :key="item.title"
      >
        <h4 class="charts-view__chart-title">{{ item.title }}</h4>
        <router-link
          class="charts-view__chart-item"
          :to="{ name: item.chartPageName }"
        >
          <ChartPreview v-bind="chartPagesProps[item.id]" />
        </router-link>
      </div>
    </div>
    <div class="app-table">
      <div class="app-table__head">
        <span v-for="(item, index) in headerTitles" :key="index">
          {{ item.title }}
        </span>
      </div>
      <div>
        <template v-if="transactions?.length">
          <TxLine
            v-for="(item, index) in transactions"
            :key="index"
            :transition="item"
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

    <AppPagination
      v-if="totalTransactions > ITEMS_PER_PAGE"
      class="mg-t32"
      v-model="page"
      :pages="totalPages"
      @update:modelValue="updateHandler"
    />
  </div>
</template>

<script setup lang="ts">
import { blockChainDataTransactions, chartPagesProps } from '@/const'
import { callers } from '@/api/callers'
import { ref, onMounted } from 'vue'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { prepareTransaction } from '@/helpers/helpers'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import TxLine from '@/components/TxLine.vue'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import SkeletonTable from '@/components/SkeletonTable.vue'
import ChartPreview from '@/components/ChartPreview.vue'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()

const ITEMS_PER_PAGE = 20
const transactions = ref()
const page = ref<number>(1)
const totalPages = ref<number>(0)
const totalTransactions = ref<number>(0)
const headerTitles = [
  { title: 'Transaction Hash' },
  { title: 'Type' },
  { title: 'Block' },
  { title: 'Date' },
  { title: 'Sender' },
  { title: 'Receiver' },
  { title: 'GAS (ODIN)' },
  { title: 'Amount' },
]
const getTransactions = async () => {
  lockLoading()
  try {
    transactions.value = []
    const { data, total_count } = await callers
      .getTxSearchFromTelemetry(page.value - 1, ITEMS_PER_PAGE, 'desc')
      .then(resp => resp.json())

    const transaction = await prepareTransaction(data)

    // IMPORTANT:: This is the Temporary Fixed. once API update it will auto-fix
    // Use a Set to keep track of unique Block IDs
    const uniqueIds = new Set()

    transactions.value = transaction.filter(item => {
      if (item.type === 'Withdraw delegator reward') {
        if ((!item.sender && !item.receiver) || uniqueIds.has(item.block)) {
          return false
        } else {
          uniqueIds.add(item.block)
          return true
        }
      }
      return true
    })
    // IMPORTANT:: This is the Temporary Fixed. once API update it will auto-fix

    totalTransactions.value = total_count
    totalPages.value = Math.ceil(totalTransactions.value / ITEMS_PER_PAGE)
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

const updateHandler = async () => {
  await getTransactions()
}

onMounted(async () => {
  await getTransactions()
})
</script>

<style lang="scss">
@include respond-to(medium) {
  .app-table__head {
    display: none;
  }
}

.charts-view__section {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2.4rem;
  margin-bottom: 4rem;

  .charts-view__chart-wrapper {
    padding: 2rem;
    border-radius: 8px;
    border: 0.1rem solid var(--clr__card-border);

    .charts-view__chart-title {
      margin-top: 0;
      color: var(--clr__text-muted);
      margin-bottom: 4rem;
    }

    .custom-line-chart {
      height: 100px;
    }
  }
}

@include respond-to(small) {
  .charts-view__section {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}
</style>

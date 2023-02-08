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
import { callers } from '@/api/callers'
import { ref, onMounted } from 'vue'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { prepareTransaction } from '@/helpers/helpers'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import TxLine from '@/components/TxLine.vue'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import SkeletonTable from '@/components/SkeletonTable.vue'

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
  { title: 'Transaction Fee' },
  { title: 'Amount' },
]
const getTransactions = async () => {
  lockLoading()
  try {
    transactions.value = []
    const { data, total_count } = await callers
      .getTxSearchFromTelemetry(page.value - 1, ITEMS_PER_PAGE, 'desc')
      .then(resp => resp.json())

    transactions.value = await prepareTransaction(data)
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

<style lang="scss" scoped>
@include respond-to(medium) {
  .app-table__head {
    display: none;
  }
}
</style>

<template>
  <div class="app__main-view">
    <div class="app__main-view-table-header">
      <div class="app__main-view-table-header-prefix">
        <span>Bk</span>
      </div>
      <div class="app__main-view-table-header-info">
        <h3 class="app__main-view-table-header-info-title">Blocks</h3>
        <skeleton-loader
          v-if="isLoading"
          width="100"
          height="24"
          pill
          shimmer
        />
        <span v-else class="app__main-view-table-header-info-count">
          {{ blocksCount.toLocaleString() }} blocks found
        </span>
      </div>
    </div>
    <div class="app-table blocks-list__table">
      <div class="app-table__head blocks-list__table-head">
        <span v-for="(item, index) in headerTitles" :key="index">
          {{ item.title }}
        </span>
      </div>
      <div class="app-table__body">
        <template v-if="blocks?.length">
          <div
            v-for="item in blocks"
            :key="item.id"
            class="app-table__row blocks-list__table-row"
          >
            <div class="app-table__cell">
              <span class="app-table__title blocks-list__table-title">
                Block
              </span>
              <TitledLink
                :name="{
                  name: $routes.blockDetails,
                  params: { id: item.header.height },
                }"
                :text="item.header.height"
                class="app-table__cell-txt app-table__link"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title blocks-list__table-title">
                Date
              </span>
              <span class="app-table__cell-date">
                {{ $fDate(item.header.time, 'dd/MM/yy') }}
              </span>
              <span class="app-table__cell-time">
                {{ $fDate(item.header.time, 'HH:mm') }}
              </span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title blocks-list__table-title">
                Transactions
              </span>
              <span class="app-table__cell-txt">
                {{ item.txs.toLocaleString() }}
              </span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title blocks-list__table-title">
                Validator
              </span>
              <TitledLink
                :name="{
                  name: $routes.validatorDetails,
                  params: { address: item.validator },
                }"
                :text="item.validator"
                class="app-table__cell-txt app-table__link"
              />
            </div>
          </div>
        </template>
        <template v-else>
          <SkeletonTable
            v-if="isLoading"
            :header-titles="headerTitles"
            table-size="10"
            class-string="blocks-list__table-row"
          />
          <div v-else class="app-table__empty-stub">
            <p class="empty mg-t32">No items yet</p>
          </div>
        </template>
      </div>
    </div>
    <AppPagination
      v-if="blocksCount > ITEMS_PER_PAGE"
      class="mg-t32"
      v-model="currentPage"
      :pages="totalPages"
      @update:modelValue="updateHandler"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { callers } from '@/api/callers'
import { prepareBlocks } from '@/helpers/blocksHelper'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { START_VALUE } from '@/api/api-config'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import SkeletonTable from '@/components/SkeletonTable.vue'
import TitledLink from '@/components/TitledLink.vue'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const ITEMS_PER_PAGE = 20
const MIN_POSSIBLE_BLOCK_HEIGHT = Number(START_VALUE.minHeight)

const blocks = ref()
const currentPage = ref<number>(1)
const lastBlockHeight = ref()
const minHeight = ref()
const maxHeight = ref()
const totalPages = ref<number>()

const blocksCount = computed(() =>
  lastBlockHeight.value ? lastBlockHeight.value - MIN_POSSIBLE_BLOCK_HEIGHT : 0,
)

const headerTitles = [
  { title: 'Block' },
  { title: 'Date' },
  { title: 'Transactions' },
  { title: 'Validator' },
]

const initBlocks = async () => {
  lockLoading()

  try {
    const { lastHeight, blockMetas } = await callers.getBlockchain()
    blocks.value = await prepareBlocks(blockMetas)
    lastBlockHeight.value = lastHeight
    totalPages.value = Math.ceil(
      (lastHeight - MIN_POSSIBLE_BLOCK_HEIGHT) / ITEMS_PER_PAGE,
    )
    maxHeight.value = lastHeight
    minHeight.value = lastHeight - ITEMS_PER_PAGE
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }

  releaseLoading()
}

const getBLocks = async (): Promise<void> => {
  lockLoading()

  try {
    blocks.value = []
    const { lastHeight, blockMetas } = await callers.getBlockchain(
      minHeight.value,
      maxHeight.value,
    )

    lastBlockHeight.value = lastHeight
    totalPages.value = Math.ceil(
      (lastHeight - MIN_POSSIBLE_BLOCK_HEIGHT) / ITEMS_PER_PAGE,
    )
    blocks.value = await prepareBlocks(blockMetas)
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }

  releaseLoading()
}

const updateHandler = async (num: number) => {
  minHeight.value = lastBlockHeight.value - num * ITEMS_PER_PAGE
  maxHeight.value = minHeight.value + ITEMS_PER_PAGE
  if (minHeight.value < MIN_POSSIBLE_BLOCK_HEIGHT)
    minHeight.value = MIN_POSSIBLE_BLOCK_HEIGHT
  await getBLocks()
}

onMounted(async (): Promise<void> => {
  await initBlocks()
})
</script>

<style lang="scss" scoped>
@include respond-to(tablet) {
  .blocks-list__table-row {
    grid: none;
    padding: 3.4rem 0 1.6rem;
  }

  .blocks-list__table-head {
    display: none;
  }

  .blocks-list__table-title {
    display: inline-block;
    min-width: 15rem;
    margin-right: 2.4rem;
    font-weight: 300;
  }
}
</style>

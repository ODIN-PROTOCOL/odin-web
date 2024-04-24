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
    <div class="charts-view__section">
      <div
        v-for="item in blockChainDataBlocks"
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
                  params: { id: item.height },
                }"
                :text="item.height"
                class="app-table__cell-txt app-table__link"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title blocks-list__table-title">
                Block Hash
              </span>
              <span class="app-table__cell-txt fs-c-muted" :title="item.hash">
                {{ formatTxString(item.hash) }}
              </span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title blocks-list__table-title">
                Date
              </span>
              <span class="app-table__cell-date">
                {{ $fDate($parseISO(item.timestamp), 'dd/MM/yy') }}
              </span>
              <span class="app-table__cell-time">
                {{ $fDate($parseISO(item.timestamp), 'HH:mm') }}
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
                  params: {
                    address: item.validator.validator_info.operator_address,
                  },
                }"
                :text="
                  item.validatorDetails?.moniker ||
                  item.validator.validator_info.operator_address
                "
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
import { blockChainDataBlocks, chartPagesProps } from '@/const'
import { ref, onMounted, computed } from 'vue'
import { callers } from '@/api/callers'
import { prepareBlockMetas } from '@/helpers/blocksHelper'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import SkeletonTable from '@/components/SkeletonTable.vue'
import TitledLink from '@/components/TitledLink.vue'
import { formatTxString } from '@/helpers/formatters'
import ChartPreview from '@/components/ChartPreview.vue'
import { ValidatorDetailedInfo } from '@/graphql/types/responses'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const ITEMS_PER_PAGE = 20

const blocks = ref()
const currentPage = ref<number>(1)
const lastBlockHeight = ref()
const blocksCount = ref<number>(0)
const minHeight = ref()
const maxHeight = ref()
const totalPages = ref<number>(0)
const validators = ref<ValidatorDetailedInfo[]>([])

const getValidators = async (): Promise<void> => {
  const response = await callers.getValidators()
  validators.value = response.data.validators || []
}

const headerTitles = [
  { title: 'Block' },
  { title: 'Block Hash' },
  { title: 'Date' },
  { title: 'TXN' },
  { title: 'Validator' },
]

const initBlocks = async () => {
  lockLoading()

  try {
    await getValidators()

    const response = await callers.getBlockchain(
      ITEMS_PER_PAGE,
      'desc',
      currentPage.value * ITEMS_PER_PAGE,
    )
    const blockMetas = response.data.blockMetas

    blocks.value = await prepareBlockMetas(blockMetas, validators.value)
    lastBlockHeight.value = response.data.latestBlock[0].height || 0
    blocksCount.value = response.data.totalCount.aggregate.count || 0

    totalPages.value = Math.ceil(Number(blocksCount.value) / ITEMS_PER_PAGE)
    maxHeight.value = lastBlockHeight.value
    minHeight.value = lastBlockHeight.value - ITEMS_PER_PAGE
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }

  releaseLoading()
}

const getBlocks = async (): Promise<void> => {
  lockLoading()

  try {
    blocks.value = []
    await getValidators()

    const response = await callers.getBlockchain(
      ITEMS_PER_PAGE,
      'desc',
      currentPage.value * ITEMS_PER_PAGE,
    )
    blocksCount.value = response.data.totalCount.aggregate.count || 0

    const { blockMetas } = response.data
    lastBlockHeight.value = response.data.latestBlock[0].height || 0

    totalPages.value = Math.ceil(blocksCount.value / ITEMS_PER_PAGE)
    blocks.value = await prepareBlockMetas(blockMetas, validators.value)
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }

  releaseLoading()
}

const updateHandler = async (num: number) => {
  await getBlocks()
}

onMounted(async (): Promise<void> => {
  await initBlocks()
})
</script>

<style lang="scss">
@include respond-to(tablet) {
  .blocks-list__table-row {
    grid: none !important;
    padding: 3.4rem 0 1.6rem !important;
  }

  .blocks-list__table-head {
    display: none !important;
  }

  .blocks-list__table-title {
    display: inline-block !important;
    min-width: 15rem;
    margin-right: 2.4rem !important;
    font-weight: 300;
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

    .custom-bar-chart {
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

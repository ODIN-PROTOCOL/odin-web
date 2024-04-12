<template>
  <div class="app__main-view data-sources">
    <div class="app__main-view-table-header data-sources__table-header">
      <div class="data-sources__container">
        <div class="app__main-view-table-header-prefix">
          <span>Ds</span>
        </div>
        <div class="app__main-view-table-header-info">
          <h3 class="app__main-view-table-header-info-title">Data Sources</h3>
          <skeleton-loader
            v-if="isLoading"
            width="100"
            height="24"
            pill
            shimmer
          />
          <span v-else class="app__main-view-table-header-info-count">
            {{ dataSourcesCount?.toLocaleString() }} Data Sources found
          </span>
        </div>
      </div>
      <button
        v-if="accountAddress"
        class="data-sources__title-btn app-btn app-btn--medium"
        type="button"
        @click="createDataSource()"
      >
        Create data source
      </button>
    </div>

    <!-- <SortLine
      :is-loading="isLoading"
      title="Data Source"
      v-model:oracleScriptsName="dataSourceName"
      v-model:sortingActivitiesValue="sortingActivitiesValue"
      v-model:sortingOwnersValue="sortingOwnersValue"
    /> -->

    <div class="app-table">
      <div class="app-table__head data-sources__table-head">
        <span>Data Source</span>
        <span>Description</span>
        <span>Price</span>
        <span>Requests</span>
        <span>Timestamp</span>
      </div>
      <div class="app-table__body">
        <template v-if="dataSources?.length">
          <div
            v-for="item in dataSources"
            :key="item.id"
            class="app-table__row data-sources__table-row"
          >
            <div class="app-table__cell">
              <span class="app-table__title">Data Source</span>
              <span>#{{ item.id }} {{ item.name }}</span>
              <!-- <TitledLink
                class="app-table__cell-txt app-table__link"
                :text="`#${item.id} ${item.name}`"
                :name="{
                  name: $routes.dataSourceDetails,
                  params: { id: item.id },
                }"
              /> -->
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Description</span>
              <span>
                {{ item.description || 'No description' }}
              </span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Price</span>
              <span>
                {{ convertLokiToOdin(Number(item.fee[0].amount)) }}
              </span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Requests</span>
              <span>
                {{ item.requestCount }}
              </span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Timestamp</span>
              <template v-if="item.timestamp">
                <span class="app-table__cell-date">
                  {{ $fDate($parseISO(item.timestamp), 'dd/MM/yy') }}
                </span>
                <span class="app-table__cell-time">
                  {{ $fDate($parseISO(item.timestamp), 'HH:mm') }}
                </span>
              </template>
              <span v-else class="app-table__cell-txt">-</span>
            </div>
            <div class="app-table__cell">
              <div class="app-table__activities data-sources__table-activities">
                <div
                  class="app-table__activities-item data-sources__table-activities-item"
                >
                  <button
                    v-if="accountAddress === item.owner"
                    class="app-btn app-btn--edit"
                    type="button"
                    @click="editDataSource(item)"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <SkeletonTable
            v-if="isLoading"
            :header-titles="headerTitles"
            class-string="data-sources__table-row"
          />
          <div v-else class="app-table__empty-stub">
            <p class="empty mg-t32">No items yet</p>
          </div>
        </template>
      </div>
    </div>

    <template v-if="dataSourcesCount > ITEMS_PER_PAGE">
      <AppPagination
        class="mg-t32 mg-b32"
        v-model="currentPage"
        :pages="totalPages"
        @update:modelValue="paginationHandler"
      />
    </template>

    <div v-if="accountAddress" class="view-main__mobile-activities">
      <button
        class="app-btn w-full app-btn--medium"
        type="button"
        @click="createDataSource()"
      >
        Create data source
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { callers } from '@/api/callers'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import { ACTIVITIES_SORT, OWNERS_SORT } from '@/helpers/sortingHelpers'
import { convertLokiToOdin } from '@/helpers/converters'
import { wallet } from '@/api/wallet'
import { DataSourceFormModal } from '@/components/modals'
import TitledLink from '@/components/TitledLink.vue'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import SortLine from '@/components/SortLine.vue'
import SkeletonTable from '@/components/SkeletonTable.vue'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const ITEMS_PER_PAGE = 50
const currentPage = ref(1)
const totalPages = ref(0)
const dataSourcesCount = ref(0)
const dataSources = ref([])

const accountAddress = ref(wallet.isEmpty ? '' : wallet.account.address)
const sortingActivitiesValue = ref(ACTIVITIES_SORT.latest)
const sortingOwnersValue = ref(OWNERS_SORT.all)
const dataSourceName = ref('')
const headerTitles = [
  { title: 'Data Source' },
  { title: 'Description' },
  { title: 'Price' },
  { title: 'Requests' },
  { title: 'Timestamp' },
]

const getDataSources = async () => {
  lockLoading()
  try {
    dataSources.value = []
    const response = await callers.getSortedDataSources(
      currentPage.value - 1,
      ITEMS_PER_PAGE,
      sortingActivitiesValue.value,
      sortingOwnersValue.value,
      dataSourceName.value,
    )

    if (response.data) {
      dataSources.value = response.data.data_source
      // dataSources.value = await Promise.all(
      //   data?.map(async (item: { attributes: { id: number } }) => {
      //     // const resp = await callers.getDataSourceRequestCount(
      //     //   item.attributes.id,
      //     // )
      //     return { ...item.attributes, requestCount: resp.data.total_count }
      //   }),
      // )
    }
    dataSourcesCount.value = response.data.data_source_aggregate.aggregate.count
    totalPages.value = Math.ceil(dataSourcesCount.value / ITEMS_PER_PAGE)
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

const createDataSource = async () => {
  await showDialogHandler(DataSourceFormModal, {
    onSubmit: async d => {
      await getDataSources()
      d.kill()
    },
  })
}

const editDataSource = async (dataSource: unknown) => {
  await showDialogHandler(
    DataSourceFormModal,
    {
      onSubmit: async d => {
        await getDataSources()
        d.kill()
      },
    },
    { dataSource },
  )
}

const paginationHandler = (num: number) => {
  currentPage.value = num
  getDataSources()
}

watch(
  [sortingActivitiesValue, sortingOwnersValue, dataSourceName, accountAddress],
  async () => {
    currentPage.value = 1
    await getDataSources()
  },
)

onMounted(async () => {
  await getDataSources()
})
</script>

<style lang="scss" scoped>
.data-sources__table-header {
  justify-content: space-between;
}

.data-sources__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@include respond-to(tablet) {
  .app-table__head {
    display: none;
  }

  .app-table__title {
    min-width: 15rem;
    margin-right: 2.4rem;
    display: inline-block;
    font-weight: 300;
  }

  .app-table__row {
    padding: 3.4rem 0 1.6rem;
    grid: none;
  }

  .data-sources {
    padding-bottom: 10rem;
  }

  .data-sources__title-btn {
    display: none;
  }
}

.data-sources__table-row {
  align-items: center;
}
.data-sources__table-head {
  padding-bottom: 0;
}
.data-sources__table-activities {
  width: 100%;

  & > *:not(:last-child) {
    margin-bottom: 2.4rem;
  }
}
.data-sources__table-activities-item {
  display: flex;
  justify-content: flex-end;
  gap: 2.4rem;
}

@include respond-to(tablet) {
  .data-sources {
    padding-bottom: 10rem;
  }
  .data-sources__table-activities {
    width: 100%;
  }
  .data-sources__table-activities-item {
    & > * {
      flex: 1;
    }
  }
  .data-sources__title-btn {
    display: none;
  }
}
</style>

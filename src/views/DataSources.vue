<template>
  <div class="view-main data-sources">
    <div class="view-main__title-wrapper">
      <h2 class="view-main__title">Data Sources</h2>
      <button
        v-if="accountAddress"
        class="data-sources__title-btn app-btn app-btn--medium"
        type="button"
        @click="createDataSource()"
      >
        Create Data Source
      </button>
    </div>

    <div class="data-sources__count-info">
      <skeleton-loader v-if="isLoading" height="24" width="150" shimmer pill />
      <p v-else>{{ dataSourcesCount }} Data Sources found</p>
    </div>

    <SortLine
      :is-loading="isLoading"
      :title="'Data Sources'"
      v-model:oracleScriptsName="dataSourceName"
      v-model:sortingOwnersValue="sortingOwnersValue"
      v-model:sortingActivitiesValue="sortingActivitiesValue"
    />

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
              <TitledLink
                class="app-table__cell-txt app-table__link"
                :text="`#${item.id} ${item.name}`"
                :to="{
                  name: $routes.dataSourceDetails,
                  params: { id: item.id },
                }"
              />
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
                {{ convertLokiToOdin(Number(item.fee_amount)) }}
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
              <span>
                {{ $fDate(new Date(item.timestamp * 1000)) || '-' }}
              </span>
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
        Create Data Source
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
    const { data, total_count } = await callers
      .getSortedDataSources(
        currentPage.value - 1,
        ITEMS_PER_PAGE,
        sortingActivitiesValue.value,
        sortingOwnersValue.value,
        dataSourceName.value,
      )
      .then(response => response.json())

    if (data) {
      dataSources.value = await Promise.all(
        data?.map(async (item: { attributes: { id: number } }) => {
          const resp = await callers.getDataSourceRequestCount(
            item.attributes.id,
          )
          return { ...item.attributes, requestCount: resp.data.total_count }
        }),
      )
    }
    dataSourcesCount.value = total_count
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

<style scoped lang="scss">
.data-sources__count-info {
  margin-bottom: 3.2rem;
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
  .data-sources__count-info {
    margin-bottom: 2.4rem;
  }
}
</style>

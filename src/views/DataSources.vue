<template>
  <div class="view-main data-sources">
    <div class="view-main__title-wrapper">
      <h2 class="view-main__title">Data Sources</h2>
      <button
        class="data-sources__title-btn app-btn app-btn--medium"
        type="button"
        @click="createDataSource()"
      >
        Create Data Source
      </button>
    </div>

    <div class="data-sources__count-info">
      <skeleton-loader
        v-if="isLoading"
        :height="24"
        rounded
        animation="wave"
        color="rgb(225, 229, 233)"
      />
      <p v-else>{{ dataSourcesCount }} Data Sources Found</p>
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
        <span>ID</span>
        <span>Data Source</span>
        <span>Description</span>
        <span>Price</span>
        <span>Timestamp</span>
      </div>
      <div class="app-table__body">
        <template v-if="dataSources?.length">
          <div
            v-for="item in dataSources"
            :key="item.attributes.id"
            class="app-table__row data-sources__table-row"
          >
            <div class="app-table__cell">
              <span class="app-table__title">ID</span>
              <span>#{{ item.attributes.id }}</span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Data Source</span>
              <TitledLink
                class="app-table__cell-txt app-table__link"
                :text="item.attributes.name"
                :to="`/data-sources/${item.attributes.id.toString()}`"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Description</span>
              <span>
                {{ item.attributes.description || '-' }}
              </span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Price</span>
              <span>
                {{ convertLokiToOdin(Number(item.attributes.fee_amount)) }}
              </span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Timestamp</span>
              <span>
                {{ $fDate(new Date(item.attributes.timestamp * 1000)) || '-' }}
              </span>
            </div>
            <div class="app-table__cell">
              <div class="app-table__activities data-sources__table-activities">
                <div
                  class="app-table__activities-item data-sources__table-activities-item"
                >
                  <button
                    v-if="accountAddress === item.attributes.owner"
                    class="app-btn app-btn--edit"
                    type="button"
                    @click="editDataSource(item.attributes)"
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

    <div class="view-main__mobile-activities">
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

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import { callers } from '@/api/callers'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import TitledLink from '@/components/TitledLink.vue'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import DataSourceFormModal from '@/components/modals/DataSourceFormModal.vue'
import { wallet } from '@/api/wallet'
import SortLine from '@/components/SortLine.vue'
import { ACTIVITIES_SORT, OWNERS_SORT } from '@/helpers/sortingHelpers'
import { convertLokiToOdin } from '@/helpers/converters'
import SkeletonTable from '@/components/SkeletonTable.vue'

export default defineComponent({
  components: {
    TitledLink,
    AppPagination,
    SortLine,
    SkeletonTable,
  },
  setup: function () {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const ITEMS_PER_PAGE = 50
    const currentPage = ref(1)
    const totalPages = ref(0)
    const dataSourcesCount = ref(0)
    const dataSources = ref([])
    const accountAddress = wallet.account.address
    const sortingActivitiesValue = ref(ACTIVITIES_SORT.latest)
    const sortingOwnersValue = ref(OWNERS_SORT.all)
    const dataSourceName = ref('')
    const headerTitles = [
      { title: 'ID' },
      { title: 'Data Source' },
      { title: 'Description' },
      { title: 'Price' },
      { title: 'Timestamp' },
    ]
    const loadDataSources = async () => {
      lockLoading()
      try {
        dataSources.value = []
        const { data, total_count } = await callers
          .getSortedDataSources(
            currentPage.value - 1,
            ITEMS_PER_PAGE,
            sortingActivitiesValue.value,
            sortingOwnersValue.value,
            dataSourceName.value
          )
          .then((response) => response.json())
        dataSources.value = data
        dataSourcesCount.value = total_count
        totalPages.value = Math.ceil(dataSourcesCount.value / ITEMS_PER_PAGE)
      } catch (error) {
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
      }
      releaseLoading()
    }
    const createDataSource = async () => {
      await showDialogHandler(DataSourceFormModal, {
        onSubmit: async (d) => {
          d.kill()
          await loadDataSources()
        },
      })
    }
    const editDataSource = async (dataSource: unknown) => {
      await showDialogHandler(
        DataSourceFormModal,
        {
          onSubmit: async (d) => {
            d.kill()
            await loadDataSources()
          },
        },
        { dataSource }
      )
    }
    const paginationHandler = (num: number) => {
      currentPage.value = num
      loadDataSources()
    }

    watch(
      [sortingActivitiesValue, sortingOwnersValue, dataSourceName],
      async () => {
        currentPage.value = 1
        await loadDataSources()
      }
    )

    onMounted(async () => {
      await loadDataSources()
    })

    return {
      isLoading,
      ITEMS_PER_PAGE,
      currentPage,
      totalPages,
      paginationHandler,
      sortingActivitiesValue,
      sortingOwnersValue,
      accountAddress,
      dataSourcesCount,
      dataSources,
      createDataSource,
      editDataSource,
      dataSourceName,
      convertLokiToOdin,
      headerTitles,
    }
  },
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

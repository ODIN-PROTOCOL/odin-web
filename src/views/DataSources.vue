<template>
  <div class="view-main data-sources">
    <div class="view-main__title-wrapper">
      <h2 class="view-main__title">Data Sources</h2>
      <button
        class="data-sources__title-btn app-btn app-btn_small fx-sae"
        type="button"
        @click="createDataSource()"
      >
        Create data source
      </button>
    </div>

    <template v-if="dataSourcesCount">
      <div class="data-sources__count-info">
        <p>{{ dataSourcesCount }} Data Sources found</p>
      </div>
    </template>

    <SortRow
      :isLoading="isLoading"
      :title="'Data Source'"
      v-model:oracleScriptsName="dataSourceName"
      v-model:sortingOwnersValue="sortingOwnersValue"
      v-model:sortingActivitiesValue="sortingActivitiesValue"
    />

    <div class="app-table">
      <div class="app-table__head data-sources__table-head">
        <span>ID</span>
        <span>Data Source</span>
        <span>Description</span>
        <span>Timestamp</span>
      </div>
      <div class="app-table__body">
        <template v-if="dataSources?.length">
          <div
            v-for="item in dataSources"
            :key="item.attributes.id.toString()"
            class="app-table__row data-sources__table-row"
          >
            <div class="app-table__cell">
              <span class="app-table__title">ID</span>
              <span>{{ item.attributes.id.toString() }}</span>
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
                    class="app-btn app-btn_small app-btn_outlined w-min80"
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
          <div class="app-table__empty-stub">
            <p v-if="isLoading">Loading…</p>
            <p v-else>No items yet</p>
          </div>
        </template>
      </div>
    </div>

    <template v-if="dataSourcesCount > ITEMS_PER_PAGE">
      <Pagination
        class="mg-t32 mg-b32"
        v-model="currentPage"
        :pages="totalPages"
        @update:modelValue="paginationHandler"
      />
    </template>

    <div class="view-main__mobile-activities">
      <button class="app-btn w-full" type="button" @click="createDataSource()">
        Create data source
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import { callers } from '@/api/callers'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleError } from '@/helpers/errors'
import TitledLink from '@/components/TitledLink.vue'
import Pagination from '@/components/Pagination/Pagination.vue'
import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import DataSourceFormModal from '@/components/modals/DataSourceFormModal.vue'
import { wallet } from '@/api/wallet'
import SortRow from '@/components/SortLine.vue'

export default defineComponent({
  components: {
    TitledLink,
    Pagination,
    SortRow,
  },
  setup: function () {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const ITEMS_PER_PAGE = 4
    const currentPage = ref(1)
    const totalPages = ref(0)
    const dataSourcesCount = ref(0)
    const dataSources = ref([])
    const accountAddress = wallet.account.address
    const sortingActivitiesValue = ref('')
    const sortingOwnersValue = ref('')
    const dataSourceName = ref('')
    const loadDataSources = async () => {
      lockLoading()
      try {
        const res = await callers
          .getSortedDataSources(
            currentPage.value - 1,
            ITEMS_PER_PAGE,
            sortingActivitiesValue.value,
            sortingOwnersValue.value,
            dataSourceName.value
          )
          .then((response) => response.json())
          .then((data) => data)
        dataSources.value = res.data
        await getDataSourcesCount()
      } catch (error) {
        handleError(error as Error)
      }
      releaseLoading()
    }
    const getDataSourcesCount = async () => {
      const res = await callers.getCounts()
      dataSourcesCount.value = res.dataSourceCount.toNumber()
      totalPages.value = Math.ceil(dataSourcesCount.value / ITEMS_PER_PAGE)
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
    }
  },
})
</script>

<style lang="scss">
.data-sources {
  &__count-info {
    margin-bottom: 3.2rem;
  }

  &__sort-wrapper {
    display: flex;
    justify-content: flex-end;
  }

  &__sort {
    display: flex;
    gap: 2.4rem;
  }

  &__sort-item-title {
    font-size: 1.4rem;
    font-weight: 300;
    margin-right: 0.4rem;
  }

  &__table-head,
  &__table-row {
    grid:
      auto /
      minmax(2rem, 0.5fr)
      minmax(4rem, 3fr)
      minmax(4rem, 3fr)
      minmax(8rem, 2fr)
      minmax(8rem, 2fr);
  }
  &__table-activities {
    width: 100%;

    & > *:not(:last-child) {
      margin-bottom: 2.4rem;
    }
  }

  &__table-activities-item {
    display: flex;
    justify-content: flex-end;
    gap: 2.4rem;
  }
  &__table-cell {
    &_center {
      justify-content: center;
    }
    &_end {
      justify-content: flex-end;
    }
  }
}

@include respond-to(tablet) {
  .data-sources {
    &__table-activities {
      width: 100%;
    }

    &__table-activities-item {
      & > * {
        flex: 1;
      }
    }
    &__table-cell {
      &_center {
        justify-content: flex-start;
      }
      &_end {
        justify-content: flex-start;
      }
    }
    padding-bottom: 10rem;
    &__title-btn {
      display: none;
    }

    &__count-info {
      margin-bottom: 2.4rem;
    }

    &__sort {
      width: 100%;
      flex-direction: column;
      gap: 1.6rem;
    }

    &__sort-item {
      display: flex;
      flex-direction: column;
    }

    &__sort-item-title {
      margin: 0 0 0.4rem;
    }

    &__vue-picker {
      width: 100%;
    }

    &__table-row {
      grid: none;
    }
  }
}
</style>

<template>
  <div class="data-sources view-main">
    <div class="page-title">
      <h2 class="view-title">Data Sources</h2>
      <button
        class="
          app-btn app-btn_small
          create-data-source-btn create-data-source-btn_top
          fx-sae
        "
        type="button"
        @click="createDataSource()"
      >
        Create data source
      </button>
    </div>

    <template v-if="dataSourcesCount">
      <div class="data-sources__count-info">
        <p>{{ dataSourcesCount }} data sources found</p>
      </div>
    </template>

    <div class="app-table">
      <div class="app-table__head">
        <span>ID</span>
        <span>Data Source</span>
        <span>Description</span>
      </div>
      <div class="app-table__body">
        <template v-if="dataSources?.length">
          <div
            v-for="item in dataSources"
            :key="item.id.toString()"
            class="app-table__row"
          >
            <div class="app-table__cell">
              <span class="app-table__title">ID</span>
              <span>{{ item.id.toNumber() }}</span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Data Source</span>
              <TitledLink
                class="app-table__cell-txt app-table__link"
                :text="item.name"
                :to="`/data-sources/${item.id.toNumber()}`"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Description</span>
              <span>
                {{ item.description }}
              </span>
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
        @changePageNumber="paginationHandler($event)"
        :blocksPerPage="ITEMS_PER_PAGE"
        :total-length="dataSourcesCount"
        :startFrom="currentPage"
      />
    </template>

    <button
      class="
        app-btn
        create-data-source-btn create-data-source-btn_bottom
        fx-sae
      "
      type="button"
      @click="createDataSource()"
    >
      Create data source
    </button>
  </div>
</template>

<script lang="ts">
import { callers } from '@/api/callers'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleError } from '@/helpers/errors'
import { showDataSourceFormDialog } from '@/components/modals/DataSourceFormModal.vue'
import TitledLink from '@/components/TitledLink.vue'
import Pagination from '@/components/pagination/pagination.vue'
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  components: {
    TitledLink,
    Pagination,
  },
  setup: function () {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const ITEMS_PER_PAGE = 4
    const currentPage = ref(1)
    const dataSourcesCount = ref(0)
    const dataSources = ref()

    const loadDataSources = async () => {
      lockLoading()
      try {
        const response = await callers.getDataSources(
          ITEMS_PER_PAGE,
          (currentPage.value - 1) * ITEMS_PER_PAGE
        )

        dataSources.value = [...response.dataSources]
        await getDataSourcesCount()
      } catch (error) {
        handleError(error as Error)
      }
      releaseLoading()
    }

    const getDataSourcesCount = async () => {
      const res = await callers.getCounts()
      dataSourcesCount.value = res.dataSourceCount.toNumber()
    }

    const createDataSource = async () => {
      await showDataSourceFormDialog({
        onSubmit: (d) => {
          d.kill()
          loadDataSources()
        },
      })
    }

    const paginationHandler = (num: number) => {
      currentPage.value = num
      loadDataSources()
    }

    onMounted(async () => {
      await loadDataSources()
    })

    return {
      isLoading,
      ITEMS_PER_PAGE,
      currentPage,
      dataSourcesCount,
      dataSources,
      createDataSource,
      paginationHandler,
    }
  },
})
</script>

<style lang="scss" scoped>
.data-sources__count-info {
  margin-bottom: 3.2rem;

  @media screen and (max-width: 768px) {
    margin-bottom: 0;
  }
}

.app-table__head,
.app-table__row {
  grid:
    auto /
    minmax(3rem, 0.5fr)
    minmax(8rem, 2fr)
    minmax(8rem, 8fr);
}

.create-data-source-btn {
  &_bottom {
    display: none;
    width: 100%;
    @media (max-width: 768px) {
      display: block;
    }
  }
  &_top {
    display: block;
    @media (max-width: 768px) {
      display: none;
    }
  }
}

@media screen and (max-width: 768px) {
  .app-table__row {
    grid: none;
  }
}
</style>

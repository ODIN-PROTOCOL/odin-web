<template>
  <div class="view-main">
    <div class="view-main__title-wrapper">
      <h2 class="view-main__title">Data Sources</h2>
      <button
        class="view-main__title-btn app-btn app-btn_small fx-sae"
        type="button"
        @click="createDataSource()"
      >
        Create data source
      </button>
    </div>

    <template v-if="dataSourcesCount">
      <div class="view-main__count-info">
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

    <div class="view-main__mobile-activities">
      <button class="app-btn w-full" type="button" @click="createDataSource()">
        Create data source
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { callers } from '@/api/callers'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleError } from '@/helpers/errors'
import TitledLink from '@/components/TitledLink.vue'
import Pagination from '@/components/pagination/pagination.vue'
import { defineComponent, onMounted, ref } from 'vue'

import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import DataSourceFormModal from '@/components/modals/DataSourceFormModal.vue'

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
      await showDialogHandler(DataSourceFormModal, {
        onSubmit: async (d) => {
          d.kill()
          await loadDataSources()
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
.view-main {
  &__count-info {
    margin-bottom: 3.2rem;
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

@include respond-to(tablet) {
  .view-main {
    padding-bottom: 10rem;

    &__count-info {
      margin-bottom: 0;
    }

    &__title-btn {
      display: none;
    }
  }

  .app-table__row {
    grid: none;
  }
}
</style>

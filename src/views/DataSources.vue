<template>
  <div class="data-sources view-main">
    <div class="fx-row mg-b32">
      <h2 class="view-title">Data sources</h2>
      <button
        class="app-btn-2nd fx-sae"
        type="button"
        @click="createDataSource()"
      >
        Create data source
      </button>
    </div>
    <div class="app-table">
      <div class="data-sources__table-head app-table__head">
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> ID </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Name </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Description </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Owner </span>
        </div>
      </div>
      <template v-if="dataSources?.length">
        <div
          v-for="item in dataSources"
          :key="item.id.toString()"
          class="data-sources__table-row app-table__row"
        >
          <div class="app-table__cell">
            <TitledSpan
              class="app-table__cell-txt"
              :text="item.id.toString()"
            />
          </div>
          <div class="app-table__cell">
            <TitledSpan class="app-table__cell-txt" :text="item.name" />
          </div>
          <div class="app-table__cell">
            <TitledSpan class="app-table__cell-txt" :text="item.description" />
          </div>
          <div class="app-table__cell">
            <TitledSpan
              class="app-table__cell-txt"
              :text="$cropAddress(item.owner)"
              :title="item.owner"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <div class="app-table__row">
          <p class="app-table__empty-stub">No items yet</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { callers } from '@/api/callers'
import { showDataSourceFormDialog } from '@/components/modals/DataSourceFormModal.vue'
import TitledSpan from '@/components/TitledSpan.vue'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  components: { TitledSpan },
  setup() {
    const dataSources = ref()
    const loadDataSources = async () => {
      const response = await callers.getDataSources(100)
      console.debug('DataSources:', response)
      dataSources.value = response.dataSources
    }
    loadDataSources()

    const createDataSource = async () => {
      showDataSourceFormDialog({
        onSubmit: (d) => {
          d.kill()
          loadDataSources()
        },
      })
    }

    return { dataSources, createDataSource }
  },
})
</script>

<style scoped>
.data-sources__table-head,
.data-sources__table-row {
  grid:
    auto /
    minmax(2rem, 0.1fr) minmax(8rem, 0.5fr) minmax(8rem, 1fr) minmax(8rem, 0.5fr);
}
</style>

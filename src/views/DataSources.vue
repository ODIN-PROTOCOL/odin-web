<template>
  <div class="data-sources">
    <h3>Data sources</h3>
    <button class="app-btn mg-b8" type="button" @click="createDataSource()">
      Create data source
    </button>
    <div class="app-table">
      <div class="data-sources__table-head app-table__head">
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
      <div
        v-for="item in dataSources"
        :key="item.id"
        class="data-sources__table-row app-table__row"
      >
        <div class="app-table__cell">
          <span class="app-table__cell-txt" :title="item.name">
            {{ item.name }}
          </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt" :title="item.description">
            {{ item.description }}
          </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt" :title="item.owner">
            {{ $cropAddress(item.owner) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getQueryClient } from '@/api/client/queryClient'
import { showDataSourceFormDialog } from '@/components/modals/DataSourceFormModal.vue'
import Long from 'long'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const queries = getQueryClient()

    const dataSources = ref()
    const loadDataSources = async () => {
      const response = await queries.oracle.unverified.dataSources(
        new Long(100)
      )
      console.log(response, response.dataSources)
      dataSources.value = response.dataSources
    }
    loadDataSources()

    const createDataSource = async () => {
      const res = await showDataSourceFormDialog({
        onSubmit: (d) => {
          d.kill()
          loadDataSources()
        },
      })
      console.log(res)
    }

    return { dataSources, createDataSource }
  },
})
</script>

<style scoped>
.data-sources__table-head,
.data-sources__table-row {
  grid: auto / minmax(8rem, 14rem) minmax(0, 1fr) minmax(8rem, 14rem);
}
</style>

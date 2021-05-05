<template>
  <div class="data-sources">
    <h3>Data sources</h3>
    <button type="button" @click="createDataSource()">
      Create data source
    </button>
    <div class="data-sources__table">
      <div class="data-sources__table-head">
        <div class="data-sources__table-cell"><span>Column</span></div>
        <div class="data-sources__table-cell"><span>Column</span></div>
        <div class="data-sources__table-cell"><span>Column</span></div>
        <div class="data-sources__table-cell"><span>Column</span></div>
      </div>
      <div
        v-for="item in dataSources"
        :key="item.id"
        class="data-sources__table-row"
      >
        <div class="data-sources__table-cell"><span>Cell</span></div>
        <div class="data-sources__table-cell"><span>Cell</span></div>
        <div class="data-sources__table-cell"><span>Cell</span></div>
        <div class="data-sources__table-cell"><span>Cell</span></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getQueryClient } from '@/api/client/queryClient'
import { showCreateDataSourceFormDialog } from '@/components/modals/DataSourceFormModal.vue'
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
      dataSources.value = response.dataSources
      console.log(dataSources.value)
    }
    loadDataSources()

    const createDataSource = async () => {
      const res = await showCreateDataSourceFormDialog()
      console.log(res)
    }

    return { dataSources, createDataSource }
  },
})
</script>

<style scoped>
.data-sources__table-head,
.data-sources__table-row {
  display: grid;
  grid: auto / auto-flow auto;
}
</style>

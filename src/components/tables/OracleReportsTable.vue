<template>
  <div>
    <div class="app-table">
      <div class="app-table__head">
        <span>Oracle reports</span>
        <span>Oracle script</span>
        <span>Tx hash</span>
      </div>
      <div class="app-table__body">
        <template v-if="reports.length">
          <div
            v-for="item in filteredReports"
            :key="item.delegation.delegatorAddress"
            class="app-table__row"
          >
            <div class="app-table__cell">
              <span class="app-table__title">Oracle report</span>
              <!-- TODO get oracle report id from reports -->
              <TitledLink class="app-table__cell-txt app-table__link" />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Oracle script</span>
              <span class="app-table__cell-txt">
                <!-- TODO get oracle script id from report -->
              </span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Tx hash</span>
              <span class="app-table__cell-txt">
                <!-- TODO get tx hash from report -->
              </span>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="app-table__empty-stub">
            <p>No items yet</p>
          </div>
        </template>
      </div>
    </div>

    <template v-if="reportsCount > ITEMS_PER_PAGE">
      <Pagination
        @changePageNumber="paginationHandler($event)"
        :blocksPerPage="ITEMS_PER_PAGE"
        :total-length="reportsCount"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, toRef } from 'vue'
import TitledLink from '@/components/TitledLink.vue'
import Pagination from '@/components/pagination/pagination.vue'

export default defineComponent({
  components: { TitledLink, Pagination },
  props: {
    reports: { type: Array, required: true },
  },
  setup: function (props) {
    const ITEMS_PER_PAGE = 5
    const currentPage = ref(1)
    const reportsCount = ref()
    const filteredReports = ref()

    const _reports = toRef(props, 'reports')

    const filterReports = (newPage: number) => {
      let tempArr = _reports.value

      if (newPage === 1) {
        filteredReports.value = tempArr.slice(0, newPage * ITEMS_PER_PAGE)
      } else {
        filteredReports.value = tempArr.slice(
          (newPage - 1) * ITEMS_PER_PAGE,
          (newPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        )
      }
      currentPage.value = newPage
    }

    const paginationHandler = (num: number) => {
      filterReports(num)
    }

    onMounted(() => {
      filterReports(currentPage.value)
      reportsCount.value = _reports.value.length
    })

    return {
      ITEMS_PER_PAGE,
      reportsCount,
      filteredReports,
      paginationHandler,
    }
  },
})
</script>

<style lang="scss" scoped></style>

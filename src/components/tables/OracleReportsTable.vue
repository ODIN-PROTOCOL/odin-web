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
          <div v-for="item in reports" :key="item.id" class="app-table__row">
            <div class="app-table__cell">
              <span class="app-table__title">Oracle report</span>
              {{ item.id }}
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Oracle script</span>
              <span class="app-table__cell-txt">
                {{ item.oracle_script }}
              </span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Tx hash</span>
              <a
                class="app-table__cell-txt app-table__link"
                :href="`${API_CONFIG.odinScan}/transactions/${item.tx_hash}`"
              >
                {{ '0x' + item.tx_hash.toLowerCase() }}
              </a>
            </div>
          </div>
        </template>
        <template v-else>
          <SkeletonTable v-if="isLoading" :header-titles="headerTitles" />
          <div v-else class="app-table__empty-stub">
            <p class="empty mg-t32">No items yet</p>
          </div>
        </template>
      </div>
    </div>

    <template v-if="reportsCount > ITEMS_PER_PAGE">
      <AppPagination
        class="mg-t32 mg-b32"
        v-model="currentPage"
        :pages="totalPages"
        @update:modelValue="paginationHandler"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import { callers } from '@/api/callers'
import { API_CONFIG } from '@/api/api-config'
import SkeletonTable from '@/components/SkeletonTable.vue'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { Router, useRouter } from 'vue-router'
import { setPageWithTab } from '@/router'

export default defineComponent({
  components: { AppPagination, SkeletonTable },
  props: {
    proposerAddress: { type: String, required: true },
  },
  setup(props) {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const router: Router = useRouter()
    const { page, tab } = router.currentRoute.value.query
    const ITEMS_PER_PAGE = 5
    const currentPage = ref(1)
    const totalPages = ref(0)
    const reportsCount = ref(0)
    const reports = ref([])
    const headerTitles = [
      { title: 'Oracle reports' },
      { title: 'Oracle script' },
      { title: 'Tx hash' },
    ]

    const getReports = async () => {
      lockLoading()
      try {
        const response = await callers.getOracleReports(
          props.proposerAddress,
          currentPage.value - 1,
          ITEMS_PER_PAGE
        )
        if (currentPage.value > 1 && !response.data.data) {
          currentPage.value = 1
          setPageWithTab(currentPage.value, String(tab))
          getReports()
        }

        if (response.data.data) {
          reportsCount.value = response.data.tx_count
          totalPages.value = Math.ceil(reportsCount.value / ITEMS_PER_PAGE)
          reports.value = response.data.data
        }
      } catch (error) {
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
      }
      releaseLoading()
    }
    const paginationHandler = async (num: number) => {
      currentPage.value = num
      setPageWithTab(currentPage.value, String(tab))
      await getReports()
    }
    onMounted(async () => {
      if (page && Number(page) > 1 && tab === 'oracle reports') {
        currentPage.value = Number(page)
      }
      await getReports()
    })
    return {
      ITEMS_PER_PAGE,
      currentPage,
      totalPages,
      reportsCount,
      reports,
      paginationHandler,
      API_CONFIG,
      isLoading,
      headerTitles,
    }
  },
})
</script>

<style lang="scss" scoped></style>

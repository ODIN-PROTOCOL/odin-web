<template>
  <div class="requests view-main">
    <div class="view-main__title-wrapper">
      <h2 class="view-main__title">Requests</h2>
      <button
        class="requests__title-btn app-btn app-btn--medium"
        type="button"
        @click="createRequest()"
      >
        Create Request
      </button>
    </div>

    <div class="view-main__count-info requests__count-info">
      <skeleton-loader
        v-if="isLoading"
        :height="24"
        :rounded="true"
        animation="wave"
        color="rgb(225, 229, 233)"
      />
      <p v-else>{{ requestsCount }} requests found</p>
    </div>

    <div class="app-table requests__table">
      <div class="app-table__head requests__table-head">
        <span>Request ID</span>
        <span>Sender</span>
        <span>Oracle Script ID</span>
        <span>Report Status</span>
        <span>Timestamp</span>
      </div>
      <div class="app-table__body">
        <template v-if="requests?.length">
          <div
            v-for="item in requests"
            :key="item.request.id.toString()"
            class="app-table__row requests__table-row"
          >
            <div class="app-table__cell">
              <span class="app-table__title">Request ID</span>
              <TitledLink
                class="app-table__cell-txt app-table__link"
                :text="`#${item.request.id}`"
                :to="`/requests/${item.request.id}`"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Sender</span>
              <a
                class="app-table__cell-txt app-table__link"
                :href="senderLink(item)"
              >
                {{ item.request.client_id }}
              </a>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Oracle Script ID</span>
              <TitledLink
                class="app-table__cell-txt app-table__link"
                :text="`#${item.request.oracle_script_id}`"
                :to="`/oracle-scripts/${item.request.oracle_script_id}`"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Report Status</span>
              <Progressbar
                :min="Number(item.result.min_count)"
                :max="Number(item.result.ask_count)"
                :current="Number(item.result.ans_count) || 0"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Timestamp</span>
              <div>{{}}</div>
              <span>{{
                $fDate(new Date(item.result.request_time * 1000))
              }}</span>
            </div>
          </div>
        </template>
        <template v-else>
          <SkeletonTable
            v-if="isLoading"
            :header-titles="headerTitles"
            class-string="requests__table-row"
          />
          <div v-else class="app-table__empty-stub">
            <p class="empty mg-t32">No items yet</p>
          </div>
        </template>
      </div>
    </div>

    <template v-if="requestsCount > ITEMS_PER_PAGE && !isLoading">
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
        @click="createRequest()"
      >
        Create Request
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { callers } from '@/api/callers'
import { API_CONFIG } from '@/api/api-config'
import TitledLink from '@/components/TitledLink.vue'
import Progressbar from '@/components/Progressbar.vue'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import RequestFormModal from '@/components/modals/RequestFormModal.vue'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import SkeletonTable from '@/components/SkeletonTable.vue'

export default defineComponent({
  components: { TitledLink, Progressbar, AppPagination, SkeletonTable },
  setup() {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const ITEMS_PER_PAGE = 25
    const currentPage = ref(1)
    const totalPages = ref(0)
    const requests = ref()
    const requestsCount = ref()
    const maxAskCount = ref()
    const senderLink = computed(
      () => (item: { request: { client_id: string } }) => {
        return `${API_CONFIG.odinScan}/account/${item.request.client_id}`
      }
    )
    const headerTitles = [
      { title: 'Request ID' },
      { title: 'Sender' },
      { title: 'Oracle Script ID' },
      { title: 'Report Status' },
      { title: 'Timestamp' },
    ]
    const getRequests = async () => {
      lockLoading()
      try {
        const req = await callers.getRequests(
          ITEMS_PER_PAGE,
          (currentPage.value - 1) * ITEMS_PER_PAGE
        )
        requests.value = req.data.result.result.requests
        await getRequestsCount()
      } catch (error) {
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
      }
      releaseLoading()
    }

    const getRequestsCount = async () => {
      lockLoading()
      try {
        const res = await callers.getCounts()
        requestsCount.value = Number(res.requestCount)
        totalPages.value = Math.ceil(requestsCount.value / ITEMS_PER_PAGE)
      } catch (error) {
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
      }
      releaseLoading()
    }

    const getParams = async () => {
      lockLoading()
      try {
        const response = await callers.getOracleParams()
        maxAskCount.value = response.params?.maxAskCount.toNumber()
      } catch (error) {
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
      }
      releaseLoading()
    }

    const createRequest = async () => {
      await showDialogHandler(
        RequestFormModal,
        {
          onSubmit: async (d) => {
            d.kill()
            await getRequests()
          },
        },
        { maxAskCount: maxAskCount.value }
      )
    }

    const paginationHandler = (num: number) => {
      currentPage.value = num
      getRequests()
    }

    onMounted(async () => {
      await getParams()
      await getRequests()
    })

    return {
      API_CONFIG,
      ITEMS_PER_PAGE,
      currentPage,
      totalPages,
      requests,
      requestsCount,
      createRequest,
      paginationHandler,
      senderLink,
      isLoading,
      headerTitles,
    }
  },
})
</script>

<style lang="scss" scoped>
.requests__count-info {
  margin-bottom: 3.2rem;
}
@include respond-to(tablet) {
  .requests {
    padding-bottom: 10rem;
  }
  .requests__count-info {
    margin-bottom: 0;
  }
  .requests__title-btn {
    display: none;
  }
}
</style>

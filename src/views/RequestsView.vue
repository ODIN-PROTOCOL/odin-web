<template>
  <div class="requests-view view-main">
    <div class="view-main__title-wrapper">
      <h2 class="view-main__title">Requests</h2>
      <button
        v-if="accountAddress"
        class="requests-view__title-btn app-btn app-btn--medium"
        type="button"
        @click="createRequest()"
      >
        Create Request
      </button>
    </div>

    <div class="view-main__count-info requests-view__count-info">
      <skeleton-loader v-if="isLoading" height="24" width="150" shimmer pill />
      <p v-else>{{ requestsCount }} requests found</p>
    </div>

    <div class="app-table requests-view__table">
      <div class="app-table__head requests-view__table-head">
        <span>Request ID</span>
        <span>Oracle Script ID</span>
        <span>Report Status</span>
        <span>Timestamp</span>
      </div>
      <div class="app-table__body">
        <template v-if="requests?.length">
          <div
            v-for="item in requests"
            :key="item.request.id.toString()"
            class="app-table__row requests-view__table-row"
          >
            <div class="app-table__cell">
              <span class="app-table__title">Request ID</span>
              <TitledLink
                class="app-table__cell-txt app-table__link"
                :text="`#${item.request.id}`"
                :to="{
                  name: $routes.requestDetails,
                  params: { id: item.request.id },
                }"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Oracle Script ID</span>
              <TitledLink
                class="app-table__cell-txt app-table__link"
                :text="`#${item.request.oracle_script_id}`"
                :to="{
                  name: $routes.oracleScriptDetails,
                  params: { id: item.request.oracle_script_id },
                }"
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
            class-string="requests-view__table-row"
          />
          <div v-else class="app-table__empty-stub">
            <p class="empty mg-t32">No items yet</p>
          </div>
        </template>
      </div>
    </div>

    <template v-if="requestsCount > ITEMS_PER_PAGE">
      <AppPagination
        class="mg-t32 mg-b32"
        v-model="currentPage"
        :pages="totalPages"
        @update:modelValue="paginationHandler"
      />
    </template>

    <div v-if="accountAddress" class="view-main__mobile-activities">
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

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { callers } from '@/api/callers'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { wallet } from '@/api/wallet'
import { RequestFormModal } from '@/components/modals'
import TitledLink from '@/components/TitledLink.vue'
import Progressbar from '@/components/ProgressbarTool.vue'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import SkeletonTable from '@/components/SkeletonTable.vue'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const ITEMS_PER_PAGE = 25
const currentPage = ref(1)
const totalPages = ref(0)
const requests = ref()
const requestsCount = ref()
const maxAskCount = ref()
const accountAddress = wallet.isEmpty ? '' : wallet.account.address

const headerTitles = [
  { title: 'Request ID' },
  { title: 'Oracle Script ID' },
  { title: 'Report Status' },
  { title: 'Timestamp' },
]
const getRequests = async () => {
  lockLoading()
  try {
    requests.value = []
    const req = await callers.getRequests(
      ITEMS_PER_PAGE,
      (currentPage.value - 1) * ITEMS_PER_PAGE,
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
      onSubmit: async d => {
        await getRequests()
        d.kill()
      },
    },
    { maxAskCount: maxAskCount.value },
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
</script>

<style lang="scss" scoped>
.requests-view__count-info {
  margin-bottom: 3.2rem;
}
@include respond-to(tablet) {
  .requests-view {
    padding-bottom: 10rem;
  }
  .requests-view__count-info {
    margin-bottom: 0;
  }
  .requests-view__title-btn {
    display: none;
  }
}
</style>

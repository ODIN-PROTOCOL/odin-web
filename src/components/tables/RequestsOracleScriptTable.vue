<template>
  <div class="requests-oracle-script">
    <div v-if="requests" class="app-table">
      <div class="app-table__head requests-oracle-script__head">
        <span>Request ID</span>
        <span>Transaction hash</span>
        <span>Timestamp</span>
      </div>
      <div class="app-table__body">
        <template v-if="requests.length">
          <div
            v-for="(item, index) in requests"
            :key="item.attributes.block_height"
            class="app-table__row requests-oracle-script__row"
          >
            <div class="app-table__cell">
              <span class="app-table__title">Request ID</span>
              <TitledLink
                class="app-table__cell-txt app-table__link"
                :text="`#${item.id}`"
                :to="{
                  name: $routes.requestDetails,
                  params: { id: item.id },
                }"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Transaction hash</span>
              <a
                class="app-table__cell-txt app-table__link"
                :href="`${
                  API_CONFIG.odinScan
                }/transactions/${getRequestItemTxHash(index)}`"
              >
                {{ item.attributes.tx_hash }}
              </a>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Timestamp</span>
              <span>{{
                $fDate(
                  new Date(item.attributes.timestamp * 1000),
                  'HH:mm dd.MM.yy',
                )
              }}</span>
            </div>
          </div>
        </template>
        <template v-else>
          <SkeletonTable
            v-if="isLoading"
            :header-titles="headerTitles"
            class-string="requests-oracle-script__row"
          />
          <div v-else class="app-table__empty-stub">
            <p class="empty mg-t32">No items yet</p>
          </div>
        </template>
      </div>
    </div>

    <template v-if="requestsCount > ITEMS_PER_PAGE">
      <AppPagination
        class="mg-t32 mg-b32 mb-60"
        v-model="currentPage"
        :pages="totalPages"
        @update:modelValue="getOracleScriptRequests"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { API_CONFIG } from '@/api/api-config'
import { callers } from '@/api/callers'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import TitledLink from '@/components/TitledLink.vue'
import SkeletonTable from '@/components/SkeletonTable.vue'

const props = defineProps<{
  oracleScriptId: string
}>()

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()

const ITEMS_PER_PAGE = 5
const currentPage = ref(1)
const totalPages = ref(0)
const requests = ref()
const requestsCount = ref()
const headerTitles = [
  { title: 'Request ID' },
  { title: 'Transaction hash' },
  { title: 'Timestamp' },
]
const getOracleScriptRequests = async () => {
  lockLoading()
  try {
    requests.value = []
    const response = await callers
      .getOracleScriptRequests(
        props.oracleScriptId,
        currentPage.value - 1,
        ITEMS_PER_PAGE,
      )
      .then(response => response.json())
      .then(data => data)
    requests.value = response.data
    requestsCount.value = response.total_count || 0
    totalPages.value = Math.ceil(requestsCount.value / ITEMS_PER_PAGE)
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}
const getRequestItemTxHash = (index: number) => {
  return requests.value[index]?.attributes?.tx_hash.split('0x')[1] || ''
}
onMounted(async () => {
  await getOracleScriptRequests()
})
</script>

<style lang="scss" scoped>
.requests-oracle-script {
  margin-bottom: 3rem;
}
@include respond-to(small) {
  .app-table__title {
    min-width: 12rem;
  }
}
</style>

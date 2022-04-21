<template>
  <div class="requests-oracle-script">
    <template v-if="requests">
      <div class="app-table">
        <div class="app-table__head">
          <span>Request ID</span>
          <span>Transaction hash</span>
          <span>Timestamp</span>
        </div>
        <div class="app-table__body">
          <template v-if="requests.length">
            <div
              v-for="(item, index) in requests"
              :key="item.attributes.block_height"
              class="app-table__row"
            >
              <div class="app-table__cell">
                <span class="app-table__title">Request ID</span>
                <TitledLink
                  class="app-table__cell-txt app-table__link"
                  :text="`#${item.id}`"
                  :to="`/requests/${item.id}`"
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
                    'HH:mm dd.MM.yy'
                  )
                }}</span>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="app-table__empty-stub">
              <p>No items yet</p>
            </div>
          </template>
        </div>
        <template v-if="requestsCount > ITEMS_PER_PAGE">
          <Pagination
            class="mg-t32 mg-b32 mb-60"
            v-model="currentPage"
            :pages="totalPages"
            @update:modelValue="getOracleScriptRequests"
          />
        </template>
      </div>
    </template>
    <template v-else>
      <div class="app-table__empty-stub">
        <p v-if="isLoading">Loading…</p>
        <p v-else>No items yet</p>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { toHex } from '@cosmjs/encoding'
import { API_CONFIG } from '@/api/api-config'
import Pagination from '@/components/Pagination/Pagination.vue'
import { callers } from '@/api/callers'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleError } from '@/helpers/errors'
import TitledLink from '@/components/TitledLink.vue'

export default defineComponent({
  components: { Pagination, TitledLink },
  props: {
    oracleScriptId: { type: String, required: true },
  },
  setup: function (props) {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()

    const ITEMS_PER_PAGE = 5
    const currentPage = ref(1)
    const totalPages = ref(0)
    const requests = ref()
    const requestsCount = ref()

    const getOracleScriptRequests = async () => {
      lockLoading()
      try {
        const response = await callers
          .getOracleScriptRequests(
            props.oracleScriptId,
            currentPage.value - 1,
            ITEMS_PER_PAGE
          )
          .then((response) => response.json())
          .then((data) => data)
        requests.value = response.data
        requestsCount.value = response.total_count || 0
        totalPages.value = Math.ceil(requestsCount.value / ITEMS_PER_PAGE)
      } catch (error) {
        handleError(error as Error)
      }
      releaseLoading()
    }
    const getRequestItemTxHash = (index: number) => {
      return requests.value[index]?.attributes?.tx_hash.split('0x')[1] || ''
    }
    onMounted(async () => {
      await getOracleScriptRequests()
    })

    return {
      isLoading,
      API_CONFIG,
      ITEMS_PER_PAGE,
      currentPage,
      totalPages,
      requestsCount,
      requests,
      toHex,
      getOracleScriptRequests,
      getRequestItemTxHash,
    }
  },
})
</script>

<style lang="scss" scoped>
.requests-oracle-script {
  margin-bottom: 3rem;
}
.app-table__head,
.app-table__row {
  grid:
    auto /
    minmax(3rem, 0.5fr)
    minmax(8rem, 2fr)
    minmax(8rem, 0.5fr);
}
@include respond-to(tablet) {
  .app-table__head,
  .app-table__row {
    grid: none;
  }
}
@include respond-to(small) {
  .app-table__title {
    min-width: 12rem;
  }
}
</style>

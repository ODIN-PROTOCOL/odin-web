<template>
  <div class="view-main">
    <div class="view-main__title-wrapper">
      <h2 class="view-main__title">Requests</h2>
      <button
        class="view-main__title-btn app-btn app-btn_small fx-sae"
        type="button"
        @click="createRequest()"
      >
        Create Request
      </button>
    </div>

    <template v-if="requestsCount">
      <div class="view-main__count-info">
        <p>{{ requestsCount }} requests found</p>
      </div>
    </template>

    <div class="app-table">
      <div class="app-table__head">
        <span>Request ID</span>
        <span>Sender</span>
        <span>Oracle Script ID</span>
        <span>Report Status</span>
        <span>Timestamp</span>
      </div>
      <div class="table__body">
        <template v-if="requests?.length">
          <div
            v-for="item in requests"
            :key="item.responsePacketData.requestId.toString()"
            class="app-table__row"
          >
            <div class="app-table__cell">
              <span class="app-table__title">Request ID</span>
              <TitledLink
                class="app-table__cell-txt app-table__link"
                :text="item.responsePacketData.requestId.toString()"
                :to="`/requests/${item.responsePacketData.requestId}`"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Sender</span>
              <a
                class="app-table__cell-txt app-table__link"
                :href="senderLink(item)"
              >
                {{ item.requestPacketData.clientId }}
              </a>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Oracle Script ID</span>
              <TitledLink
                class="app-table__cell-txt app-table__link"
                :text="item.requestPacketData.oracleScriptId.toString()"
                :to="`/oracle-scripts/${item.requestPacketData.oracleScriptId}`"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Report Status</span>
              <Progressbar
                :min="Number(item.requestPacketData.minCount)"
                :max="Number(item.requestPacketData.askCount)"
                :current="Number(item.responsePacketData.ansCount)"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Timestamp</span>
              <span>{{ $fDate(item.responsePacketData.requestTime) }}</span>
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

    <template v-if="requestsCount > ITEMS_PER_PAGE">
      <Pagination
        @changePageNumber="paginationHandler($event)"
        :blocksPerPage="ITEMS_PER_PAGE"
        :total-length="requestsCount"
      />
    </template>

    <div class="view-main__mobile-activities">
      <button class="app-btn w-full" type="button" @click="createRequest()">
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
import Pagination from '@/components/pagination/pagination.vue'
import { RequestResult } from '@provider/codec/oracle/v1/oracle'

import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import RequestFormModal from '@/components/modals/RequestFormModal.vue'

export default defineComponent({
  components: { TitledLink, Progressbar, Pagination },
  setup() {
    const ITEMS_PER_PAGE = 5
    const currentPage = ref(1)
    const requests = ref()
    const requestsCount = ref()
    const maxAskCount = ref()
    const senderLink = computed(() => (item: RequestResult) => {
      return `${API_CONFIG.odinScan}/account/${item.requestPacketData?.clientId}`
    })

    const getRequests = async () => {
      const res = await callers.getRequests(
        ITEMS_PER_PAGE,
        (currentPage.value - 1) * ITEMS_PER_PAGE
      )
      requests.value = res.requests
      await getRequestsCount()
    }

    const getRequestsCount = async () => {
      const res = await callers.getCounts()
      requestsCount.value = res.requestCount.toNumber()
    }

    const getParams = async () => {
      const response = await callers.getOracleParams()
      maxAskCount.value = response.params?.maxAskCount.toNumber()
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
      requests,
      requestsCount,
      createRequest,
      paginationHandler,
      senderLink,
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
}
</style>

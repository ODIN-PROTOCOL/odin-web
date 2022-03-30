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
            :key="item.response_packet_data.request_id.toString()"
            class="app-table__row"
          >
            <div class="app-table__cell">
              <span class="app-table__title">Request ID</span>
              <TitledLink
                class="app-table__cell-txt app-table__link"
                :text="item.response_packet_data.request_id.toString()"
                :to="`/requests/${item.response_packet_data.request_id}`"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Sender</span>
              <a
                class="app-table__cell-txt app-table__link"
                :href="senderLink(item)"
              >
                {{ item.request_packet_data.client_id }}
              </a>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Oracle Script ID</span>
              <TitledLink
                class="app-table__cell-txt app-table__link"
                :text="item.request_packet_data.oracle_script_id.toString()"
                :to="`/oracle-scripts/${item.request_packet_data.oracle_script_id}`"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Report Status</span>
              <Progressbar
                :min="Number(item.request_packet_data.min_count)"
                :max="Number(item.request_packet_data.ask_count)"
                :current="Number(item.response_packet_data.ans_count) || 0"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Timestamp</span>
              <div>{{}}</div>
              <span>{{
                $fDate(new Date(item.response_packet_data.request_time * 1000))
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
    </div>

    <template v-if="requestsCount > ITEMS_PER_PAGE">
      <Pagination
        class="mg-t32 mg-b32"
        v-model="currentPage"
        :pages="totalPages"
        @update:modelValue="paginationHandler"
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
import Pagination from '@/components/Pagination/Pagination.vue'
// import { RequestResult } from '@provider/codec/oracle/v1/oracle'

import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import RequestFormModal from '@/components/modals/RequestFormModal.vue'

export default defineComponent({
  components: { TitledLink, Progressbar, Pagination },
  setup() {
    const ITEMS_PER_PAGE = 5
    const currentPage = ref(1)
    const totalPages = ref(0)
    const requests = ref()
    const requestsCount = ref()
    const maxAskCount = ref()
    const senderLink = computed(() => (item: any) => {
      return `${API_CONFIG.odinScan}/account/${item.request_packet_data?.client_id}`
    })

    const getRequests = async () => {
      // TODO: make it work through callers.getRequests
      await fetch(
        `${API_CONFIG.rpc}api/oracle/requests?limit=${ITEMS_PER_PAGE}&offset=${
          (currentPage.value - 1) * ITEMS_PER_PAGE
        }&reverse=true`
      )
        .then((requests) => requests.json())
        .then((data) => {
          requests.value = data.result.result.requests
        })
      await getRequestsCount()
    }

    const getRequestsCount = async () => {
      // TODO: make it work through callers.getCounts
      await fetch(`${API_CONFIG.rpc}api/oracle/counts`)
        .then((requests) => requests.json())
        .then((data) => {
          requestsCount.value = data.result.result.request_count
        })
      // const res = await callers.getCounts()
      // requestsCount.value = res.requestCount.toNumber()
      totalPages.value = Math.ceil(requestsCount.value / ITEMS_PER_PAGE)
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
      currentPage,
      totalPages,
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

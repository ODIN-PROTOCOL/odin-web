<template>
  <div class="requests view-main">
    <div class="page-title fx-row">
      <h2 class="view-title">Requests</h2>
      <button
        class="app-btn create-request-btn create-request-btn_top fx-sae"
        type="button"
        @click="createRequest()"
      >
        Create Request
      </button>
    </div>

    <template v-if="requestsCount">
      <div class="requests__count-info fx-row">
        <p>{{ requestsCount }} requests found</p>
      </div>
    </template>

    <div class="app-table">
      <div class="app-table__head">
        <span>Request ID</span>
        <span>Sender</span>
        <span>Oracle Script ID</span>
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
                class="app-table__link"
                :text="item.responsePacketData.requestId.toString()"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Sender</span>
              <TitledLink
                class="app-table__link"
                :text="item.requestPacketData.clientId.toString()"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Oracle Script ID</span>
              <TitledLink
                class="app-table__cell-txt app-table__link"
                :text="item.requestPacketData.oracleScriptId.toString()"
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

    <Pagination
      @changePageNumber="paginationHandler($event)"
      :blocksPerPage="ITEMS_PER_PAGE"
      :total-length="requestsCount"
    />

    <button
      class="app-btn create-request-btn create-request-btn_bottom fx-sae"
      type="button"
      @click="createRequest()"
    >
      Create Request
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { callers } from '@/api/callers'
import TitledLink from '@/components/TitledLink.vue'
import Pagination from '@/components/pagination/pagination.vue'

export default defineComponent({
  components: { TitledLink, Pagination },
  setup() {
    const ITEMS_PER_PAGE = 5
    const currentPage = ref(1)
    const requests = ref()
    const requestsCount = ref()

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

    const createRequest = () => {
      // TODO create request
      console.log('create request')
    }

    const paginationHandler = (num: number) => {
      currentPage.value = num
      getRequests()
    }

    onMounted(async () => {
      await getRequests()
    })

    return {
      ITEMS_PER_PAGE,
      requests,
      requestsCount,
      createRequest,
      paginationHandler,
    }
  },
})
</script>

<style lang="scss" scoped>
.requests__count-info {
  margin-bottom: 3.2rem;

  @media screen and (max-width: 768px) {
    margin-bottom: 0;
  }
}

.create-request-btn {
  &_bottom {
    display: none;
    width: 100%;
    @media screen and (max-width: 768px) {
      display: block;
    }
  }
  &_top {
    display: block;
    @media screen and (max-width: 768px) {
      display: none;
    }
  }
}
</style>

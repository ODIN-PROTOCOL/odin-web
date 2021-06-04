<template>
  <div class="requests view-main">
    <div class="fx-row mg-b32">
      <h2 class="view-title">Requests</h2>
    </div>

    <div class="app-table">
      <div class="requests__table-head app-table__head">
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> ID </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Script ID </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Ans. Count </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Requested at</span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Resolved at</span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Status </span>
        </div>
      </div>
      <template v-if="requests?.length">
        <button
          v-for="item in requests"
          :key="item.responsePacketData.requestId.toString()"
          class="app-table__row-btn"
          type="button"
          @click="showRequest(item)"
        >
          <div class="requests__table-row app-table__row">
            <div class="app-table__cell">
              <TitledSpan
                class="app-table__cell-txt"
                :text="item.responsePacketData.requestId.toString()"
              />
            </div>
            <div class="app-table__cell">
              <TitledSpan
                class="app-table__cell-txt"
                :text="item.requestPacketData.oracleScriptId.toString()"
              />
            </div>
            <div class="app-table__cell">
              <TitledSpan
                class="app-table__cell-txt"
                :text="item.responsePacketData.ansCount.toString()"
              />
            </div>
            <div class="app-table__cell">
              <TitledSpan
                class="app-table__cell-txt"
                :text="$fDate(item.responsePacketData.requestTime)"
              />
            </div>
            <div class="app-table__cell">
              <TitledSpan
                class="app-table__cell-txt"
                :text="$fDate(item.responsePacketData.resolveTime)"
              />
            </div>
            <div class="app-table__cell">
              <TitledSpan
                class="app-table__cell-txt"
                :text="$tRequestStatus(item.responsePacketData.resolveStatus)"
              />
            </div>
          </div>
        </button>
      </template>
      <template v-else>
        <div class="app-table__row">
          <p class="app-table__empty-stub">No items yet</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { callers } from '@/api/callers'
import { showRequestDialog } from '@/components/modals/RequestModal.vue'
import TitledSpan from '@/components/TitledSpan.vue'
import { RequestResultDecoded } from '@/helpers/requestResultDecoders'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  components: { TitledSpan },
  setup() {
    const requests = ref()
    const loadRequests = async () => {
      const response = await callers.getRequests(100)
      console.debug('Requests:', response)
      requests.value = response.requests
    }
    loadRequests()

    const showRequest = (request: RequestResultDecoded) => {
      showRequestDialog({}, { request })
    }

    return { requests, showRequest }
  },
})
</script>

<style scoped></style>

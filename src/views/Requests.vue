<template>
  <div class="requests">
    <h3>Requests</h3>
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
      <div
        v-for="item in requests"
        :key="item.responsePacketData.requestId.toString()"
        class="requests__table-row app-table__row"
      >
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
    </div>
  </div>
</template>

<script lang="ts">
import { callers } from '@/api/callers'
import TitledSpan from '@/components/TitledSpan.vue'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  components: { TitledSpan },
  setup() {
    const requests = ref()
    const loadRequests = async () => {
      const response = await callers.getRequests(100)
      console.debug('Requests:', response)
      requests.value = response.requests
      // TODO: request result page?
    }
    loadRequests()

    return { requests }
  },
})
</script>

<style scoped></style>

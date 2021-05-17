<template>
  <div class="requests">
    <h3>Requests</h3>
    <div class="app-table">
      <div class="requests__table-head app-table__head">
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Name </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Description </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Owner </span>
        </div>
      </div>
      <div
        v-for="item in requests"
        :key="item.id"
        class="requests__table-row app-table__row"
      >
        <div class="app-table__cell">
          <span class="app-table__cell-txt" :title="item.name">
            {{ item.name }}
          </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt" :title="item.description">
            {{ item.description }}
          </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt" :title="item.owner">
            {{ $cropAddress(item.owner) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { callers } from '@/api/callers'
import Long from 'long'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const requests = ref()
    const loadRequests = async () => {
      const response = await callers.getRequests(Long.fromNumber(100))
      console.log(response, response.requests)
      requests.value = response.requests
      console.log(
        new TextDecoder().decode(
          response.requests[0].responsePacketData?.result
        )
      )
    }
    loadRequests()

    return { requests }
  },
})
</script>

<style scoped>
.requests__table-head,
.requests__table-row {
  grid: auto / minmax(8rem, 14rem) minmax(0, 1fr) minmax(8rem, 14rem);
}
</style>

<template>
  <div class="requests">
    <h3>Requests</h3>
    <div class="app-table">
      <div class="requests__table-head app-table__head">
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> ID </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Result </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Count </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Status </span>
        </div>
      </div>
      <div
        v-for="item in requests"
        :key="item.id"
        class="requests__table-row app-table__row"
      >
        <div class="app-table__cell">
          <TitledSpan
            class="app-table__cell-txt"
            :text="item.requestId.toString()"
          />
        </div>
        <div class="app-table__cell">
          <TitledSpan class="app-table__cell-txt" :text="item.result" />
        </div>
        <div class="app-table__cell">
          <TitledSpan
            class="app-table__cell-txt"
            :text="item.ansCount.toString()"
          />
        </div>
        <div class="app-table__cell">
          <TitledSpan
            class="app-table__cell-txt"
            :text="$tRequestStatus(item.resolveStatus)"
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
      requests.value = response.requests.map((el) => el.responsePacketData)
      // TODO: request result page?
    }
    loadRequests()

    return { requests }
  },
})
</script>

<style scoped>
.requests__table-head,
.requests__table-row {
  grid:
    auto /
    minmax(2rem, 0.1fr) minmax(8rem, 1fr) minmax(3rem, 0.15fr) minmax(3rem, 0.15fr);
}
</style>

<template>
  <div class="request view-main">
    <div class="page-title">
      <BackButton :text="'Requests'" />
      <h2 class="view-title">Request</h2>
      <span class="view-subtitle">
        #{{ String(requestData?.responsePacketData.requestId) }}
      </span>
    </div>

    <h3 class="view-subtitle mg-b24">Request info</h3>
    <template v-if="requestData">
      <div class="info-table mg-b32">
        <div class="info-table__row">
          <span class="info-table__row-title">Oracle Script</span>
          <TitledLink
            class="info-table__row-link"
            :text="String(requestData?.requestPacketData.oracleScriptId)"
          />
        </div>
        <div class="info-table__row">
          <span class="info-table__row-title">Sender</span>
          <TitledLink
            class="info-table__row-link"
            :text="String(requestData?.requestPacketData.clientId)"
          />
          <CopyButton
            class="mg-l8"
            :text="String(requestData?.requestPacketData.clientId)"
          />
        </div>
        <div class="info-table__row">
          <span class="info-table__row-title">Request Time</span>
          <span>{{ requestTime }} ({{ requestTimeRange }})</span>
        </div>
        <div class="info-table__row">
          <span class="info-table__row-title">Resolve Time</span>
          <span>{{ resolveTime }} ({{ resolveTimeRange }})</span>
        </div>
        <div class="info-table__row">
          <span class="info-table__row-title">Report Status</span>
          <Progressbar
            :min="Number(requestData?.requestPacketData.minCount)"
            :max="Number(requestData?.requestPacketData.askCount)"
            :current="Number(requestData?.responsePacketData.ansCount)"
          />
        </div>
        <div class="info-table__row">
          <span class="info-table__row-title">Resolve Status</span>
          <StatusBlock
            :status="String(requestStatusType[requestStatus]?.status)"
            :text="String(requestStatusType[requestStatus]?.name)"
          />
        </div>
      </div>

      <h3 class="view-subtitle mg-b24">Calldata</h3>
      <div class="info-table mg-b32">
        <div class="info-table__row">
          <span class="info-table__row-title">Symbols</span>
          <span class="info-table__row-txt">
            {{ requestCalldata.symbol }}
          </span>
        </div>
        <div class="info-table__row">
          <span class="info-table__row-title">Multiplier</span>
          <span class="info-table__row-txt">
            {{ requestCalldata.multiplier }}
          </span>
        </div>
      </div>

      <template v-if="requestRates">
        <h3 class="view-subtitle mg-b24">Result</h3>
        <div class="info-table">
          <div class="info-table__row">
            <span class="info-table__row-title">Rates</span>
            <span class="info-table__row-txt">
              {{ requestRates }}
            </span>
          </div>
        </div>
      </template>
    </template>
    <template v-else>
      <p class="empty-msg">There is no information about request</p>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { callers } from '@/api/callers'
import { requestStatusType } from '@/helpers/statusTypes'
import { formatDate, formatDateDifference } from '@/helpers/formatters'
import { obiCoin, obiRates } from '@/helpers/obi-structures'
import TitledLink from '@/components/TitledLink.vue'
import CopyButton from '@/components/CopyButton.vue'
import BackButton from '@/components/BackButton.vue'
import Progressbar from '@/components/Progressbar.vue'
import StatusBlock from '@/components/StatusBlock.vue'

export default defineComponent({
  components: { TitledLink, CopyButton, BackButton, Progressbar, StatusBlock },
  setup: function () {
    const route: RouteLocationNormalizedLoaded = useRoute()

    const requestData = ref()
    const requestStatus = ref()
    const requestTime = ref()
    const resolveTime = ref()
    const requestTimeRange = ref()
    const resolveTimeRange = ref()
    const requestCalldata = ref()
    const requestRates = ref()

    const getRequest = async () => {
      const { request } = await callers.getRequest(String(route.params.id))
      const reqPacketData = request?.requestPacketData
      const resPacketData = request?.responsePacketData

      if (request && reqPacketData && resPacketData) {
        requestData.value = { ...request }
        requestStatus.value = resPacketData.resolveStatus
        requestTime.value = formatDate(resPacketData.requestTime)
        resolveTime.value = formatDate(resPacketData.resolveTime)
        requestTimeRange.value = formatDateDifference(resPacketData.requestTime)
        resolveTimeRange.value = formatDateDifference(resPacketData.resolveTime)
        requestCalldata.value = obiCoin.decode(reqPacketData.calldata)

        if (requestStatus.value == 1) {
          requestRates.value = obiRates.decode(resPacketData.result)
        }
      }
    }

    onMounted(async () => {
      await getRequest()
    })

    return {
      requestStatusType,
      requestData,
      requestStatus,
      requestTime,
      resolveTime,
      requestTimeRange,
      resolveTimeRange,
      requestCalldata,
      requestRates,
    }
  },
})
</script>

<style lang="scss" scoped>
.view-title {
  margin: 0 1.6rem 0 2rem;
}

.empty-msg {
  text-align: center;
}

@media screen and (max-width: 768px) {
  .view-title {
    margin: 0.8rem 0 0.4rem 0;
  }
}
</style>

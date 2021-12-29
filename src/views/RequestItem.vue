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
            :to="`/oracle-scripts/${requestData?.requestPacketData.oracleScriptId}`"
          />
        </div>
        <div class="info-table__row">
          <span class="info-table__row-title">Sender</span>
          <a
            class="app-table__cell-txt app-table__link"
            :href="`
              ${API_CONFIG.odinScan}/account/${requestData?.requestPacketData.clientId}
            `"
          >
            {{ requestData?.requestPacketData.clientId }}
          </a>
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
        <template
          v-if="
            typeof requestCalldata === 'object' &&
            requestCalldata !== null &&
            !Array.isArray(requestCalldata)
          "
        >
          <div
            class="info-table__row"
            v-for="(val, key) in requestCalldata"
            :key="key"
          >
            <span class="info-table__row-title">{{ key }}</span>
            <span class="info-table__row-txt">{{ val }}</span>
          </div>
        </template>
        <template v-else>
          <div class="info-table__row">
            <span class="info-table__row-title">data</span>
            <span class="info-table__row-txt">
              {{ requestCalldata }}
            </span>
          </div>
        </template>
      </div>

      <template v-if="requestStatus === ResolveStatus.RESOLVE_STATUS_SUCCESS">
        <h3 class="view-subtitle mg-b24">Result</h3>
        <div class="info-table">
          <div class="info-table__row">
            <span class="info-table__row-title">Data</span>
            <span class="info-table__row-txt">
              {{ requestResult }}
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
import { API_CONFIG } from '@/api/api-config'
import { requestStatusType } from '@/helpers/statusTypes'
import { ResolveStatus } from '@provider/codec/oracle/v1/oracle'
import { formatDate, formatDateDifference } from '@/helpers/formatters'
import TitledLink from '@/components/TitledLink.vue'
import CopyButton from '@/components/CopyButton.vue'
import BackButton from '@/components/BackButton.vue'
import Progressbar from '@/components/Progressbar.vue'
import StatusBlock from '@/components/StatusBlock.vue'
import { Obi } from '@bandprotocol/bandchain.js'
import { handleError } from '@/helpers/errors'
import { uint8ArrayToStr } from '@/helpers/casts'

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
    const requestResult = ref()

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
        requestCalldata.value = await _decodeCallData(reqPacketData.calldata)

        if (requestStatus.value === ResolveStatus.RESOLVE_STATUS_SUCCESS) {
          requestResult.value = uint8ArrayToStr(resPacketData.result)
        }
      }
    }

    const _decodeCallData = async (calldata: Uint8Array) => {
      try {
        const { oracleScript } = await callers.getOracleScript(
          requestData.value.requestPacketData?.oracleScriptId
        )
        if (oracleScript) {
          const obi = new Obi(oracleScript.schema)
          return obi.decodeInput(Buffer.from(calldata))
        }
      } catch (error) {
        handleError(error as Error)
      }
    }

    onMounted(async () => {
      try {
        await getRequest()
      } catch (error) {
        handleError(error as Error)
      }
    })

    return {
      API_CONFIG,
      ResolveStatus,
      requestStatusType,
      requestData,
      requestStatus,
      requestTime,
      resolveTime,
      requestTimeRange,
      resolveTimeRange,
      requestCalldata,
      requestResult,
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

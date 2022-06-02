<template>
  <div
    class="view-main request-item load-fog"
    :class="{
      'load-fog_show': isLoading,
    }"
  >
    <div class="view-main__title-wrapper">
      <BackButton :text="'Requests'" />
      <h2 class="view-main__title request-item__title">Request</h2>
      <span class="view-main__subtitle">
        #{{ responsePacketData?.request_id }}
      </span>
    </div>

    <h3 class="view-main__subtitle mg-b24">Request info</h3>
    <template v-if="requestPacketData && responsePacketData">
      <div class="info-table mg-b32">
        <div class="info-table__row">
          <span class="info-table__row-title">Oracle Script</span>
          <TitledLink
            class="info-table__row-link"
            :text="String(requestPacketData.oracle_script_id)"
            :to="`/oracle-scripts/${requestPacketData.oracle_script_id}`"
          />
        </div>
        <div class="info-table__row">
          <span class="info-table__row-title">Sender</span>
          <a class="app-table__cell-txt app-table__link" :href="senderLink">
            {{ requestPacketData.client_id }}
          </a>
          <CopyButton
            class="mg-l8"
            :text="String(requestPacketData.client_id)"
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
            :min="Number(requestPacketData.min_count)"
            :max="Number(requestPacketData.ask_count)"
            :current="Number(responsePacketData.ans_count)"
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

      <h3 class="view-main__subtitle mg-b24">Calldata</h3>
      <div class="info-table mg-b32">
        <template v-if="isObject">
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

      <template v-if="isRequestSuccess">
        <h3 class="view-main__subtitle mg-b24">Result</h3>
        <div class="info-table">
          <div class="info-table__row">
            <span class="info-table__row-title">KEY</span>
            <span class="info-table__row-txt">
              {{ requestResultName }}
            </span>
          </div>
          <div class="info-table__row">
            <span class="info-table__row-title">Rates</span>
            <span
              class="info-table__row-txt"
              v-if="requestResultType === 'object'"
            >
              <div v-for="(item, i) in requestResult" :key="item">
                {{ i }}: {{ item }}
              </div>
            </span>
            <span
              class="info-table__row-txt"
              v-if="requestResultType === 'string'"
            >
              {{ requestResult }}
            </span>
          </div>
        </div>
      </template>
    </template>
    <template v-else>
      <div class="app-table__empty-stub">
        <p v-if="isLoading" class="empty mg-t32">Loading…</p>
        <p v-else class="empty mg-t32">There is no information about request</p>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
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
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import isObjectLodash from 'lodash/isObject'
import { fromBase64 } from '@cosmjs/encoding'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'

export default defineComponent({
  components: { TitledLink, CopyButton, BackButton, Progressbar, StatusBlock },
  setup: function () {
    const route: RouteLocationNormalizedLoaded = useRoute()
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    // const requestData = ref()
    const resultData = ref()
    const requestStatus = ref()
    const requestTime = ref()
    const resolveTime = ref()
    const requestTimeRange = ref()
    const resolveTimeRange = ref()
    const requestCalldata = ref()
    const requestResult = ref()
    const requestResultName = ref()
    const requestResultType = ref()
    const responsePacketData = ref()
    const requestPacketData = ref()
    const senderLink = computed(() => {
      return `${API_CONFIG.odinScan}/account/${requestPacketData.value.client_id}`
    })
    const isObject = computed(() => {
      return isObjectLodash(requestCalldata.value)
    })
    const isRequestSuccess = computed(
      () => requestStatus.value === ResolveStatus.RESOLVE_STATUS_SUCCESS
    )

    const getRequest = async () => {
      lockLoading()
      try {
        const request = await callers.getRequest(Number(route.params.id))
        requestPacketData.value =
          request.data.result.result.request?.request_packet_data
        responsePacketData.value =
          request.data.result.result.request?.response_packet_data
        if (requestPacketData.value && responsePacketData.value) {
          requestStatus.value = responsePacketData.value.resolve_status
          requestTime.value = formatDate(
            new Date(responsePacketData.value.request_time * 1000)
          )
          resolveTime.value = formatDate(
            new Date(responsePacketData.value.resolve_time * 1000)
          )
          requestTimeRange.value = formatDateDifference(
            new Date(responsePacketData.value.request_time * 1000)
          )
          resolveTimeRange.value = formatDateDifference(
            new Date(responsePacketData.value.resolve_time * 1000)
          )
          requestCalldata.value = await _decodeCallData(
            fromBase64(requestPacketData.value.calldata)
          )
          if (isRequestSuccess.value) {
            const res = await _decodeResult(
              fromBase64(responsePacketData.value.result)
            )
            requestResultName.value = Object.keys(res).toString() || 'Data'
            requestResult.value =
              typeof res[Object.keys(res)[0]] !== 'string'
                ? res[Object.keys(res)[0]].reduce(
                    (accumulator: unknown, currentValue: unknown) =>
                      accumulator + ' ' + currentValue
                  )
                : res[Object.keys(res)[0]]
            requestResultType.value = typeof requestResult.value
          }
        }
      } catch (error) {
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
      }
      releaseLoading()
    }

    const _decodeCallData = async (calldata: Uint8Array) => {
      try {
        const { oracleScript } = await callers.getOracleScript(
          Number(requestPacketData.value?.oracle_script_id)
        )
        if (oracleScript) {
          const obi = new Obi(oracleScript.schema)
          return obi.decodeInput(Buffer.from(calldata))
        }
      } catch (error) {
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
      }
    }
    const _decodeResult = async (result: Uint8Array) => {
      try {
        const { oracleScript } = await callers.getOracleScript(
          Number(requestPacketData.value?.oracle_script_id)
        )
        if (oracleScript) {
          const obi = new Obi(oracleScript.schema)
          return obi.decodeOutput(Buffer.from(result))
        }
      } catch (error) {
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
      }
    }
    onMounted(async () => {
      await getRequest()
    })

    return {
      API_CONFIG,
      ResolveStatus,
      requestStatusType,
      requestStatus,
      requestTime,
      resolveTime,
      requestTimeRange,
      resolveTimeRange,
      requestCalldata,
      requestResult,
      senderLink,
      isObject,
      isRequestSuccess,
      requestResultName,
      requestResultType,
      resultData,
      isLoading,
      responsePacketData,
      requestPacketData,
    }
  },
})
</script>

<style lang="scss" scoped>
.request-item__title {
  margin: 0 1.6rem 0 2rem;
}
.request-item__empty-msg {
  text-align: center;
}

@include respond-to(tablet) {
  .request-item__title {
    margin: 0.8rem 0 0.4rem 0;
  }
}
</style>

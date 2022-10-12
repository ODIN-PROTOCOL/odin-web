<template>
  <div class="app__main-view request-details">
    <div class="app__main-view-detail-container">
      <div class="app__main-view-detail-back-icon">
        <BackButton />
      </div>
      <div class="app__main-view-detail-title-container">
        <h2 class="app__main-view-detail-title">Request Detail</h2>
        <div
          v-if="!isLoadingError && !isLoading && requestData"
          class="app__main-view-detail-subtitle-container"
        >
          <span class="app__main-view-detail-subtitle">
            {{ '#' + requestData.id }}
          </span>
          <CopyButton class="mg-l8" :text="requestData.id" />
        </div>
      </div>
    </div>
    <template v-if="!isLoading">
      <template v-if="isLoadingError">
        <div class="app-table__empty-stub">
          <ui-loading-error-message message="Not Found" title="404" />
        </div>
      </template>
      <template v-else>
        <template v-if="requestData && resultData">
          <div class="app-table request-details__table">
            <div class="app-table__row request-details__line">
              <div class="app-table__cell app-table__cell--label">
                <span>Oracle Script</span>
              </div>
              <div class="app-table__cell">
                <TitledLink
                  class="app-table__link"
                  :text="`#${requestData.oracle_script_id}`"
                  :name="{
                    name: $routes.oracleScriptDetails,
                    params: { id: requestData.oracle_script_id },
                  }"
                />
              </div>
            </div>
            <div class="app-table__row request-details__line">
              <div class="app-table__cell app-table__cell--label">
                <span>Sender</span>
              </div>
              <div class="app-table__cell">
                <a class="app-table__link" :href="senderLink">
                  {{ requestData.client_id }}
                </a>
                <CopyButton class="mg-l8" :text="requestData.client_id" />
              </div>
            </div>
            <div class="app-table__row request-details__line">
              <div class="app-table__cell app-table__cell--label">
                <span>Request Time</span>
              </div>
              <div class="app-table__cell">
                <span>{{ requestTime }} ({{ requestTimeRange }})</span>
              </div>
            </div>
            <div class="app-table__row request-details__line">
              <div class="app-table__cell app-table__cell--label">
                <span>Resolve Time</span>
              </div>
              <div class="app-table__cell">
                <span>{{ resolveTime }} ({{ resolveTimeRange }})</span>
              </div>
            </div>
            <div class="app-table__row request-details__line">
              <div class="app-table__cell app-table__cell--label">
                <span>Report Status</span>
              </div>
              <div class="app-table__cell">
                <Progressbar
                  :min="Number(resultData.min_count)"
                  :max="Number(resultData.ask_count)"
                  :current="Number(resultData.ans_count)"
                />
              </div>
            </div>
            <div class="app-table__row request-details__line">
              <div class="app-table__cell app-table__cell--label">
                <span>Resolve Status</span>
              </div>
              <div class="app-table__cell">
                <Tag
                  :text="String(requestStatusType[requestStatus]?.name)"
                  :type="String(requestStatusType[requestStatus]?.status)"
                />
              </div>
            </div>
          </div>

          <h3 class="request-details__subtitle mg-b24">Calldata</h3>
          <div class="app-table">
            <template v-if="isObject">
              <div
                v-for="(val, key) in requestCalldata"
                class="app-table__row calldata-table__line"
                :key="key"
              >
                <div class="app-table__cell app-table__cell--label">
                  <span>{{ key }}</span>
                </div>
                <div class="app-table__cell">
                  <span>{{ val }}</span>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="app-table__row calldata-table__line">
                <div class="app-table__cell app-table__cell--label">
                  <span>data</span>
                </div>
                <div class="app-table__cell">
                  <span>{{ requestCalldata }}</span>
                </div>
              </div>
            </template>
          </div>

          <template v-if="isRequestSuccess">
            <h3 class="request-details__subtitle mg-b24">Result</h3>
            <div class="app-table">
              <div class="app-table__row result-table__line">
                <div class="app-table__cell app-table__cell--label">
                  <span>KEY</span>
                </div>
                <div class="app-table__cell">
                  <span>{{ requestResultName }}</span>
                </div>
              </div>
              <div class="app-table__row result-table__line">
                <div class="app-table__cell app-table__cell--label">
                  <span>Rates</span>
                </div>
                <div class="app-table__cell">
                  <span
                    class="app-table__cell-txt"
                    v-if="requestResultType === 'object'"
                  >
                    <div v-for="(item, i) in requestResult" :key="item">
                      {{ i }}: {{ item }}
                    </div>
                  </span>
                  <span
                    class="app-table__cell-txt"
                    v-if="requestResultType === 'string'"
                  >
                    {{ requestResult }}
                  </span>
                </div>
              </div>
            </div>
          </template>
        </template>
        <template v-else>
          <div class="app-table__empty-stub">
            <ui-no-data-message />
          </div>
        </template>
      </template>
    </template>
    <template v-else>
      <div class="app-table__empty-stub">
        <ui-loader positionCenter message="Loading" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import isObjectLodash from 'lodash.isobject'
import { fromBase64 } from '@cosmjs/encoding'
import { Obi } from '@bandprotocol/bandchain.js'
import { ResolveStatus } from '@provider/codec/oracle/v1/oracle'
import { API_CONFIG } from '@/api/api-config'
import { callers } from '@/api/callers'
import { requestStatusType } from '@/helpers/statusTypes'
import { formatDate, formatDateDifference } from '@/helpers/formatters'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import {
  UiLoader,
  UiLoadingErrorMessage,
  UiNoDataMessage,
} from '@/components/ui'
import BackButton from '@/components/BackButton.vue'
import CopyButton from '@/components/CopyButton.vue'
import Progressbar from '@/components/ProgressbarTool.vue'
import Tag from '@/components/Tag.vue'
import TitledLink from '@/components/TitledLink.vue'

const route: RouteLocationNormalizedLoaded = useRoute()

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()

const isLoadingError = ref(false)
const requestData = ref()
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

const isObject = computed(() => {
  return isObjectLodash(requestCalldata.value)
})

const isRequestSuccess = computed(
  () => requestStatus.value === ResolveStatus.RESOLVE_STATUS_SUCCESS,
)

const senderLink = computed(() => {
  return `${API_CONFIG.odinScan}/account/${requestData.value?.client_id}`
})

const getRequest = async () => {
  lockLoading()

  try {
    const request = await callers.getRequest(Number(route.params.id))
    requestData.value = request?.data.result.result.request
    resultData.value = request?.data.result.result.result
    requestStatus.value = resultData.value.resolve_status
    requestTime.value = formatDate(
      new Date(requestData.value.request_time * 1000),
    )
    resolveTime.value = formatDate(
      new Date(resultData.value.resolve_time * 1000),
    )
    requestTimeRange.value = formatDateDifference(
      new Date(requestData.value.request_time * 1000),
    )
    resolveTimeRange.value = formatDateDifference(
      new Date(resultData.value.resolve_time * 1000),
    )
    requestCalldata.value = await _decodeCallData(
      fromBase64(requestData.value.calldata),
    )

    if (isRequestSuccess.value) {
      const res = await _decodeResult(fromBase64(resultData.value.result))
      requestResultName.value = Object.keys(res).toString() || 'Data'
      requestResult.value =
        typeof res[Object.keys(res)[0]] !== 'string'
          ? res[Object.keys(res)[0]].reduce(
              (accumulator: unknown, currentValue: unknown) =>
                accumulator + ' ' + currentValue,
            )
          : res[Object.keys(res)[0]]
      requestResultType.value = typeof requestResult.value
    }
  } catch (error) {
    isLoadingError.value = true
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }

  releaseLoading()
}

const _decodeCallData = async (calldata: Uint8Array) => {
  try {
    const { oracleScript } = await callers.getOracleScript(
      Number(requestData.value.oracle_script_id),
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
      Number(resultData.value.oracle_script_id),
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
</script>

<style lang="scss" scoped>
.request-details__subtitle {
  margin: 4rem 0;
}

.request-details__line,
.calldata-table__line,
.result-table__line {
  grid: auto/minmax(3rem, 1fr) minmax(9rem, 3fr);
}

.app-table__link {
  @include ellipsis;
}
</style>

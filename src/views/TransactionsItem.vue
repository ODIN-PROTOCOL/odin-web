<template>
  <div class="app__main-view">
    <div class="app__main-view-detail-container">
      <div class="app__main-view-detail-back-icon">
        <BackButton text="Transactions" />
      </div>
      <div class="app__main-view-detail-title-container">
        <h2 class="app__main-view-detail-title">Transaction Detail</h2>
        <div v-if="tx" class="app__main-view-detail-subtitle-container">
          <span class="app__main-view-detail-subtitle">
            {{ tx.hash }}
          </span>
          <CopyButton class="mg-l8" :text="tx.hash" />
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
        <template v-if="tx">
          <div class="app-table">
            <div class="app-table__row transactions-item__line">
              <div class="app-table__cell app-table__cell--label">
                <InfoIcon :message="TOOLTIP_INFO.time" />
                <span>Time</span>
              </div>
              <div class="app-table__cell">
                <span class="app-table__cell-date">
                  {{ $fDate(tx.time, 'dd/MM/yy') }}
                </span>
                <span class="app-table__cell-time">
                  {{ $fDate(tx.time, 'HH:mm') }}
                </span>
              </div>
            </div>
            <div class="app-table__row transactions-item__line">
              <div class="app-table__cell app-table__cell--label">
                <InfoIcon :message="TOOLTIP_INFO.status" />
                <span>Status</span>
              </div>
              <div class="app-table__cell">
                <tag :type="tx.status" :text="tx.status" />
              </div>
            </div>
            <div class="app-table__row transactions-item__line">
              <div class="app-table__cell app-table__cell--label">
                <InfoIcon :message="TOOLTIP_INFO.block" />
                <span>Block</span>
              </div>
              <div class="app-table__cell">
                <TitledLink
                  v-if="tx?.block"
                  class="app-table__link"
                  :name="{
                    name: $routes.blockDetails,
                    params: { id: tx.block },
                  }"
                  :text="tx?.block"
                />
                <span v-else>-</span>
              </div>
            </div>
            <div class="app-table__row transactions-item__line">
              <div class="app-table__cell app-table__cell--label">
                <InfoIcon :message="TOOLTIP_INFO.gas" />
                <span>Gas (used/wanted)</span>
              </div>
              <div class="app-table__cell">
                <span>{{ tx.gasUsed }} / {{ tx.gasWanted }}</span>
              </div>
            </div>
            <div class="app-table__row transactions-item__line">
              <div class="app-table__cell app-table__cell--label">
                <InfoIcon :message="TOOLTIP_INFO.fee" />
                <span>Fee</span>
              </div>
              <div class="app-table__cell">{{ tx.fee }}</div>
            </div>
            <div class="app-table__row transactions-item__line">
              <div class="app-table__cell app-table__cell--label">
                <InfoIcon :message="TOOLTIP_INFO.memo" />
                <span>Memo</span>
              </div>
              <div class="app-table__cell">{{ tx.memo }}</div>
            </div>
            <div class="app-table__row transactions-item__line">
              <div class="app-table__cell app-table__cell--label">
                <InfoIcon :message="TOOLTIP_INFO.total" />
                <span>Total</span>
              </div>
              <div class="app-table__cell">{{ tx.amount }}</div>
            </div>
          </div>
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
import { onMounted, ref } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { callers } from '@/api/callers'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { DecodedTxData } from '@/helpers/Types'
import { prepareTransaction } from '@/helpers/helpers'
import BackButton from '@/components/BackButton.vue'
import CopyButton from '@/components/CopyButton.vue'
import TitledLink from '@/components/TitledLink.vue'
import Tag from '@/components/Tag.vue'
import InfoIcon from '@/components/icons/InfoIcon.vue'
import { TOOLTIP_INFO } from '@/const'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import {
  UiLoadingErrorMessage,
  UiLoader,
  UiNoDataMessage,
} from '@/components/ui'

const route: RouteLocationNormalizedLoaded = useRoute()
const tx = ref<DecodedTxData>()
const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const isLoadingError = ref(false)

const getTransactions = async () => {
  lockLoading()
  try {
    const res = await callers.getTxForTxDetailsPage(String(route.params.hash))
    const preparedTx = await prepareTransaction([res.data.result])
    tx.value = preparedTx[0]
  } catch (error) {
    isLoadingError.value = true
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

onMounted(async () => {
  await getTransactions()
})
</script>

<style lang="scss" scoped>
.transactions-item__line {
  grid: auto/minmax(3rem, 1fr) minmax(9rem, 3fr);
}
</style>

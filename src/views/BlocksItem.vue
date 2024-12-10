<template>
  <div class="app__main-view">
    <div class="app__main-view-detail-container">
      <div class="app__main-view-detail-back-icon">
        <BackButton text="Blocks" />
      </div>
      <div class="app__main-view-detail-title-container">
        <h2 class="app__main-view-detail-title">Block Detail</h2>
        <div v-if="blockInfo" class="app__main-view-detail-subtitle-container">
          <span class="app__main-view-detail-subtitle">
            {{ blockHeight }}
          </span>
          <CopyButton class="mg-l8" :text="blockHeight" />
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
        <template v-if="blockInfo">
          <div class="app-table">
            <div class="app-table__row blocks-item__line">
              <div class="app-table__cell app-table__cell--label">
                <InfoIcon :message="BLOCK_TOOLTIP_INFO.blockHeight" />
                <span>Block Height</span>
              </div>
              <div class="app-table__cell">
                <span>{{ blockHeight }}</span>
                <CopyButton class="mg-l8" :text="String(blockHeight)" />
              </div>
            </div>
            <div class="app-table__row blocks-item__line">
              <div class="app-table__cell app-table__cell--label">
                <InfoIcon :message="BLOCK_TOOLTIP_INFO.blockHash" />
                <span>Block Hash</span>
              </div>
              <div class="app-table__cell">
                <span class="app-table__text">{{ blockHash }}</span>
                <CopyButton class="mg-l8" :text="String(blockHash)" />
              </div>
            </div>
            <div class="app-table__row blocks-item__line">
              <div class="app-table__cell app-table__cell--label">
                <InfoIcon :message="BLOCK_TOOLTIP_INFO.blockParentHash" />
                <span>Block Parent Hash</span>
              </div>
              <div class="app-table__cell">
                <span class="app-table__text">{{ blockParentHash }}</span>
                <CopyButton class="mg-l8" :text="String(blockParentHash)" />
              </div>
            </div>
            <div class="app-table__row blocks-item__line">
              <div class="app-table__cell app-table__cell--label">
                <InfoIcon :message="BLOCK_TOOLTIP_INFO.timestamp" />
                <span>Timestamp</span>
              </div>
              <div class="app-table__cell">
                <span class="app-table__cell-date">
                  {{ $fDate($parseISO(blockTimestamp), 'dd/MM/yy') }}
                </span>
                <span class="app-table__cell-time">
                  {{ $fDate($parseISO(blockTimestamp), 'HH:mm') }}
                </span>
              </div>
            </div>
            <div class="app-table__row blocks-item__line">
              <div class="app-table__cell app-table__cell--label">
                <InfoIcon :message="BLOCK_TOOLTIP_INFO.blocksTransactions" />
                <span>Block's Transactions</span>
              </div>
              <div class="app-table__cell">
                <template v-if="blocksTransactions?.length">
                  <TitledLink
                    v-for="item in blocksTransactions"
                    class="app-table__link"
                    :key="item.hash"
                    :name="{
                      name: $routes.transactionDetails,
                      params: { hash: item.hash },
                    }"
                    :text="'0x' + item.hash"
                  />
                </template>
                <template v-else>
                  <span>-</span>
                </template>
              </div>
            </div>
            <div class="app-table__row blocks-item__line">
              <div class="app-table__cell app-table__cell--label">
                <InfoIcon :message="BLOCK_TOOLTIP_INFO.blockCreator" />
                <span>Block Creator</span>
              </div>
              <div class="app-table__cell">
                <TitledLink
                  class="app-table__link"
                  :name="{
                    name: $routes.validatorDetails,
                    params: { address: blockCreator },
                  }"
                  :text="blockCreator"
                />
                <CopyButton class="mg-l8" :text="String(blockCreator)" />
              </div>
            </div>
            <div class="app-table__row blocks-item__line">
              <div class="app-table__cell app-table__cell--label">
                <InfoIcon :message="BLOCK_TOOLTIP_INFO.blockSize" />
                <span>Block Size</span>
              </div>
              <div class="app-table__cell">
                <span>{{ blockSize || 0 }} bytes</span>
              </div>
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
import { toHex } from '@cosmjs/encoding'
import { prepareTransaction } from '@/helpers/helpers'
import { BLOCK_TOOLTIP_INFO } from '@/const'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import {
  UiLoadingErrorMessage,
  UiLoader,
  UiNoDataMessage,
} from '@/components/ui'
import BackButton from '@/components/BackButton.vue'
import CopyButton from '@/components/CopyButton.vue'
import TitledLink from '@/components/TitledLink.vue'
import InfoIcon from '@/components/icons/InfoIcon.vue'
import { ValidatorDetailedInfo } from '@/graphql/types/responses'

const route: RouteLocationNormalizedLoaded = useRoute()
const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()

const isLoadingError = ref(false)
const blockInfo = ref()
const blockHeight = ref(route.params.id)
const blockHash = ref('-')
const blockParentHash = ref('-')
const blockTimestamp = ref()
const blocksTransactions = ref()
const blockCreator = ref('-')
const blockSize = ref()

const validators = ref<ValidatorDetailedInfo[]>([])

const getValidators = async (): Promise<void> => {
  const response = await callers.getValidators()
  validators.value = response.data.validators || []
}

const getBlock = async () => {
  lockLoading()

  try {
    const blockResponse = await callers.getBlock(
      String(route.params.id),
      Number(route.params.id),
    )
    blockInfo.value = blockResponse.data

    blockHash.value = '0x' + blockInfo.value.blockMetas[0].hash
    blockParentHash.value = '0x' + blockInfo.value.latestBlock[0].hash

    blockTimestamp.value = blockInfo.value.blockMetas[0].timestamp
    blockSize.value = blockInfo.value.blockMetas[0].size
    blockCreator.value =
      blockInfo.value.blockMetas[0].validator.validator_info.operator_address
    blockHeight.value = blockInfo.value.blockMetas[0].height

    const response = await callers.getTxByBlock(
      0,
      30,
      'desc',
      Number(blockHeight.value),
    )
    blocksTransactions.value = await prepareTransaction(
      response?.data?.transaction || [],
      validators.value,
    )
  } catch (error) {
    isLoadingError.value = true
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

onMounted(async () => {
  await getValidators()
  await getBlock()
})
</script>

<style lang="scss" scoped>
.blocks-item__line {
  grid: auto/minmax(3rem, 1fr) minmax(9rem, 3fr);
}

.app-table__cell {
  max-width: 90%;
}

.app-table__link,
.app-table__text {
  @include ellipsis;
}

.blocks-item__title {
  margin: 0 1.6rem 0 2rem;
}

.blocks-item__table-row {
  display: flex;
  align-items: flex-start;
  padding: 1.6rem 0;
  border-bottom: 0.1rem solid var(--clr__input-border);
}

.blocks-item__table-row-info {
  display: flex;
  align-items: center;
  height: 2.3rem;
  position: relative;
  cursor: pointer;
  margin-right: 0.9rem;

  &:hover {
    .blocks-item__table-row-tooltip {
      display: block;
    }
  }
}

.blocks-item__table-row-tooltip {
  display: none;
  position: absolute;
  bottom: 130%;
  left: -50%;
  min-width: 30rem;
  padding: 1.2rem 2.4rem;
  background: var(--clr__tooltip-bg);
  border-radius: 0.8rem;
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 1.6rem;
  color: var(--clr__tooltip-text);

  &:before {
    content: '';
    display: block;
    width: 0.6rem;
    height: 0.6rem;
    position: absolute;
    bottom: -0.3rem;
    left: 1.6rem;
    transform: translateX(-50%) rotate(45deg);
    background: var(--clr__tooltip-bg);
  }
}

.blocks-item__table-row-title {
  min-width: 14.5rem;
  line-height: 2.3rem;
  margin-right: 2.4rem;
}

.blocks-item__table-row-value {
  font-size: 1.4rem;
  @include ellipsis();
}

.blocks-item__table-row-values {
  display: flex;
  flex-direction: column;
  @include ellipsis();

  & > *:not(:last-child) {
    margin-bottom: 0.8rem;
  }
}

.blocks-item__table-row-link {
  text-decoration: none;
  color: var(--clr__action);
}

@include respond-to(tablet) {
  .blocks-item__title {
    margin: 0.8rem 0 0.4rem 0;
  }

  .blocks-item__table-row-info {
    display: none;
  }
}
</style>

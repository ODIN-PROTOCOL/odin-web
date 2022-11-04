<template>
  <transition name="fade" mode="out-in" appear>
    <div class="latest-stats">
      <div class="latest-stats__wrapper">
        <LatestList :header="latestBlocksHeader">
          <transition-group name="fade" mode="out-in">
            <template v-if="latestBlocks.length">
              <LatestListItemBlock
                v-for="item in latestBlocks"
                :key="item.blockId.hash"
                :block="item"
              />
            </template>
            <template v-else>
              <template v-if="isLoading">
                <SkeletonLatestListItemBlock v-for="item of 5" :key="item" />
              </template>
              <div v-else class="latest-stats__list-item">
                <span class="latest-stats__list-item--empty">No Item</span>
              </div>
            </template>
          </transition-group>
        </LatestList>
        <LatestList :header="latestTransactionsHeader">
          <transition-group name="fade" mode="out-in">
            <template v-if="latestTransactions.length">
              <LatestListItemTx
                v-for="item in latestTransactions"
                :key="item.hash"
                :tx="item"
              />
            </template>
            <template v-else>
              <template v-if="isLoading">
                <SkeletonLatestListItemTx v-for="item of 5" :key="item" />
              </template>
              <div v-else class="latest-stats__list-item">
                <span class="latest-stats__list-item--empty">No Item</span>
              </div>
            </template>
          </transition-group>
        </LatestList>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { callers } from '@/api/callers'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { latestBlocksHeader, latestTransactionsHeader } from '@/const'
import { prepareBlocks } from '@/helpers/blocksHelper'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { prepareTransaction } from '@/helpers/helpers'
import { DecodedTxData, TransformedBlocks } from '@/helpers/Types'
import LatestList from './LatestList.vue'
import LatestListItemBlock from './LatestListItemBlock.vue'
import LatestListItemTx from './LatestListItemTx.vue'
import SkeletonLatestListItemTx from './SkeletonLatestListItemTx.vue'
import SkeletonLatestListItemBlock from './SkeletonLatestListItemBlock.vue'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()

onMounted(async (): Promise<void> => {
  lockLoading()

  try {
    await getLatestBlocks()
    await getLatestTransactions()
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }

  releaseLoading()
})

const lastHeight = ref(0)
const latestBlocks = ref<TransformedBlocks[]>([])
const latestTransactions = ref<DecodedTxData[]>([])

const getLatestBlocks = async (): Promise<void> => {
  const { blockMetas, lastHeight: reqLastHeight } =
    await callers.getBlockchain()

  latestBlocks.value = await prepareBlocks(blockMetas.slice(0, 5))
  lastHeight.value = reqLastHeight
}

const getLatestTransactions = async (): Promise<void> => {
  const { data } = await callers
    .getTxSearchFromTelemetry(0, 5, 'desc')
    .then(resp => resp.json())

  latestTransactions.value = await prepareTransaction(data)
}
</script>

<style lang="scss" scoped>
.latest-stats__list-item--empty {
  display: flex;
  justify-content: center;
  align-items: center;
  grid-column-start: 1;
  grid-column-end: -1;
  color: var(--clr__input-border);
  font-size: 3.2rem;
  font-weight: 600;
  text-transform: uppercase;
}

.latest-stats__wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: flex-start;
  gap: 2.4rem;
}

@include respond-to(tablet) {
  .latest-stats__wrapper {
    grid-template-columns: 1fr;
  }
}
</style>

<template>
  <transition name="fade" mode="out-in" appear>
    <div class="latest-stats">
      <div class="latest-stats__wrapper">
        <LatestList :header="latestTransactionsHeader">
          <transition-group name="fade" mode="out-in">
            <template v-if="latestTransactions !== undefined">
              <LatestListItemTx
                v-for="item in prepareTransaction(
                  latestTransactions.transaction || [],
                  validators?.validators || [],
                )"
                :key="item.hash"
                :tx="item"
              />
            </template>
            <template v-else>
              <template v-if="transactionsLoading && validatorsLoadling">
                <SkeletonLatestListItemTx v-for="item of 5" :key="item" />
              </template>
              <div v-else class="latest-stats__list-item">
                <span class="latest-stats__list-item--empty">No Item</span>
              </div>
            </template>
          </transition-group>
        </LatestList>

        <LatestList :header="latestBlocksHeader">
          <transition-group name="fade" mode="out-in">
            <template v-if="latestBlocks !== undefined">
              <LatestListItemBlock
                v-for="item in prepareBlockMetas(
                  latestBlocks.blockMetas || [],
                  validators?.validators || [],
                )"
                :key="item.hash"
                :block="item"
              />
            </template>
            <template v-else>
              <template v-if="latestBlocksLoading && validatorsLoadling">
                <SkeletonLatestListItemBlock v-for="item of 5" :key="item" />
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
import { latestBlocksHeader, latestTransactionsHeader } from '@/const'
import { prepareBlockMetas } from '@/helpers/blocksHelper'
import { prepareTransaction } from '@/helpers/helpers'
import LatestList from './LatestList.vue'
import LatestListItemBlock from './LatestListItemBlock.vue'
import LatestListItemTx from './LatestListItemTx.vue'
import SkeletonLatestListItemTx from './SkeletonLatestListItemTx.vue'
import SkeletonLatestListItemBlock from './SkeletonLatestListItemBlock.vue'
import {
  BlockMetaResponse,
  TxResponseData,
  ValidatorsResponse,
} from '@/graphql/types/responses'
import { useQuery } from '@vue/apollo-composable'
import { ValidatorsQuery } from '@/graphql/queries/ValidatorQuery'

import { BlocksQuery, TxQuery } from '@/graphql/queries/Tx'
import { BlocksQueryVariables } from '@/graphql/types'

const {
  result: validators,
  error: valError,
  loading: validatorsLoadling,
} = useQuery<ValidatorsResponse>(ValidatorsQuery)
const {
  result: latestTransactions,
  error: transactionError,
  loading: transactionsLoading,
} = useQuery<TxResponseData>(TxQuery, {
  block: null,
  limit: 5,
  offset: 0,
})
const {
  result: latestBlocks,
  error: latestBlocksError,
  loading: latestBlocksLoading,
} = useQuery<BlockMetaResponse, BlocksQueryVariables>(BlocksQuery, {
  limit: 5,
  order: 'desc',
  offset: 0,
})
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

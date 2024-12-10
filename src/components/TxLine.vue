<template>
  <div class="app-table__row">
    <div class="app-table__cell">
      <span class="app-table__title">Transaction Hash</span>
      <TitledLink
        :name="{
          name: $routes.transactionDetails,
          params: { hash: tx.hash },
        }"
        :title="tx.hash"
        :text="formatTxString(tx.hash ? tx.hash?.toString() : '')"
        class="app-table__cell-txt app-table__link"
      />
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Type</span>
      <span class="app-table__cell-txt" :title="tx.type">
        {{ tx.type }}
      </span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Block</span>
      <TitledLink
        :name="{
          name: $routes.blockDetails,
          params: { id: tx.block },
        }"
        :text="tx.block"
        class="app-table__cell-txt app-table__link"
      />
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Date</span>
      <span class="app-table__cell-date">
        {{ $fDate(tx.time, 'dd/MM/yy') }}
      </span>
      <span class="app-table__cell-time">
        {{ $fDate(tx.time, 'HH:mm') }}
      </span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Sender</span>
      <TitledLink
        v-if="tx.sender"
        v-bind="getODINRedirectLink(tx.sender)"
        class="app-table__cell-txt app-table__link"
        :title="tx.sender"
        :text="formatTxString(tx.sender)"
      />
      <span class="app-table__cell-txt" v-else> - </span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Receiver</span>
      <TitledLink
        v-if="tx.receiver"
        v-bind="getODINRedirectLink(tx.receiver)"
        :title="tx.receiver_name ? tx.receiver_name : tx.receiver"
        :text="
          tx.receiver_name ? tx.receiver_name : formatTxString(tx.receiver)
        "
        class="app-table__cell-txt app-table__link"
      />
      <span class="app-table__cell-txt" v-else> - </span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">GAS (ODIN)</span>
      <span class="app-table__cell-txt" :title="tx.fee">
        {{ tx.fee }}
      </span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Amount</span>
      <span :class="amountCellClass" :title="tx.amount">
        {{ tx.amount }}
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { DecodedTxData } from '@/helpers/Types'
import TitledLink from '@/components/TitledLink.vue'
import { formatTxString } from '@/helpers/formatters'
import { ROUTE_NAMES } from '@/enums'
import { API_CONFIG } from '@/api/api-config'

const props = defineProps<{
  tx: DecodedTxData
}>()

const amountCellClass = computed(() => {
  if (props.tx.amount === '-') {
    return 'app-table__cell-txt'
  }

  return 'app-table__cell-tag'
})

const getODINRedirectLink = (hash: string) => {
  if (hash?.startsWith('osmo')) {
    return {
      href: `${API_CONFIG.mintScanUrl}${hash}`,
      target: '_blank',
    }
  }
  return {
    name: {
      name: ROUTE_NAMES.accountDetails,
      params: { hash: hash },
    },
  }
}
</script>

<style lang="scss" scoped>
@include respond-to(medium) {
  .app-table__title {
    display: inline-block;
    min-width: 15rem;
    margin-right: 2.4rem;
    font-weight: 300;
  }

  .app-table__row {
    grid: none;
    padding: 3.4rem 0 1.6rem;
  }
}
</style>

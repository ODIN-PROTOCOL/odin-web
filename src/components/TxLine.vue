<template>
  <div class="app-table__row">
    <div class="app-table__cell">
      <span class="app-table__title">Transaction Hash</span>
      <a
        class="app-table__cell-txt app-table__link"
        :href="`${API_CONFIG.odinScan}/transactions/${getRequestItemTxHash}`"
      >
        {{ tx.tx_hash }}
      </a>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Type</span>
      <span class="app-table__cell-txt" :title="type">
        {{ type }}
      </span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Block</span>
      <a
        class="app-table__cell-txt app-table__link"
        :href="`${API_CONFIG.odinScan}/blocks/${tx.block}`"
      >
        {{ tx.block }}
      </a>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Date and time</span>
      <span>{{ $fDate(tx.timestamp * 1000, 'HH:mm dd.MM.yy') }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Sender</span>
      <a
        v-if="tx.sender"
        class="app-table__cell-txt app-table__link"
        :href="`${API_CONFIG.odinScan}/${generateAddrLink(tx.sender)}`"
      >
        {{ tx.sender }}
      </a>
      <span class="app-table__cell-txt" v-else> - </span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Receiver</span>
      <a
        v-if="tx.receiver"
        class="app-table__cell-txt app-table__link"
        :href="`${API_CONFIG.odinScan}/${generateAddrLink(tx.receiver)}`"
      >
        {{ tx.receiver }}
      </a>
      <span class="app-table__cell-txt" v-else> - </span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Amount</span>
      <span class="app-table__cell-txt" :title="odinAmount">{{
        odinAmount
      }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title">Transaction Fee</span>
      <span class="app-table__cell-txt" :title="odinFee">
        {{ odinFee }}
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { humanizeMessageType } from '@/helpers/decodeMessage'
import { convertLokiToOdin } from '@/helpers/converters'
import { API_CONFIG } from '@/api/api-config'
import { txFromTelemetry } from '@/helpers/Types'

const props = defineProps<{
  tx: txFromTelemetry
}>()

const odinAmount = convertLokiToOdin(
  props.tx.amount[0]?.amount,
  {},
  props.tx.amount[0]?.denom,
)
const odinFee = convertLokiToOdin(
  props.tx.fee[0]?.amount,
  {},
  props.tx.fee[0]?.denom,
)
const type = humanizeMessageType('/' + props.tx.type)
const getRequestItemTxHash = props.tx?.tx_hash.split('0x')[1]
const generateAddrLink = (addr: string) => {
  if (addr.includes('odinvaloper')) {
    return `validators/${addr}`
  } else {
    return `account/${addr}`
  }
}
</script>

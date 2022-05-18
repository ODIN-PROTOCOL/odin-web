<template>
  <div class="app-table__row">
    <div class="app-table__cell">
      <span class="app-table__title">Transaction hash</span>
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
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { humanizeMessageType } from '@/helpers/decodeMessage'
import { convertLokiToOdin, getLokiFromString } from '@/helpers/converters'
import { API_CONFIG } from '@/api/api-config'
import { txFromTelemetry } from '@/helpers/Types'

export default defineComponent({
  name: 'TxLine',
  components: {},
  props: {
    tx: {
      type: Object as PropType<txFromTelemetry>,
      required: true,
    },
  },
  setup(props) {
    const fee = getLokiFromString(props.tx.fee)
    const amount = getLokiFromString(props.tx.amount)
    const odinAmount = convertLokiToOdin(amount)
    const odinFee = convertLokiToOdin(fee)
    const type = humanizeMessageType('/' + props.tx.type)
    const getRequestItemTxHash = props.tx?.tx_hash.split('0x')[1]
    const generateAddrLink = (addr: string) => {
      if (addr.includes('odinvaloper')) {
        return `validators/${addr}`
      } else {
        return `account/${addr}`
      }
    }
    return {
      generateAddrLink,
      odinFee,
      odinAmount,
      type,
      API_CONFIG,
      getRequestItemTxHash,
    }
  },
})
</script>

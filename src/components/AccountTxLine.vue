<template>
  <div class="app-table__row account-tx-line__row">
    <div class="app-table__cell">
      <span class="app-table__title account-tx-line__title">
        Transaction hash
      </span>
      <TitledLink
        :name="{
          name: $routes.transactionDetails,
          params: { hash: getRequestItemTxHash },
        }"
        :title="tx.tx_hash"
        :text="formatTxString(tx.tx_hash)"
        class="app-table__cell-txt app-table__link"
      />
    </div>
    <div class="app-table__cell">
      <span class="app-table__title account-tx-line__title">Type</span>
      <span class="app-table__cell-txt" :title="type">
        {{ type }}
      </span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title account-tx-line__title">Block</span>
      <TitledLink
        :name="{
          name: $routes.blockDetails,
          params: { id: tx.block },
        }"
        class="app-table__cell-txt app-table__link"
        :text="tx.block"
      />
    </div>
    <div class="app-table__cell">
      <span class="app-table__title account-tx-line__title">Date and time</span>
      <span>{{ $fDate(tx.timestamp * 1000, 'HH:mm dd.MM.yy') }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title account-tx-line__title">Sender</span>
      <TitledLink
        v-if="tx.sender"
        :to="tx.sender"
        class="app-table__cell-txt app-table__link"
        :title="tx.sender"
        :text="formatTxString(tx.sender)"
      />
      <span class="app-table__cell-txt" v-else>-</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title account-tx-line__title">Receiver</span>
      <TitledLink
        v-if="tx.receiver"
        :to="tx.receiver"
        class="app-table__cell-txt app-table__link"
        :title="tx.receiver"
        :text="formatTxString(tx.receiver)"
      />
      <span class="app-table__cell-txt" v-else>-</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title account-tx-line__title">
        Transaction Fee
      </span>
      <span class="app-table__cell-txt" :title="odinFee">
        {{ odinFee }}
      </span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title account-tx-line__title">Amount</span>
      <span class="app-table__cell-txt" :title="odinAmount">{{
        odinAmount
      }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { humanizeMessageType } from '@/helpers/decodeMessage'
import { convertLokiToOdin } from '@/helpers/converters'
import { AccountTx } from '@/helpers/Types'
import TitledLink from '@/components/TitledLink.vue'
import { formatTxString } from '@/helpers/formatters'

const props = defineProps<{
  tx: AccountTx
}>()

const odinAmount = convertLokiToOdin(
  props.tx.amount[0]?.amount,
  {
    withDenom: true,
  },
  props.tx.amount[0]?.denom,
)

const odinFee = convertLokiToOdin(
  props.tx.fee[0]?.amount,
  {},
  props.tx.fee[0]?.denom,
)

const type = humanizeMessageType('/' + props.tx.type)
const getRequestItemTxHash = props.tx?.tx_hash.split('0x')[1]
</script>

<style lang="scss" scoped>
@include respond-to(medium) {
  .account-tx-line__row {
    grid: none;
    padding: 3.4rem 0 1.6rem;
  }

  .account-tx-line__title {
    display: inline-block;
    min-width: 15rem;
    margin-right: 2.4rem;
    font-weight: 300;
  }
}
</style>

<template>
  <div class="accounts-line app-table__row">
    <div class="app-table__cell">
      <span class="app-table__title accounts-line__title">Rank</span>
      <span>{{ rank }}</span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title accounts-line__title">Address</span>
      <TitledLink
        :name="{
          name: $routes.accountDetails,
          params: { hash: account.address },
        }"
        :text="account.address"
        class="app-table__cell-txt app-table__link"
      />
    </div>
    <div class="app-table__cell">
      <span class="app-table__title accounts-line__title">ODIN balance</span>
      <span
        :title="getAmountForTitle(account.loki_balance)"
        class="app-table__cell-txt"
      >
        {{ getAmountForValue(account.loki_balance) }}
      </span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title accounts-line__title">
        Delegated Amount
      </span>
      <span
        :title="getAmountForTitle(account.delegated_amount)"
        class="app-table__cell-txt"
      >
        {{ getAmountForValue(account.delegated_amount) }}
      </span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title accounts-line__title">Total Amount</span>
      <span
        :title="getAmountForTitle(account.total_amount)"
        class="app-table__cell-txt"
      >
        {{ getAmountForValue(account.total_amount) }}
      </span>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title accounts-line__title">
        ODIN token percentage
      </span>
      <div>
        <span v-if="accountOdinPercentage">{{ accountOdinPercentage }}%</span>
        <span v-else>-</span>
      </div>
    </div>
    <div class="app-table__cell">
      <span class="app-table__title accounts-line__title">
        Transaction count
      </span>
      <div>
        <span v-if="account.tx_number">
          {{ account.tx_number.toLocaleString() }}
        </span>
        <span v-else>0</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { convertLokiToOdin } from '@/helpers/converters'
import { Coin, TempBalanceType } from '@/helpers/Types'
import TitledLink from '@/components/TitledLink.vue'

const props = defineProps<{
  account: TempBalanceType
  odinSupply: Coin
  rank: number
}>()

const getAmountForTitle = (value: number | string) => {
  return convertLokiToOdin(String(value))
}

const getAmountForValue = (value: number | string) => {
  return convertLokiToOdin(String(value), {
    withDenom: true,
  })
}

const accountOdinPercentage = computed(() => {
  const accountOdinValue =
    (props.account.total_amount / Number(props.odinSupply.amount)) * 100
  return accountOdinValue.toFixed(2)
})
</script>

<style lang="scss" scoped>
@include respond-to(medium) {
  .accounts-line {
    grid: none;
    padding: 3.4rem 0 1.6rem;
  }

  .accounts-line__title {
    display: inline-block;
    min-width: 15rem;
    margin-right: 2.4rem;
    font-weight: 300;
  }
}
</style>

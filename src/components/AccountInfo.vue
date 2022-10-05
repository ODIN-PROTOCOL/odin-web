<template>
  <div class="account-info">
    <div class="account-info__card card-frame">
      <h3 class="account-info__card-title">Balance</h3>
      <div class="account-info__card-balance">
        <div class="account-info__card-balance-row">
          <span class="account-info__card-balance-row-title">ODIN</span>
          <div class="account-info__card-balance-row-value-wrapper">
            <span
              class="account-info__card-balance-row-value app-table__cell-txt"
              :title="odinBalance"
            >
              {{ odinBalance }}
            </span>
          </div>
        </div>
        <div class="account-info__card-balance-row">
          <span class="account-info__card-balance-row-title">GEO</span>
          <div class="account-info__card-balance-row-value-wrapper">
            <span
              class="account-info__card-balance-row-value app-table__cell-txt app-table__link"
              :title="geoBalance"
            >
              {{ geoBalance }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="account-info__card card-frame">
      <h3 class="account-info__card-title">Stake</h3>
      <div class="account-info__card-balance">
        <div class="account-info__card-balance-row">
          <span class="account-info__card-balance-row-title"
            >Total ODIN stake</span
          >
          <div class="account-info__card-balance-row-value-wrapper">
            <span
              class="account-info__card-balance-row-value app-table__cell-txt"
              :title="$convertLokiToOdin(stakedLokiAmount)"
            >
              {{ $convertLokiToOdin(stakedLokiAmount, { withDenom: true }) }}
            </span>
          </div>
        </div>
        <div class="account-info__card-balance-row">
          <span class="account-info__card-balance-row-title"
            >ODIN token percentage</span
          >
          <div class="account-info__card-balance-row-value-wrapper">
            <span
              class="account-info__card-balance-row-value app-table__cell-txt app-table__link"
              :title="stakedPercentage"
            >
              {{ stakedPercentage }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef } from 'vue'
import { useQuery, UseQueryReturn } from '@vue/apollo-composable'
import { AccountStakingInfoQuery } from '@/graphql/queries'
import {
  AccountStakingInfoResponse,
  AccountStakingInfoVariables,
} from '@/graphql/types'

const props = defineProps<{
  odinBalance: string
  geoBalance: string
  address: string
}>()

const {
  result,
  loading,
}: UseQueryReturn<AccountStakingInfoResponse, AccountStakingInfoVariables> =
  useQuery<AccountStakingInfoResponse, AccountStakingInfoVariables>(
    AccountStakingInfoQuery,
    {
      address: props.address,
    },
  )

const stakedLokiAmount = computed(() => {
  const odinCoin = result.value?.delegationBalance?.coins?.find(
    coin => coin.denom === 'loki',
  )
  return odinCoin?.amount || '0'
})

const stakedPercentage: ComputedRef<string> = computed(() => {
  if (loading.value) {
    return '0%'
  }
  const odinStakingPool = result?.value?.stakingPool[0]
  const bondedTotal = Number(odinStakingPool?.bonded)
  const unbondedTotal = Number(odinStakingPool?.unbonded)
  const stakingTotal = bondedTotal + unbondedTotal

  if (!stakingTotal) {
    return '0%'
  }

  return `${Number(
    Number((Number(stakedLokiAmount.value) * 100) / stakingTotal).toFixed(4),
  )}%`
})
</script>

<style lang="scss" scoped>
.account-info {
  display: grid;
  grid: auto/ minmax(10rem, 0.5fr) minmax(10rem, 0.5fr);
  gap: 2.4rem;
  font-size: 2.4rem;
  font-weight: 400;
  margin-bottom: 4rem;
}

.account-info__card {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.account-info__card-title {
  display: inline-block;
  font-size: 2.4rem;
  font-weight: 400;
  padding-right: 0.8rem;
  margin-bottom: 3.2rem;
}

.account-info__card-balance {
  display: flex;
  justify-content: center;
  align-items: center;
}

.account-info__card-balance-row {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1.6rem;
  min-width: 10rem;

  &:not(:last-child) {
    border-right: 0.1rem solid var(--clr__card-separator);
    margin-right: 2rem;
  }
}

.account-info__card-balance-row-title {
  font-size: 1.6rem;
}

.account-info__card-balance-row-value-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 20rem;
  position: relative;
}

.account-info__card-balance-row-value {
  width: 100%;
  font-weight: 600;
  @include ellipsis();
}

@include respond-to(tablet) {
  .account-info {
    display: flex;
    flex-direction: column;
  }

  .account-info__card {
    width: 100%;
  }

  .account-info__card-balance-row {
    padding-left: 0.4rem;
  }
}

@include respond-to(small) {
  .account-info__card {
    padding: 2.2rem;
  }

  .account-info__card-balance-row-title {
    max-width: 10rem;
  }
}
</style>

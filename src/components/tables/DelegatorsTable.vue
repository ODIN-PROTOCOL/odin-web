<template>
  <div class="delegators-table">
    <div class="app-table">
      <div class="app-table__head delegators-table__table-head">
        <span>Delegator</span>
        <span>Stake</span>
      </div>
      <div class="app-table__body">
        <template v-if="filteredDelegators?.length">
          <div
            v-for="item in filteredDelegators"
            :key="item.delegation.delegatorAddress"
            class="app-table__row delegators-table__table-row"
          >
            <div class="app-table__cell">
              <span class="app-table__title">Delegator</span>
              <a
                :href="`${API_CONFIG.odinScan}/account/${item.delegation.delegatorAddress}`"
                class="app-table__cell-txt app-table__link"
              >
                {{ item.delegation.delegatorAddress }}
              </a>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Stake</span>
              <span class="app-table__cell-txt">
                {{
                  $convertLokiToOdin(item.balance.amount, { withDenom: true })
                }}
              </span>
            </div>
          </div>
        </template>
        <template v-else>
          <SkeletonTable
            v-if="isLoading"
            :header-titles="headerTitles"
            class-string="delegators-table__table-row"
          />
          <div v-else class="app-table__empty-stub">
            <p class="empty mg-t32">No items yet</p>
          </div>
        </template>
      </div>
    </div>

    <template v-if="delegatorsCount > ITEMS_PER_PAGE">
      <AppPagination
        class="mg-t32 mg-b32"
        v-model="currentPage"
        :pages="totalPages"
        @update:modelValue="paginationHandler"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { API_CONFIG } from '@/api/api-config'
import { DelegationResponse } from 'cosmjs-types/cosmos/staking/v1beta1/staking'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import SkeletonTable from '@/components/SkeletonTable.vue'

const props = defineProps<{
  delegators: DelegationResponse[]
  isLoading: boolean
}>()

const ITEMS_PER_PAGE = 5
const currentPage = ref(1)
const delegatorsCount = computed(() => {
  return props.delegators.length
})
const totalPages = computed(() => {
  return Math.ceil(delegatorsCount.value / ITEMS_PER_PAGE)
})
const headerTitles = [{ title: 'Delegator' }, { title: 'Stake' }]
const filteredDelegators = computed(() => {
  let tempArr = props.delegators
  if (currentPage.value === 1) {
    return tempArr.slice(0, currentPage.value * ITEMS_PER_PAGE)
  } else {
    return tempArr.slice(
      (currentPage.value - 1) * ITEMS_PER_PAGE,
      (currentPage.value - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
    )
  }
})

const paginationHandler = (num: number) => {
  currentPage.value = num
}
</script>

<style lang="scss" scoped></style>

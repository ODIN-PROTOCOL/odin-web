<template>
  <div>
    <div class="app-table">
      <div class="app-table__head">
        <span>Delegator</span>
        <span>Balance</span>
        <span>Stake</span>
      </div>
      <div class="app-table__body">
        <template v-if="delegators.length">
          <div
            v-for="item in filteredDelegators"
            :key="item.delegation.delegatorAddress"
            class="app-table__row"
          >
            <div class="app-table__cell">
              <span class="app-table__title">Delegator</span>
              <TitledLink
                class="app-table__cell-txt app-table__link"
                :text="String(item.delegation.delegatorAddress)"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Balance</span>
              <span class="app-table__cell-txt">
                {{ $fCoin(item.balance.amount, item.balance.denom) }}
              </span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Stake</span>
              <span class="app-table__cell-txt">
                {{ $fCoin(item.delegation.shares, item.balance.denom) }}
              </span>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="app-table__empty-stub">
            <p>No items yet</p>
          </div>
        </template>
      </div>
    </div>

    <template v-if="delegatorsCount > ITEMS_PER_PAGE">
      <Pagination
        @changePageNumber="paginationHandler($event)"
        :blocksPerPage="ITEMS_PER_PAGE"
        :total-length="delegatorsCount"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, toRef } from 'vue'
import TitledLink from '@/components/TitledLink.vue'
import Pagination from '@/components/pagination/pagination.vue'

export default defineComponent({
  components: { TitledLink, Pagination },
  props: {
    delegators: { type: Array, required: true },
  },
  setup: function (props) {
    const ITEMS_PER_PAGE = 5
    const currentPage = ref(1)
    const delegatorsCount = ref()
    const filteredDelegators = ref()

    const _delegators = toRef(props, 'delegators')

    const filterDelegators = (newPage: number) => {
      let tempArr = _delegators.value

      if (newPage === 1) {
        filteredDelegators.value = tempArr.slice(0, newPage * ITEMS_PER_PAGE)
      } else {
        filteredDelegators.value = tempArr.slice(
          (newPage - 1) * ITEMS_PER_PAGE,
          (newPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        )
      }
      currentPage.value = newPage
    }

    const paginationHandler = (num: number) => {
      filterDelegators(num)
    }

    onMounted(() => {
      filterDelegators(currentPage.value)
      delegatorsCount.value = _delegators.value.length
    })

    return {
      ITEMS_PER_PAGE,
      delegatorsCount,
      filteredDelegators,
      paginationHandler,
    }
  },
})
</script>

<style lang="scss" scoped></style>

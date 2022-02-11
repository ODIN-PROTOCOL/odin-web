<template>
  <div>
    <div class="app-table">
      <div class="app-table__head">
        <span>Delegator</span>
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
              <a
                class="app-table__cell-txt app-table__link"
                :href="`${API_CONFIG.odinScan}/account/${item.delegation.delegatorAddress}`"
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
          <div class="app-table__empty-stub">
            <p>No items yet</p>
          </div>
        </template>
      </div>
    </div>

    <template v-if="delegatorsCount > ITEMS_PER_PAGE">
      <Pagination
        class="mg-t32 mg-b32"
        v-model="currentPage"
        :pages="totalPages"
        @update:modelValue="paginationHandler"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, toRef } from 'vue'
import { API_CONFIG } from '@/api/api-config'
import Pagination from '@/components/Pagination/Pagination.vue'

export default defineComponent({
  components: { Pagination },
  props: {
    delegators: { type: Array, required: true },
  },
  setup: function (props) {
    const ITEMS_PER_PAGE = 5
    const currentPage = ref(1)
    const totalPages = ref(0)
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
      totalPages.value = Math.ceil(delegatorsCount.value / ITEMS_PER_PAGE)
    })

    return {
      API_CONFIG,
      ITEMS_PER_PAGE,
      currentPage,
      totalPages,
      delegatorsCount,
      filteredDelegators,
      paginationHandler,
    }
  },
})
</script>

<style lang="scss" scoped></style>

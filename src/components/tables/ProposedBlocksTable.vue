<template>
  <div>
    <div class="app-table">
      <div class="app-table__head">
        <span>Block</span>
        <span>Date and time</span>
        <span>Transactions</span>
      </div>
      <div class="app-table__body">
        <template v-if="blocks.length">
          <div
            v-for="item in filteredBlocks"
            :key="toHex(item.blockId.hash)"
            class="app-table__row"
          >
            <div class="app-table__cell">
              <span class="app-table__title">Block</span>
              <a
                class="app-table__cell-txt app-table__link"
                :href="`${API_CONFIG.odinScan}/blocks/${item.header.height}`"
              >
                {{ toHex(item.blockId.hash) }}
              </a>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Date and time</span>
              <span>{{ $fDate(item.header.time) }}</span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Transactions</span>
              <span>{{ item.numTxs }}</span>
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

    <template v-if="blocksCount > ITEMS_PER_PAGE">
      <Pagination
        @changePageNumber="paginationHandler($event)"
        :blocksPerPage="ITEMS_PER_PAGE"
        :total-length="blocksCount"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, toRef, ref } from 'vue'
import { toHex } from '@cosmjs/encoding'
import { API_CONFIG } from '@/api/api-config'
import Pagination from '@/components/pagination/pagination.vue'

export default defineComponent({
  components: { Pagination },
  props: {
    blocks: { type: Array, required: true },
  },
  setup: function (props) {
    const ITEMS_PER_PAGE = 5
    const currentPage = ref(1)
    const blocksCount = ref()
    const filteredBlocks = ref()

    const _blocks = toRef(props, 'blocks')
    console.log(_blocks.value)

    const filterBlocks = (newPage: number) => {
      let tempArr = _blocks.value

      if (newPage === 1) {
        filteredBlocks.value = tempArr.slice(0, newPage * ITEMS_PER_PAGE)
      } else {
        filteredBlocks.value = tempArr.slice(
          (newPage - 1) * ITEMS_PER_PAGE,
          (newPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        )
      }
      currentPage.value = newPage
    }

    const paginationHandler = (num: number) => {
      filterBlocks(num)
    }

    onMounted(() => {
      filterBlocks(currentPage.value)
      blocksCount.value = _blocks.value.length
    })

    return {
      API_CONFIG,
      ITEMS_PER_PAGE,
      blocksCount,
      filteredBlocks,
      paginationHandler,
      toHex,
    }
  },
})
</script>

<style lang="scss" scoped></style>

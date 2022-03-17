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
            :key="item.attributes.block_height"
            class="app-table__row"
          >
            <div class="app-table__cell">
              <span class="app-table__title">Block</span>
              <a
                class="app-table__cell-txt app-table__link"
                :href="`${API_CONFIG.odinScan}/blocks/${item.attributes.block_height}`"
              >
                {{ item.attributes.block_height }}
              </a>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Date and time</span>
              <!-- {{ item.attributes.block_time }} -->
              <span>{{
                $fDate(
                  new Date(item.attributes.block_time * 1000),
                  'HH:mm dd.MM.yy'
                )
              }}</span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Transactions</span>
              <!-- TODO get block tx count -->
              <span>-</span>
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
        class="mg-t32 mg-b32"
        v-model="currentPage"
        :pages="totalPages"
        @update:modelValue="paginationHandler"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { toHex } from '@cosmjs/encoding'
import { API_CONFIG } from '@/api/api-config'
import Pagination from '@/components/Pagination/Pagination.vue'
import { callers } from '@/api/callers'

export default defineComponent({
  components: { Pagination },
  props: {
    proposerAddress: { type: String, required: true },
  },
  setup: function (props) {
    const ITEMS_PER_PAGE = 5
    const currentPage = ref(1)
    const totalPages = ref(0)
    const blocks = ref([])
    const blocksCount = ref()
    const filteredBlocks = ref()

    const getProposedBlocks = async () => {
      const response = await callers.getProposedBlocks(props.proposerAddress)
      const _blocks = await response.json()

      blocks.value = _blocks.data ? _blocks.data : []

      blocksCount.value = blocks.value.length
      totalPages.value = Math.ceil(blocksCount.value / ITEMS_PER_PAGE)
      filterBlocks(currentPage.value)
    }

    const filterBlocks = (newPage: number) => {
      let tempArr = blocks.value

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

    onMounted(async () => {
      await getProposedBlocks()
    })

    return {
      API_CONFIG,
      ITEMS_PER_PAGE,
      currentPage,
      totalPages,
      blocks,
      blocksCount,
      filteredBlocks,
      paginationHandler,
      toHex,
    }
  },
})
</script>

<style lang="scss" scoped></style>

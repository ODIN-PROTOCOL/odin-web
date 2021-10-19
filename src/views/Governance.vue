<template>
  <div class="governance view-main">
    <div class="page-title">
      <h2 class="view-title">Governance</h2>
      <button class="app-btn app-btn_small fx-sae" type="button">
        Create a proposal
      </button>
    </div>

    <div class="chart-block mg-b40">
      <h3>Total number of proposals in ODIN</h3>
    </div>

    <div class="app-table">
      <div class="app-table__head">
        <span>Proposal</span>
        <span>Proposer’s account ID</span>
        <span>Proposal status</span>
      </div>
      <div class="app-table__body">
        <template v-if="true">
          <div v-for="item in 5" :key="item" class="app-table__row">
            <div class="app-table__cell">
              <span class="app-table__title">Proposal</span>
              <span class="app-table__cell-txt">Proposal name</span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Proposer’s account ID</span>
              <TitledLink
                class="app-table__cell-txt app-table__link"
                :text="`0x34513b2dad6c9aae177f01839be7f44c6866df7f7ecc7110cf9d1349ce16d5d4`"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Proposal status</span>
              <StatusBlock :status="'progress'" :text="'In progress'" />
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

    <template v-if="proposalsCount > ITEMS_PER_PAGE">
      <Pagination
        @changePageNumber="paginationHandler($event)"
        :blocksPerPage="ITEMS_PER_PAGE"
        :total-length="proposalsCount"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { callers } from '@/api/callers'
import TitledLink from '@/components/TitledLink.vue'
import StatusBlock from '@/components/StatusBlock.vue'
import Pagination from '@/components/pagination/pagination.vue'

export default defineComponent({
  components: { TitledLink, StatusBlock, Pagination },
  setup: function () {
    const ITEMS_PER_PAGE = 5
    // const currentPage = ref(1)
    const proposalsCount = ref(6)
    const proposals = ref()

    const getProposals = async () => {
      const response = await callers.getProposals(0, 'test', 'test')
      console.log(response)
    }

    const paginationHandler = (num: number) => {
      console.log(num)
    }

    onMounted(async () => {
      await getProposals()
    })

    return {
      ITEMS_PER_PAGE,
      proposalsCount,
      proposals,
      paginationHandler,
    }
  }
})
</script>

<style lang="scss" scoped>
.app-table__head,
.app-table__row {
  grid:
    auto /
    minmax(8rem, 1fr) minmax(8rem, 3fr) minmax(13rem, 0.5fr);
}

@media screen and (max-width: 768px) {
  .app-table__row {
    grid: none;
  }
}
</style>

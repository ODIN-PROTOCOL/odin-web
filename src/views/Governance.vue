<template>
  <div class="governance view-main">
    <div class="page-title">
      <h2 class="view-title">Governance</h2>
      <button class="app-btn app-btn_small fx-sae" type="button">
        Create a proposal
      </button>
    </div>

    <div class="info-card mg-b40">
      <h3 class="info-card__title mg-b40">Total number of proposals in ODIN</h3>
      <CustomDoughnutChart />
    </div>

    <div class="app-table">
      <div class="app-table__head">
        <span>Proposal</span>
        <span>Proposer’s account ID</span>
        <span>Proposal status</span>
      </div>
      <div class="app-table__body">
        <template v-if="proposals?.length">
          <div
            v-for="item in filteredProposals"
            :key="item.proposalId.toString()"
            class="app-table__row"
          >
            <div class="app-table__cell">
              <span class="app-table__title">Proposal</span>
              <TitledLink
                class="app-table__cell-txt app-table__link"
                :text="item.content.title"
              />
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
              <StatusBlock
                :status="proposalStatusType[item.status].status"
                :text="proposalStatusType[item.status].name"
              />
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
import { prepareProposalsData } from '@/helpers/proposalHelpers'
import { proposalStatusType } from '@/helpers/statusTypes'
import TitledLink from '@/components/TitledLink.vue'
import CustomDoughnutChart from '@/components/charts/CustomDoughnutChart.vue'
import StatusBlock from '@/components/StatusBlock.vue'
import Pagination from '@/components/pagination/pagination.vue'

export default defineComponent({
  components: { CustomDoughnutChart, TitledLink, StatusBlock, Pagination },
  setup: function () {
    const ITEMS_PER_PAGE = 5
    const currentPage = ref(1)
    const proposalsCount = ref(0)
    const proposals = ref()
    const filteredProposals = ref()

    const getProposals = async () => {
      const response = await callers.getProposals(0, '', '')
      
      prepareProposalsData(response.proposals)
      proposalsCount.value = response.proposals.length
      proposals.value = response.proposals
      filterProposals(currentPage.value)
    }

    const filterProposals = (newPage: number) => {
      let tempArr = proposals.value

      if (newPage === 1) {
        filteredProposals.value = tempArr.slice(0, newPage * ITEMS_PER_PAGE)
      } else {
        filteredProposals.value = tempArr.slice(
          (newPage - 1) * ITEMS_PER_PAGE,
          (newPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        )
      }
      currentPage.value = newPage
    }

    const paginationHandler = (num: number) => {
      filterProposals(num)
    }

    onMounted(async () => {
      await getProposals()
    })

    return {
      proposalStatusType,
      ITEMS_PER_PAGE,
      proposalsCount,
      proposals,
      filteredProposals,
      paginationHandler,
    }
  },
})
</script>

<style lang="scss" scoped>
.info-card {
  width: 60rem;
  padding: 3.2rem 2.4rem;
  border: 1px solid var(--clr__action);
  border-radius: 0.8rem;

  &__title {
    font-weight: 400;
    font-size: 2.4rem;
    line-height: 2.9rem;
  }
}

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

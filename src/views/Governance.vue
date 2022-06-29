<template>
  <div class="governance view-main">
    <div class="view-main__title-wrapper">
      <h2 class="view-main__title">Governance</h2>
      <button
        class="governance__title-btn app-btn app-btn--medium"
        type="button"
        @click="createProposal()"
      >
        Create a proposal
      </button>
    </div>

    <div class="info-card card-frame governance__info mg-b40">
      <h3 class="info-card__title governance__info-title mg-b40">
        Total number of proposals in ODIN
      </h3>
      <CustomDoughnutChart
        :data="proposalsDataForChart"
        :is-loading="isLoading"
      />
    </div>

    <div class="app-table">
      <div class="app-table__head governance__table-head">
        <span>ID</span>
        <span>Proposal</span>
        <span>Proposer's account ID</span>
        <span>Proposal status</span>
      </div>
      <div class="app-table__body">
        <template v-if="proposals?.length">
          <div
            v-for="item in filteredProposals"
            :key="item.proposal_id"
            class="app-table__row governance__table-row"
          >
            <div class="app-table__cell">
              <span class="app-table__title">ID</span>
              <span class="app-table__cell-txt"> #{{ item.proposal_id }} </span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Proposal</span>
              <TitledLink
                class="app-table__cell-txt app-table__link"
                :text="item.content?.title || '-'"
                :to="`/proposal/${item.proposal_id}`"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Proposer's account ID</span>
              <a
                class="app-table__cell-txt app-table__link"
                :href="`${API_CONFIG.odinScan}/account/${item.proposerAddress}`"
              >
                {{ item.proposerAddress }}
              </a>
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
          <SkeletonTable
            v-if="isLoading"
            :header-titles="headerTitles"
            class-string="governance__table-row"
          />
          <div v-else class="app-table__empty-stub">
            <p class="empty mg-t32">No items yet</p>
          </div>
        </template>
      </div>
    </div>

    <template v-if="proposalsCount > ITEMS_PER_PAGE">
      <AppPagination
        class="mg-t32 mg-b32"
        v-model="currentPage"
        :pages="totalPages"
        @update:modelValue="paginationHandler"
      />
    </template>

    <div class="view-main__mobile-activities">
      <button
        class="app-btn w-full app-btn--medium"
        type="button"
        @click="createProposal()"
      >
        Create a proposal
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { callers } from '@/api/callers'
import { API_CONFIG } from '@/api/api-config'
import { getProposalsCountByStatus } from '@/helpers/proposalHelpers'
import { proposalStatusType } from '@/helpers/statusTypes'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import TitledLink from '@/components/TitledLink.vue'
import CustomDoughnutChart from '@/components/charts/CustomDoughnutChart.vue'
import StatusBlock from '@/components/StatusBlock.vue'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import ProposalFormModal from '@/components/modals/ProposalFormModal.vue'
import { proposalStatusFromJSON } from '@provider/codec/cosmos/gov/v1beta1/gov'
import SkeletonTable from '@/components/SkeletonTable.vue'
import { ChartDataItem } from '@/helpers/Types'
import { Router, useRouter } from 'vue-router'

export default defineComponent({
  components: {
    CustomDoughnutChart,
    TitledLink,
    StatusBlock,
    AppPagination,
    SkeletonTable,
  },
  setup() {
    const router: Router = useRouter()
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const ITEMS_PER_PAGE = 5
    const currentPage = ref(1)
    const totalPages = ref()
    const proposalsCount = ref(0)
    const proposals = ref()
    const filteredProposals = ref()
    const proposalChanges = ref()
    const proposalsDataForChart = ref<ChartDataItem[] | never[]>([])
    const headerTitles = [
      { title: 'ID' },
      { title: 'Proposal' },
      { title: `Proposer's account ID` },
      { title: 'Proposal status' },
    ]
    const getProposals = async () => {
      lockLoading()
      try {
        const response = await callers.getProposals(0, 100, true)
        const transformedProposals = await Promise.all(
          response.data?.proposals?.map(
            async (item: { proposal_id: string; status: string }) => {
              const response = await callers.getProposer(item.proposal_id)
              const proposer = await response.json()
              return {
                ...item,
                proposerAddress: proposer.result.proposer,
                status: proposalStatusFromJSON(item.status),
                humanizeStatus:
                  proposalStatusType[proposalStatusFromJSON(item.status)].name,
              }
            }
          )
        )
        proposalsCount.value = response.data?.proposals.length
        proposals.value = transformedProposals
        totalPages.value = Math.ceil(proposalsCount.value / ITEMS_PER_PAGE)
        filterProposals()
      } catch (error) {
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
      }
      releaseLoading()
    }

    const getProposalStatistic = async () => {
      lockLoading()
      try {
        proposalsDataForChart.value = await callers
          .getProposalsStatistic()
          .then((request) => request.json())
          .then((data) => getProposalsCountByStatus(data))
      } catch (error) {
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
      }
      releaseLoading()
    }

    const filterProposals = () => {
      const tempArr = proposals.value
      if (totalPages.value < currentPage.value) {
        currentPage.value = 1
        setPage()
      }
      if (currentPage.value === 1) {
        filteredProposals.value = tempArr.slice(
          0,
          currentPage.value * ITEMS_PER_PAGE
        )
      } else {
        filteredProposals.value = tempArr.slice(
          (currentPage.value - 1) * ITEMS_PER_PAGE,
          (currentPage.value - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        )
      }
    }

    const getChangesParams = async () => {
      lockLoading()
      try {
        proposalChanges.value = await callers
          .getProposalChanges()
          .then((request) => request.json())
      } catch (error) {
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
      }
      releaseLoading()
    }
    const setPage = () => {
      router.push({
        query: { page: currentPage.value },
      })
    }
    const createProposal = async () => {
      await showDialogHandler(
        ProposalFormModal,
        {
          onSubmit: (d) => {
            d.kill()
            getProposals()
          },
        },
        { proposalChanges: proposalChanges.value }
      )
    }

    const paginationHandler = (num: number) => {
      currentPage.value = num
      setPage()
      filterProposals()
    }

    onMounted(async () => {
      if (router.currentRoute.value.query.page) {
        currentPage.value = Number(router.currentRoute.value.query.page)
      } else {
        setPage()
      }
      await getChangesParams()
      await getProposalStatistic()
      await getProposals()
    })

    return {
      API_CONFIG,
      currentPage,
      totalPages,
      isLoading,
      proposalStatusType,
      proposalsDataForChart,
      ITEMS_PER_PAGE,
      proposalsCount,
      proposals,
      filteredProposals,
      createProposal,
      paginationHandler,
      headerTitles,
    }
  },
})
</script>

<style lang="scss" scoped>
.governance__info {
  width: 60rem;
}
.governance__info-title {
  font-weight: 400;
  font-size: 2.4rem;
  line-height: 2.9rem;
}

@include respond-to(tablet) {
  .governance__title-btn {
    display: none;
  }
  .governance {
    padding-bottom: 10rem;
  }
  .governance__title-btn {
    display: none;
  }
  .governance__info {
    width: 100%;
  }
}
</style>

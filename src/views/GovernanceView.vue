<template>
  <div class="app__main-view governance-view">
    <div class="app__main-view-table-header governance-view__table-header">
      <div class="governance-view__container">
        <div class="app__main-view-table-header-prefix">
          <span>Ps</span>
        </div>
        <div class="app__main-view-table-header-info">
          <h3 class="app__main-view-table-header-info-title">Proposals</h3>
        </div>
      </div>
      <button
        v-if="accountAddress"
        class="governance-view__title-btn app-btn app-btn--medium"
        type="button"
        @click="createProposal()"
      >
        Create a proposal
      </button>
    </div>

    <!-- <div class="info-card card-frame governance-view__info mg-b40">
      <h3 class="info-card__title governance-view__info-title mg-b40">
        Total number of proposals in ODIN
      </h3>

      <CustomDoughnutChart
        :data="proposalsDataForChart"
        :is-loading="isLoading"
      />
    </div> -->

    <div class="app-table">
      <div class="app-table__head governance-view__table-head">
        <span>ID</span>
        <span>Proposal</span>
        <span>Proposer's account ID</span>
        <span>Proposal status</span>
      </div>
      <div class="app-table__body">
        <template v-if="proposals?.length">
          <div
            v-for="item in proposals"
            :key="item.proposalId"
            class="app-table__row governance-view__table-row"
          >
            <div class="app-table__cell">
              <span class="app-table__title">ID</span>
              <span class="app-table__cell-txt"> #{{ item.proposalId }} </span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Proposal</span>
              <TitledLink
                class="app-table__cell-txt app-table__link"
                :text="item.title || '-'"
                :name="{
                  name: $routes.proposal,
                  params: { id: item.proposalId },
                }"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Proposer's account ID</span>
              <a
                class="app-table__cell-txt app-table__link"
                :href="`/accounts/${item.proposerAddress}`"
              >
                {{ item.proposerAddress }}
              </a>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Proposal status</span>
              <Tag
                :text="proposalStatusType[item.status].name"
                :type="proposalStatusType[item.status].status"
              />
            </div>
          </div>
        </template>
        <template v-else>
          <SkeletonTable
            v-if="isLoading"
            :header-titles="headerTitles"
            class-string="governance-view__table-row"
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

    <div v-if="accountAddress" class="view-main__mobile-activities">
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

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { callers } from '@/api/callers'
import { getProposalsCountByStatus } from '@/helpers/proposalHelpers'
import { proposalStatusType } from '@/helpers/statusTypes'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import { ProposalFormModal } from '@/components/modals'
import { proposalStatusFromJSON } from '@provider/codec/cosmos/gov/v1beta1/gov'
import { ChartDataItem } from '@/helpers/Types'
import { wallet } from '@/api/wallet'
import TitledLink from '@/components/TitledLink.vue'
import CustomDoughnutChart from '@/components/charts/CustomDoughnutChart.vue'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import SkeletonTable from '@/components/SkeletonTable.vue'
import Tag from '@/components/Tag.vue'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const ITEMS_PER_PAGE = 30
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

const accountAddress = wallet.isEmpty ? '' : wallet.account.address

const getProposals = async () => {
  lockLoading()
  try {
    const response = await callers.getProposals(
      (currentPage.value - 1) * ITEMS_PER_PAGE,
      ITEMS_PER_PAGE,
      'desc',
    )
    proposals.value = response.data.proposal || []
    proposalsCount.value = response.data.proposal_aggregate.aggregate.count || 0
    totalPages.value = Math.ceil(proposalsCount.value / ITEMS_PER_PAGE)
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
      .then(request => request.json())
      .then(data => getProposalsCountByStatus(data))
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

const getChangesParams = async () => {
  lockLoading()
  try {
    proposalChanges.value = await callers
      .getProposalChanges()
      .then(request => request.json())
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

const createProposal = async () => {
  await showDialogHandler(
    ProposalFormModal,
    {
      onSubmit: d => {
        d.kill()
        getProposals()
      },
    },
    { proposalChanges: proposalChanges.value },
  )
}

const paginationHandler = (num: number) => {
  getProposals()
}

onMounted(async () => {
  //await getChangesParams()
  // await getProposalStatistic()
  await getProposals()
})
</script>

<style lang="scss" scoped>
.governance-view__info {
  width: 60rem;
}

.governance-view__info-title {
  font-weight: 400;
  font-size: 2.4rem;
  line-height: 2.9rem;
}

.governance-view__table-header {
  justify-content: space-between;
}

.governance-view__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@include respond-to(tablet) {
  .governance-view__title-btn {
    display: none;
  }

  .governance-view {
    padding-bottom: 10rem;
  }

  .governance-view__title-btn {
    display: none;
  }

  .governance-view__info {
    width: 100%;
  }

  .app-table__head {
    display: none;
  }

  .app-table__title {
    min-width: 12rem;
    margin-right: 2.4rem;
    display: inline-block;
    font-weight: 300;
  }

  .app-table__row {
    padding: 3.4rem 0 1.6rem;
    grid: none;
  }
}
</style>

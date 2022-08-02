<template>
  <div class="voting-view view-main">
    <div class="view-main__title-wrapper voting-view__title-wrapper">
      <BackButton :text="'Proposal'" />
      <h2 class="voting-view__title view-main__title">Vote for proposal</h2>
      <span class="view-main__subtitle">{{ proposalName }}</span>
    </div>

    <div class="voting-view__main">
      <div
        v-if="
          currentProposalStatus === ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD
        "
        class="voting-view__choice"
      >
        <div class="voting-view__choice-item">
          <input
            class="voting-view__choice-item-input"
            type="radio"
            id="support"
            :value="VoteOption.VOTE_OPTION_YES"
            checked
            v-model="pickedOption"
          />
          <label class="voting-view__choice-item-lbl" for="support">
            Support
          </label>
        </div>
        <div class="voting-view__choice-item">
          <input
            class="voting-view__choice-item-input"
            type="radio"
            id="reject"
            :value="VoteOption.VOTE_OPTION_NO"
            v-model="pickedOption"
          />
          <label class="voting-view__choice-item-lbl" for="reject">
            Reject
          </label>
        </div>
        <div class="voting-view__choice-item">
          <input
            class="voting-view__choice-item-input"
            type="radio"
            id="veto"
            :value="VoteOption.VOTE_OPTION_NO_WITH_VETO"
            v-model="pickedOption"
          />
          <label class="voting-view__choice-item-lbl" for="veto"> Veto </label>
        </div>
        <div class="voting-view__choice-item">
          <input
            class="voting-view__choice-item-input"
            type="radio"
            id="abstain"
            :value="VoteOption.VOTE_OPTION_ABSTAIN"
            v-model="pickedOption"
          />
          <label class="voting-view__choice-item-lbl" for="abstain">
            Abstain
          </label>
        </div>

        <button
          :disabled="
            currentProposalStatus !==
            ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD
          "
          class="voting-view__btn app-btn app-btn--medium"
          @click="confirmation()"
        >
          Vote
        </button>
      </div>
      <div class="voting-view__chart card-frame">
        <h3 class="voting-view__chart-title mg-b40">Results of voting</h3>
        <CustomDoughnutChart :isLoading="isLoading" :data="votesDataForChart" />
      </div>
    </div>
    <template v-if="isLoading">
      <Loader />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { callers } from '@/api/callers'
import { wallet } from '@/api/wallet'
import Long from 'long'
import {
  VoteOption,
  ProposalStatus,
} from '@provider/codec/cosmos/gov/v1beta1/gov'
import { voteStatusType } from '@/helpers/statusTypes'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import BackButton from '@/components/BackButton.vue'
import CustomDoughnutChart from '@/components/charts/CustomDoughnutChart.vue'
import Loader from '@/components/Loader.vue'
import { getVotesCountByStatus } from '@/helpers/voteHelpers'
import { ChartDataItem } from '@/helpers/Types'
import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const route: RouteLocationNormalizedLoaded = useRoute()
const votesDataForChart = ref<ChartDataItem[] | never[]>([])
const pickedOption = ref(VoteOption.VOTE_OPTION_YES)
const proposalName = ref('')
const currentProposalStatus = ref(0)
const getProposal = async () => {
  lockLoading()
  try {
    const res = await callers.getProposal(Number(route.params.id))
    currentProposalStatus.value = res.proposal.status
    proposalName.value = res.proposal.content?.title as string
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

const getVotes = async () => {
  lockLoading()
  try {
    const res = await callers.getProposalVotes(Number(route.params.id))

    votesDataForChart.value = getVotesCountByStatus(res.votes)
    // if (res.votes.length) {
    //   const isVote = res.votes.find(
    //     item => item.voter === wallet.account.address,
    //   )
    // }
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

const vote = async () => {
  lockLoading()
  try {
    await callers.proposalVote({
      proposalId: new Long(Number(route.params.id)),
      voter: wallet.account.address,
      option: pickedOption.value,
    })

    await getProposal()
    await getVotes()
    handleNotificationInfo(
      `Successfully voted for ${voteStatusType[pickedOption.value].name}`,
      TYPE_NOTIFICATION.success,
    )
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

const confirmation = async () => {
  await showDialogHandler(
    ConfirmationModal,
    {
      onSubmit: d => {
        d.kill()
        vote()
      },
    },
    {
      text: `You have chosen to vote for "${
        voteStatusType[pickedOption.value].name
      }"`,
    },
  )
}

onMounted(async () => {
  await getProposal()
  await getVotes()
})
</script>

<style lang="scss" scoped>
.voting-view__title {
  margin: 0 1.6rem 0 2rem;
}
.voting-view__title-wrapper {
  justify-content: flex-start;
}
.voting-view__main {
  display: flex;
  gap: 12.8rem;
  align-items: flex-start;
  flex-direction: row;
}
.voting-view__choice,
.voting-view__chart {
  width: 100%;
  padding: 3.2rem 2.4rem;
  border-radius: 0.8rem;
}

.voting-view__choice {
  background: var(--clr__grey-bg);
}

.voting-view__choice-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 3.2rem;
}
.voting-view__choice-item-input {
  height: 2rem;
  width: 2rem;
}
.voting-view__choice-item-lbl {
  line-height: 2.4rem;
}

.voting-view__chart-title {
  font-size: 2.4rem;
  font-weight: 400;
}

@include respond-to(tablet) {
  .voting-view__title {
    margin: 0.8rem 0 0.4rem 0;
  }
  .voting-view__main {
    flex-direction: column-reverse;
    gap: 4rem;
  }
  .voting-view__btn {
    width: 100%;
  }
}
</style>

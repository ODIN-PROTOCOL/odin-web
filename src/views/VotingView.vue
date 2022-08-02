<template>
  <div class="voting-view view-main">
    <div class="view-main__title-wrapper voting-view__title-wrapper">
      <BackButton text="Proposal" />
      <h2 class="voting-view__title view-main__title">Vote for proposal</h2>
      <span class="view-main__subtitle">{{ proposalName }}</span>
    </div>

    <div class="voting-view__main">
      <div
        v-if="currentProposalStatus === PROPOSAL_STATUS.votingPeriod"
        class="voting-view__choice"
      >
        <div
          v-for="item in VOTE_OPTIONS"
          :key="item.value"
          class="voting-view__choice-item"
        >
          <input
            class="voting-view__choice-item-input"
            type="radio"
            :value="item.value"
            v-model="pickedOption"
          />
          <label class="voting-view__choice-item-lbl">
            {{ item.title }}
          </label>
        </div>
        <button
          class="voting-view__btn app-btn app-btn--medium"
          @click="confirmation"
        >
          {{ voteBtnText }}
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
import { computed, onMounted, ref } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { callers } from '@/api/callers'
import { wallet } from '@/api/wallet'
import Long from 'long'
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
import { Vote } from 'cosmjs-types/cosmos/gov/v1beta1/gov'
import { VOTE_OPTIONS } from '@/const'
import { PROPOSAL_STATUS } from '@/enums'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const route: RouteLocationNormalizedLoaded = useRoute()
const votesDataForChart = ref<ChartDataItem[]>([])
const selfVote = ref<Vote>()
const pickedOption = ref(VOTE_OPTIONS[0].value)
const proposalName = ref('')
const currentProposalStatus = ref(0)
const voteBtnText = computed(() => (selfVote.value?.voter ? 'Revote' : 'Vote'))
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
    if (res.votes.length) {
      selfVote.value = res.votes.find(
        item => item.voter === wallet.account.address,
      )
      if (selfVote.value?.options.length) {
        pickedOption.value = Number(selfVote.value.options[0].option)
      }
    }
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
      text: `You have chosen to ${voteBtnText.value.toLowerCase()} for "${
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

<template>
  <div class="app__main-view voting-view">
    <div class="app__main-view-detail-container">
      <div class="app__main-view-detail-back-icon">
        <BackButton />
      </div>
      <div class="app__main-view-detail-title-container">
        <h2 class="app__main-view-detail-title">Vote for Proposal</h2>
        <div class="app__main-view-detail-subtitle-container">
          <span class="app__main-view-detail-subtitle">
            {{ proposalName }}
          </span>
        </div>
      </div>
    </div>

    <template v-if="!isLoading">
      <template v-if="isLoadingError">
        <ui-loading-error-message
          message="Something went wrong"
          title="Try again!"
        />
      </template>
      <template v-else>
        <div class="voting-view__main">
          <div
            v-if="currentProposalStatus === PROPOSAL_STATUS.votingPeriod"
            class="voting-view__choice"
          >
            <h4 class="voting-view__choice-title">{{ votingChooseTitle }}</h4>
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
              class="w-full app-btn app-btn--medium"
              :disabled="selfVote?.option === pickedOption"
              @click="confirmation"
            >
              {{ voteBtnText }}
            </button>
          </div>

          <div class="voting-view__chart card-frame">
            <h3 class="voting-view__chart-title mg-b40">Results of voting</h3>
            <CustomDoughnutChart
              :isLoading="isLoading"
              :data="votesDataForChart"
            />
          </div>
        </div>
      </template>
    </template>
    <template v-else>
      <div class="app-table__empty-stub">
        <ui-loader positionCenter message="Loading" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { callers } from '@/api/callers'
import { wallet } from '@/api/wallet'
import { voteStatusType } from '@/helpers/statusTypes'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { getVotesCountByStatus } from '@/helpers/voteHelpers'
import { ChartDataItem } from '@/helpers/Types'
import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import { ConfirmationModal } from '@/components/modals'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { Vote } from 'cosmjs-types/cosmos/gov/v1beta1/gov'
import { proposalStatusFromJSON } from "@provider/codec/cosmos/gov/v1beta1/gov"
import { VOTE_OPTIONS } from '@/const'
import { PROPOSAL_STATUS } from '@/enums'
import { UiLoadingErrorMessage, UiLoader } from '@/components/ui'
import BackButton from '@/components/BackButton.vue'
import CustomDoughnutChart from '@/components/charts/CustomDoughnutChart.vue'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const route: RouteLocationNormalizedLoaded = useRoute()
const votesDataForChart = ref<ChartDataItem[]>([])
const selfVote = ref<Vote>()
const pickedOption = ref(VOTE_OPTIONS[0].value)
const proposalName = ref('')
const isLoadingError = ref(false)
const currentProposalStatus = ref(0)
const votingChooseTitle = computed(() => {
  if (selfVote.value?.options.length) {
    return `Your option: "${
      voteStatusType[selfVote.value.options[0].option].name
    }"`
  } else {
    return 'Choose an option:'
  }
})
const confirmationText = computed(() => {
  if (selfVote.value?.options.length) {
    return `You changed your vote from "${
      voteStatusType[selfVote.value.options[0].option].name
    }" to "${voteStatusType[pickedOption.value].name}"`
  } else {
    return `You have chosen to vote for "${
      voteStatusType[pickedOption.value].name
    }"`
  }
})
const voteBtnText = computed(() => (selfVote.value?.voter ? 'Revote' : 'Vote'))

const getProposal = async () => {
  lockLoading()
  try {

    const res = await callers.getProposal(Number(route.params.id))
    currentProposalStatus.value = proposalStatusFromJSON(res.status)

    console.log("Status", res.status, currentProposalStatus.value)
    proposalName.value = res.content?.title as string
  } catch (error) {
    isLoadingError.value = true
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
    isLoadingError.value = true
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

const loadData = async () => {
  await getVotes()
  await getProposal()
}

const confirmation = async () => {
  await showDialogHandler(
    ConfirmationModal,
    {
      onSubmit: async d => {
        await loadData()
        d.kill()
      },
    },
    {
      text: confirmationText.value,
      id: Number(route.params.id),
      pickedOption: pickedOption.value,
    },
  )
}

onMounted(async () => {
  await loadData()
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
  max-width: 100%;
  display: grid;
  grid-gap: 5rem;
  margin: 2rem 0 4rem;
  grid:
    auto /
    minmax(20rem, 1fr)
    minmax(20rem, 1fr);
}
.voting-view__choice {
  width: 100%;
  padding: 3.2rem 2.4rem;
  border-radius: 0.8rem;
}

.voting-view__chart {
  padding: 3.2rem 6rem;
  border-radius: 0.8rem;
}

.voting-view__choice {
  background: var(--clr__main-bg);
}
.voting-view__choice-title {
  padding-bottom: 1rem;
  font-size: 2rem;
  font-weight: 400;
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
  .voting-view__chart {
    width: 100%;
  }

  .voting-view__title {
    margin: 0.8rem 0 0.4rem 0;
  }
  .voting-view__main {
    grid: none;
    display: flex;
    flex-direction: column-reverse;
    gap: 4rem;
  }
}
</style>

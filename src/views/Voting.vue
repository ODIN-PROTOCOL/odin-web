<template>
  <div class="voting view-main">
    <div class="view-main__title-wrapper">
      <BackButton :text="'Proposal'" />
      <h2 class="voting__title view-main__title">Vote for proposal</h2>
      <span class="view-main__subtitle">{{ proposalName }}</span>
    </div>

    <div class="voting__main">
      <div class="voting__choice">
        <div class="voting__choice-item mg-b24">
          <div>
            <input
              type="radio"
              id="support"
              :value="VoteOption.VOTE_OPTION_YES"
              checked
              v-model="pickedOption"
            />
            <label class="voting__choice-item-lbl" for="support">
              Support
            </label>
          </div>
          <div>
            <input
              type="radio"
              id="reject"
              :value="VoteOption.VOTE_OPTION_NO"
              v-model="pickedOption"
            />
            <label class="voting__choice-item-lbl" for="reject"> Reject </label>
          </div>
          <div>
            <input
              type="radio"
              id="veto"
              :value="VoteOption.VOTE_OPTION_NO_WITH_VETO"
              v-model="pickedOption"
            />
            <label class="voting__choice-item-lbl" for="veto"> Veto </label>
          </div>
          <div>
            <input
              type="radio"
              id="abstain"
              :value="VoteOption.VOTE_OPTION_ABSTAIN"
              v-model="pickedOption"
            />
            <label class="voting__choice-item-lbl" for="abstain">
              Abstain
            </label>
          </div>
        </div>
        <button
          class="voting__btn app-btn app-btn_small"
          @click="confirmation()"
        >
          Vote
        </button>
      </div>
      <div class="voting__chart">
        <h3 class="voting__chart-title mg-b40">Results of voting</h3>
        <CustomDoughnutChart :data="votesDataForChart" />
      </div>
    </div>
    <template v-if="isLoading">
      <Loader />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { callers } from '@/api/callers'
import { wallet } from '@/api/wallet'
import Long from 'long'
import { VoteOption } from '@provider/codec/cosmos/gov/v1beta1/gov'
import { voteStatusType } from '@/helpers/statusTypes'
import { handleError } from '@/helpers/errors'
import { notifySuccess } from '@/helpers/notifications'
import BackButton from '@/components/BackButton.vue'
import CustomDoughnutChart from '@/components/charts/CustomDoughnutChart.vue'
import Loader from '@/components/Loader.vue'
import { getVotesCountByStatus } from '@/helpers/voteHelpers'

import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import ConfirmationModal from '@/components/modals/ConfirmationModal.vue'

export default defineComponent({
  components: { BackButton, CustomDoughnutChart, Loader },
  setup: function () {
    const route: RouteLocationNormalizedLoaded = useRoute()
    const isLoading = ref(false)

    const votesDataForChart = ref()
    const pickedOption = ref(VoteOption.VOTE_OPTION_YES)
    const proposalName = ref('')

    const getProposal = async () => {
      const res = await callers.getProposal(Number(route.params.id))

      proposalName.value = res.proposal.content?.title as string
    }

    const getVotes = async () => {
      const res = await callers.getProposalVotes(Number(route.params.id))
      votesDataForChart.value = getVotesCountByStatus(res.votes)
    }

    const vote = async () => {
      isLoading.value = true
      try {
        await callers.proposalVote({
          proposalId: new Long(Number(route.params.id)),
          voter: wallet.account.address,
          option: pickedOption.value,
        })

        await getProposal()
        await getVotes()
        notifySuccess(
          `Successfully voted for ${voteStatusType[pickedOption.value].name}`
        )
      } catch (error) {
        handleError(error as Error)
      }
      isLoading.value = false
    }

    const confirmation = async () => {
      await showDialogHandler(
        ConfirmationModal,
        {
          onSubmit: (d) => {
            d.kill()
            vote()
          },
        },
        {
          text: `You have chosen to vote for "${
            voteStatusType[pickedOption.value].name
          }"`,
        }
      )
    }

    onMounted(async () => {
      await getProposal()
      await getVotes()
    })

    return {
      isLoading,
      pickedOption,
      proposalName,
      VoteOption,
      votesDataForChart,
      confirmation,
      vote,
    }
  },
})
</script>

<style lang="scss" scoped>
.voting__title {
  margin: 0 1.6rem 0 2rem;
}

.voting__main {
  display: flex;
  gap: 12.8rem;
  align-items: flex-start;
  flex-direction: row;
}
.voting__choice,
.voting__chart {
  width: 100%;
  padding: 3.2rem 2.4rem;
  border-radius: 0.8rem;
}

.voting__choice {
  background: var(--clr__grey-bg);
}

.voting__chart {
  border: 0.1rem solid var(--clr__action);
}

.voting__choice-item {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.voting__choice-item-lbl {
  margin-left: 0.8rem;
}

.voting__chart-title {
  font-size: 2.4rem;
  font-weight: 400;
}

@include respond-to(tablet) {
  .voting__title {
    margin: 0.8rem 0 0.4rem 0;
  }
  .voting__main {
    flex-direction: column-reverse;
    gap: 4rem;
  }
  .voting__btn {
    width: 100%;
  }
}
</style>

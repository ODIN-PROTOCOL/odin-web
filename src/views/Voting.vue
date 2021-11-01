<template>
  <div class="voting view-main">
    <div class="page-title">
      <BackButton :text="'Proposal'" />
      <h2 class="view-title">Vote for proposal</h2>
      <span class="view-subtitle"> Proposal Name </span>
    </div>

    <div class="content-block">
      <div class="content-block__voting">
        <div class="content-block__voting-choice mg-b24">
          <div>
            <input
              type="radio"
              id="support"
              value="Support"
              checked
              v-model="picked"
            />
            <label for="support">Support</label>
          </div>
          <div>
            <input type="radio" id="reject" value="Reject" v-model="picked" />
            <label for="reject">Reject</label>
          </div>
          <div>
            <input type="radio" id="veto" value="Veto" v-model="picked" />
            <label for="veto">Veto</label>
          </div>
          <div>
            <input type="radio" id="abstain" value="Abstain" v-model="picked" />
            <label for="abstain">Abstain</label>
          </div>
        </div>
        <button
          class="app-btn app-btn_small voting__btn"
          @click="confirmation()"
        >
          Vote
        </button>
      </div>
      <div class="content-block__chart">
        <h3 class="content-block__chart-title mg-b40">Results of voting</h3>
        <CustomDoughnutChart :data="votesDataForChart" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { callers } from '@/api/callers'
import { wallet } from '@/api/wallet'
import Long from 'long'
import { handleError } from '@/helpers/errors'
import BackButton from '@/components/BackButton.vue'
import CustomDoughnutChart from '@/components/charts/CustomDoughnutChart.vue'
import { showConfirmationDialog } from '@/components/modals/ConfirmationModal.vue'

export default defineComponent({
  components: { BackButton, CustomDoughnutChart },
  setup: function () {
    const route: RouteLocationNormalizedLoaded = useRoute()

    const votesDataForChart = ref()
    const picked = ref('Support')

    const getProposal = async () => {
      const response = await callers.getProposals(0, '', '')
      const response1 = await callers.getProposalVotes(1)

      console.log(response)
      console.log(response1)
    }

    const vote = async () => {
      try {
        await callers.proposalVote({
          proposalId: new Long(1),
          voter: wallet.account.address,
          option: 2,
        })
      } catch (error) {
        handleError(error as Error)
      }
    }

    const confirmation = () => {
      showConfirmationDialog(
        {
          onSubmit: (d) => {
            d.kill()
            vote()
            console.log(picked.value)
          },
        },
        {
          text: `You have chosen to vote for "${picked.value}"`,
        }
      )
    }

    onMounted(async () => {
      await getProposal()
      votesDataForChart.value = [
        { name: 'Support', count: 10, color: '#00D097' },
        { name: 'Reject', count: 1, color: '#F65160' },
        { name: 'Veto', count: 3, color: '#FDC748' },
        { name: 'Abstained votes', count: 0, color: '#007BFF' },
      ]
    })

    return { picked, votesDataForChart, confirmation, vote }
  },
})
</script>

<style lang="scss" scoped>
.view-title {
  margin: 0 1.6rem 0 2rem;
}

.content-block {
  display: flex;
  gap: 12.8rem;
  align-items: flex-start;
  flex-direction: row;

  &__voting,
  &__chart {
    width: 100%;
    padding: 3.2rem 2.4rem;
    border-radius: 0.8rem;
  }

  &__voting {
    background: var(--clr__grey-bg);
  }

  &__voting-choice {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;

    label {
      margin-left: 0.8rem;
    }
  }

  &__chart {
    border: 1px solid var(--clr__action);
  }

  &__chart-title {
    font-size: 2.4rem;
    font-weight: 400;
  }
}

@media screen and (max-width: 768px) {
  .view-title {
    margin: 0.8rem 0 0.4rem 0;
  }

  .content-block {
    flex-direction: column-reverse;
    gap: 4rem;

    .voting__btn {
      width: 100%;
    }
  }
}
</style>

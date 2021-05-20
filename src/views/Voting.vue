<template>
  <div class="proposals">
    <h3>Voting</h3>
    <div class="app-table">
      <div class="proposals__table-head app-table__head">
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> ID </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Title </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Tally </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Deposit </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Status </span>
        </div>
      </div>
      <button
        v-for="item in proposals"
        :key="item.id"
        class="app-table__row-btn"
        type="button"
        @click="showProposal(item)"
      >
        <div class="proposals__table-row app-table__row">
          <div class="app-table__cell">
            <TitledSpan class="app-table__cell-txt" :text="item.proposalId" />
          </div>
          <div class="app-table__cell">
            <TitledSpan
              class="app-table__cell-txt"
              :text="item.content.title"
            />
          </div>
          <div class="app-table__cell">
            <TitledSpan
              class="app-table__cell-txt"
              :text="$tTallyShort(item.finalTallyResult)"
              :title="$tTally(item.finalTallyResult)"
            />
          </div>
          <div class="app-table__cell">
            <TitledSpan
              class="app-table__cell-txt"
              :text="$fCoin(item.totalDeposit[0])"
            />
          </div>
          <div class="app-table__cell">
            <TitledSpan
              class="app-table__cell-txt"
              :text="$tProposalStatusDated(item)"
            />
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { callers } from '@/api/callers'
import { showProposalDialog } from '@/components/modals/ProposalModal'
import TitledSpan from '@/components/TitledSpan.vue'
import {
  Proposal,
  ProposalStatus,
} from '@provider/codec/cosmos/gov/v1beta1/gov'
import { defineComponent, ref } from 'vue'

// TODO: my votes

export default defineComponent({
  components: { TitledSpan },
  setup() {
    const proposals = ref()
    const loadProposals = async () => {
      const response = await callers.getProposals(
        ProposalStatus.UNRECOGNIZED,
        '',
        ''
      )
      console.debug('Proposals:', response)
      proposals.value = response.proposals
    }
    loadProposals()

    const showProposal = (proposal: Proposal) => {
      showProposalDialog(
        {
          onSubmit: (d) => {
            d.kill()
            loadProposals()
          },
        },
        { proposal }
      )
    }

    return { proposals, showProposal }
  },
})
</script>

<style scoped>
.proposals__table-head,
.proposals__table-row {
  /* prettier-ignore */
  grid: auto / minmax(2rem, 0.1fr) minmax(8rem, 1fr) minmax(4rem, 1fr) minmax(4rem, 1fr) minmax(4rem, 1fr);
}
</style>

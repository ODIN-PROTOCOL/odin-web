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
        v-for="(item, idx) in proposals"
        :key="item.id"
        class="app-table__row-btn"
        type="button"
        @click="showProposal(item, tallies[idx])"
      >
        <div class="proposals__table-row app-table__row">
          <div class="app-table__cell">
            <TitledSpan
              class="app-table__cell-txt"
              :text="item.proposalId.toString()"
            />
          </div>
          <div class="app-table__cell">
            <TitledSpan
              class="app-table__cell-txt"
              :text="item.content.title"
            />
          </div>
          <div class="app-table__cell">
            <Tally
              v-if="tallies?.[idx]"
              class="app-table__cell-txt"
              :tally="tallies[idx]"
              :isShort="true"
              :isTitled="true"
            />
            <span v-else></span>
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
import Tally from '@/components/Tally.vue'
import { ProposalDecoded } from '@/helpers/proposalDecoders'
import {
  ProposalStatus,
  TallyResult,
} from '@provider/codec/cosmos/gov/v1beta1/gov'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  components: { TitledSpan, Tally },
  setup() {
    const proposals = ref()
    const tallies = ref()
    const loadProposals = async () => {
      const response = await callers.getProposals(
        ProposalStatus.UNRECOGNIZED,
        '',
        ''
      )
      _loadTallies(response.proposals)
      proposals.value = response.proposals

      console.debug('Proposals:', response)
      _test(response.proposals)
    }
    loadProposals()

    const _loadTallies = async (proposals: ProposalDecoded[]) => {
      const _tallies = await Promise.all(
        proposals.map((el) =>
          el.status === ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD
            ? callers
                .getProposalTally(el.proposalId)
                .then((r) => r.tally)
                .catch(() => el.finalTallyResult)
            : el.finalTallyResult
        )
      )
      tallies.value = _tallies
      console.debug('Tallies', _tallies)
    }

    // TODO: remove
    const _test = async (proposals: ProposalDecoded[]) => {
      for (const proposal of proposals) {
        const votes = await callers.getProposalVotes(proposal.proposalId)
        const tally = await callers.getProposalTally(proposal.proposalId)
        console.log(proposal, votes, tally)
      }
    }

    const showProposal = (proposal: ProposalDecoded, tally: TallyResult) => {
      showProposalDialog(
        {
          onSubmit: (d) => {
            d.kill()
            loadProposals()
          },
        },
        { proposal, tally }
      )
    }

    return { proposals, tallies, showProposal }
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

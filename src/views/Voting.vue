<template>
  <div class="proposals">
    <h3>Voting</h3>
    <div class="app-table">
      <div class="requests__table-head app-table__head">
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> ID </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Result </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Status </span>
        </div>
      </div>
      <div
        v-for="item in proposals"
        :key="item.id"
        class="requests__table-row app-table__row"
      >
        <div class="app-table__cell">
          <TitledSpan class="app-table__cell-txt" :text="item.proposalId" />
        </div>
        <div class="app-table__cell">
          <TitledSpan class="app-table__cell-txt" :text="item.votingEndTime" />
        </div>
        <div class="app-table__cell">
          <TitledSpan
            class="app-table__cell-txt"
            :text="$tProposalStatus(item.status)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { callers } from '@/api/callers'
import { wallet } from '@/api/wallet'
import TitledSpan from '@/components/TitledSpan.vue'
import { ProposalStatus } from '@provider/codec/cosmos/gov/v1beta1/gov'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  components: { TitledSpan },
  setup() {
    const proposals = ref()
    const loadRequests = async () => {
      const response = await callers.getProposals(
        ProposalStatus.UNRECOGNIZED,
        '',
        ''
      )
      // console.log(response.proposals[0].)
      console.debug('Proposals:', response)
      proposals.value = response.proposals
    }
    loadRequests()

    return { proposals }
  },
})
</script>

<style scoped>
.proposals__table-head,
.proposals__table-row {
  grid:
    auto /
    minmax(2rem, 0.1fr) minmax(8rem, 1fr) minmax(3rem, 0.15fr);
}
</style>

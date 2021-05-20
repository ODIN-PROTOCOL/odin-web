<template>
  <ModalBase class="proposal-modal" @close="onClose()">
    <template #title>
      <h3>View proposal #{{ proposal.proposalId }}</h3>
    </template>

    <template #main>
      <div class="proposal-modal__row mg-b8">
        <p class="proposal-modal__row-lbl fs-14 fs-wb">Title</p>
        <p class="proposal-modal__row-val">{{ proposal.content.title }}</p>
      </div>
      <div class="proposal-modal__row mg-b8">
        <p class="proposal-modal__row-lbl fs-14 fs-wb">Description</p>
        <p class="proposal-modal__row-val">
          {{ proposal.content.description }}
        </p>
      </div>
      <div class="proposal-modal__row mg-b8">
        <p class="proposal-modal__row-lbl fs-14 fs-wb">Changes</p>
        <div
          v-for="(change, index) in proposal.content.changes"
          :key="index"
          class="proposal-modal__row-table-wrp fx-row mg-t4"
        >
          <span class="proposal-modal__row-table-idx fs-wb mg-r8">
            #{{ index + 1 }}
          </span>
          <div class="proposal-modal__row-table">
            <div
              v-for="(value, key) in change"
              :key="key"
              class="proposal-modal__row-colum"
            >
              <p class="proposal-modal__row-column-head fs-12 fs-wb">
                {{ key }}
              </p>
              <p class="proposal-modal__row-column-body">
                {{ value }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="proposal-modal__row mg-b8">
        <p class="proposal-modal__row-lbl fs-14 fs-wb">Time</p>
        <pre class="proposal-modal__row-val">
          Deposited: {{ $fCoin(proposal.totalDeposit[0]) }}
          Proposal created: {{
            $fDate(proposal.submitTime, 'dd-MM-yyyy, HH:mm')
          }}
          Deposit end: {{
            $fDate(proposal.depositEndTime, 'dd-MM-yyyy, HH:mm')
          }}
          Voting start: {{
            $fDate(proposal.votingStartTime, 'dd-MM-yyyy, HH:mm')
          }}
          Voting end: {{ $fDate(proposal.votingEndTime, 'dd-MM-yyyy, HH:mm') }}
        </pre>
      </div>
      <div class="proposal-modal__row mg-b8">
        <p class="proposal-modal__row-lbl fs-14 fs-wb">Status</p>
        <pre class="proposal-modal__row-val">
          Status: <strong>{{ $tProposalStatus(proposal.status) }}</strong>
          Tally: {{ $tTally(proposal.finalTallyResult) }}
          Your vote: Unknown
        </pre>
      </div>
    </template>
  </ModalBase>
</template>

<script lang="ts">
// TODO: min deposit, thresholds?
// TODO: my vote

import { defineComponent, ref } from 'vue'
import { DialogHandler, dialogs } from '@/helpers/dialogs'
import { preventIf } from '@/helpers/functions'
import ModalBase from '../ModalBase.vue'
import { Proposal } from '@provider/codec/cosmos/gov/v1beta1/gov'

const ProposalModal = defineComponent({
  props: ['proposal'],
  components: { ModalBase /*InputFile*/ },
  setup(props) {
    const proposal = props.proposal as Proposal
    if (!proposal?.proposalId) {
      throw new ReferenceError('Missing required arg: proposal')
    }

    const isLoading = ref(false)
    const onClose = preventIf(dialogs.getHandler('onClose'), isLoading)

    return {
      onClose,
    }
  },
})

export default ProposalModal
export function showProposalDialog(
  callbacks: {
    onClose?: DialogHandler
  },
  props: { proposal: Proposal }
): Promise<unknown | null> {
  return dialogs.show(ProposalModal, callbacks, { props })
}
</script>

<style scoped lang="scss">
.proposal-modal__row-table {
  display: inline-grid;
  grid: auto / auto-flow auto;
  justify-content: start;
  border: 1px solid var(--clr__text);
  width: auto;
}

.proposal-modal__row-colum {
  text-align: center;

  &:not(:last-child) {
    border-right: 1px solid var(--clr__text);
  }
}

.proposal-modal__row-column-head {
  padding: 0.4rem 0.8rem;
  border-bottom: 1px solid var(--clr__text);
  line-height: 1.2;
}

.proposal-modal__row-column-body {
  padding: 0.4rem 0.8rem;
  line-height: 1.2;
}
</style>

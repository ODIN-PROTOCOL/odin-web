<template>
  <ModalBase class="proposal-modal" @close="onClose()">
    <template #title>
      <h3>View proposal #{{ proposal.proposalId.toString() }}</h3>
    </template>

    <template #main>
      <div class="proposal-modal__section mg-b16">
        <p class="proposal-modal__section-lbl fs-14 fs-wb">Title</p>
        <p class="proposal-modal__section-val">{{ proposal.content.title }}</p>
      </div>
      <div class="proposal-modal__section mg-b16">
        <p class="proposal-modal__section-lbl fs-14 fs-wb">Description</p>
        <p class="proposal-modal__section-val">
          {{ proposal.content.description }}
        </p>
      </div>
      <div class="proposal-modal__section mg-b16">
        <p class="proposal-modal__section-lbl fs-14 fs-wb">Changes</p>
        <div
          v-for="(change, index) in proposal.content.changes"
          :key="index"
          class="proposal-modal__section-table-wrp fx-row mg-t4"
        >
          <span class="proposal-modal__section-table-idx fs-wb mg-r8">
            #{{ index + 1 }}
          </span>
          <div class="proposal-modal__section-table">
            <div
              v-for="(value, key) in change"
              :key="key"
              class="proposal-modal__section-colum"
            >
              <p class="proposal-modal__section-column-head fs-12 fs-wb">
                {{ key }}
              </p>
              <p class="proposal-modal__section-column-body">
                {{ value }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="proposal-modal__section mg-b16">
        <p class="proposal-modal__section-lbl fs-14 fs-wb">Details</p>
        <pre class="proposal-modal__section-val">
          Deposited: {{ $fCoin(proposal.totalDeposit[0]) }}
          Proposal created: {{ $fDate(proposal.submitTime) }}
          Deposit end: {{ $fDate(proposal.depositEndTime) }}
          Voting start: {{ $fDate(proposal.votingStartTime) }}
          Voting end: {{ $fDate(proposal.votingEndTime) }}
        </pre>
      </div>
      <div class="proposal-modal__section mg-b16">
        <p class="proposal-modal__section-lbl fs-14 fs-wb">Status</p>
        <pre class="proposal-modal__section-val">
          Status: <strong>{{ $tProposalStatus(proposal.status) }}</strong>
          Tally: <Tally :tally="tally || proposal.finalTallyResult" />
        </pre>
      </div>

      <ProposalModalDepositForm
        v-if="isDepositPeriod"
        :proposal="proposal"
        v-model:isLoading="isLoading"
        @submitted="onSubmit()"
      />
      <ProposalModalVoteForm
        v-if="isVotingPeriod"
        :proposal="proposal"
        v-model:isLoading="isLoading"
        @submitted="onSubmit()"
      />
    </template>
  </ModalBase>
</template>

<script lang="ts">
// TODO: min deposit, thresholds?

import { defineComponent, PropType, ref } from 'vue'
import { DialogHandler, dialogs } from '@/helpers/dialogs'
import { preventIf } from '@/helpers/functions'
import {
  ProposalStatus,
  TallyResult,
} from '@provider/codec/cosmos/gov/v1beta1/gov'
import { ProposalDecoded } from '@/helpers/proposalDecoders'
import ModalBase from '../ModalBase.vue'
import ProposalModalDepositForm from './ProposalModalDepositForm.vue'
import ProposalModalVoteForm from './ProposalModalVoteForm.vue'
import Tally from '@/components/Tally.vue'

const ProposalModal = defineComponent({
  props: {
    proposal: {
      type: Object as PropType<ProposalDecoded>,
      required: true,
    },
    tally: {
      type: Object as PropType<TallyResult>,
      default: null,
    },
  },
  components: {
    ModalBase,
    Tally,
    ProposalModalDepositForm,
    ProposalModalVoteForm,
  },
  setup(props) {
    const isLoading = ref(false)
    const isDepositPeriod = ref(
      props.proposal.status === ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD
    )
    const isVotingPeriod = ref(
      props.proposal.status === ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD
    )
    const onSubmit = dialogs.getHandler('onSubmit')
    const onClose = preventIf(dialogs.getHandler('onClose'), isLoading)

    return {
      isLoading,
      isDepositPeriod,
      isVotingPeriod,
      onSubmit,
      onClose,
    }
  },
})

export default ProposalModal
export function showProposalDialog(
  callbacks: {
    onSubmit?: DialogHandler
    onClose?: DialogHandler
  },
  props: { proposal: ProposalDecoded; tally?: TallyResult }
): Promise<unknown | null> {
  return dialogs.show(ProposalModal, callbacks, { props })
}
</script>

<style scoped lang="scss">
.proposal-modal__section-table {
  display: inline-grid;
  grid: auto / auto-flow auto;
  justify-content: start;
  border: 1px solid var(--clr__text);
  width: auto;
}

.proposal-modal__section-colum {
  text-align: center;

  &:not(:last-child) {
    border-right: 1px solid var(--clr__text);
  }
}

.proposal-modal__section-column-head {
  padding: 0.4rem 0.8rem;
  border-bottom: 1px solid var(--clr__text);
  line-height: 1.2;
}

.proposal-modal__section-column-body {
  padding: 0.4rem 0.8rem;
  line-height: 1.2;
}
</style>

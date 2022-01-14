<template>
  <div class="view-main">
    <div class="view-main__title-wrapper">
      <BackButton :text="'Governance'" />
      <h2 class="view-main__title">Proposal</h2>
      <span class="view-main__subtitle" v-if="proposal">
        {{ proposal.content.title }}
      </span>
      <button
        class="view-main__title-btn app-btn app-btn_small fx-sae"
        :disabled="
          !proposal ||
          proposal?.status !== ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD
        "
        @click="router.push({ name: 'Voting' })"
      >
        Vote
      </button>
    </div>

    <template v-if="proposal">
      <div class="info-table mg-b40">
        <div class="info-table__row">
          <span class="info-table__row-title">Proposer's account ID</span>
          <div class="info-table__row-value info-table__row-value_flex">
            <a
              class="info-table__row-link"
              :href="`${API_CONFIG.odinScan}/account/${proposal.proposerAddress}`"
            >
              {{ proposal.proposerAddress }}
            </a>
            <CopyButton :text="proposal.proposerAddress" />
          </div>
        </div>
        <div class="info-table__row">
          <span class="info-table__row-title">Description</span>
          <span class="info-table__row-value">
            {{ proposal.content.description }}
          </span>
        </div>
        <div class="info-table__row">
          <span class="info-table__row-title">Status</span>
          <StatusBlock
            :text="proposalStatusType[proposal.status].name"
            :status="proposalStatusType[proposal.status].status"
          />
        </div>
        <div class="info-table__row">
          <span class="info-table__row-title">"Support" tally</span>
          <Tally
            v-if="tally"
            class="app-table__cell-txt"
            :tally="tally"
            :onlyYes="true"
            :isShort="true"
            :isTitled="true"
          />
        </div>
      </div>
    </template>
    <template v-else>
      <span v-if="isLoading" class="view-main__subtitle">Loading...</span>
      <span v-else class="view-main__subtitle">Proposal not found</span>
    </template>

    <div class="view-main__mobile-activities">
      <button
        class="app-btn w-full"
        :disabled="
          !proposal ||
          proposal?.status !== ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD
        "
        @click="router.push({ name: 'Voting' })"
      >
        Vote
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { API_CONFIG } from '@/api/api-config'
import { callers } from '@/api/callers'
import {
  RouteLocationNormalizedLoaded,
  Router,
  useRoute,
  useRouter,
} from 'vue-router'
import { ProposalDecoded } from '@/helpers/proposalDecoders'
import { ProposalStatus } from '@provider/codec/cosmos/gov/v1beta1/gov'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleError } from '@/helpers/errors'
import { getTransformedProposals } from '@/helpers/proposalHelpers'
import { proposalStatusType } from '@/helpers/statusTypes'
import Tally from '@/components/Tally.vue'
import BackButton from '@/components/BackButton.vue'
import StatusBlock from '@/components/StatusBlock.vue'
import CopyButton from '@/components/CopyButton.vue'

export default defineComponent({
  components: { Tally, BackButton, StatusBlock, CopyButton },
  setup: function () {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const router: Router = useRouter()
    const route: RouteLocationNormalizedLoaded = useRoute()
    const proposal = ref()
    const tally = ref()

    const getProposal = async () => {
      lockLoading()
      try {
        const response = await callers.getProposal(String(route.params.id))
        const transformedProposals = await getTransformedProposals([
          response.proposal,
        ])

        proposal.value = transformedProposals[0]
        await getTally(proposal.value)
      } catch (error) {
        handleError(error as Error)
      }
      releaseLoading()
    }

    const getTally = async (proposal: ProposalDecoded) => {
      let _tally = null
      if (proposal.status === ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD) {
        _tally = await callers
          .getProposalTally(proposal.proposalId)
          .then((r) => r.tally)
          .catch(() => proposal.finalTallyResult)
      } else {
        _tally = proposal.finalTallyResult
      }

      tally.value = _tally
    }

    onMounted(async () => {
      await getProposal()
    })

    return {
      API_CONFIG,
      router,
      ProposalStatus,
      isLoading,
      proposalStatusType,
      proposal,
      tally,
    }
  },
})
</script>

<style lang="scss" scoped>
.view-main {
  &__title {
    margin: 0 1.6rem 0 2rem;
  }
}

@include respond-to(tablet) {
  .view-main {
    padding-bottom: 10rem;

    &__title {
      margin: 0.8rem 0 0.4rem 0;
    }

    &__title-btn {
      display: none;
    }
  }
}
</style>

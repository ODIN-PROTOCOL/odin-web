<template>
  <div class="view-main proposal">
    <div class="view-main__title-wrapper">
      <div class="view-main__title proposal__title-info">
        <BackButton :text="'Governance'" />
        <h2 class="view-main__title proposal__title">Proposal</h2>
        <span class="view-main__subtitle" v-if="proposal">
          {{ proposal.content.title }}
        </span>
      </div>
      <button
        class="proposal__title-btn app-btn app-btn--medium"
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
      <div class="info-table proposal__table mg-b32">
        <div v-if="proposal.proposerAddress" class="info-table__row">
          <span class="info-table__row-title proposal__table-row-title"
            >Proposer's account ID</span
          >
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
          <span class="info-table__row-title proposal__table-row-title"
            >Description</span
          >
          <span class="info-table__row-value">
            {{ proposal.content?.description }}
          </span>
        </div>
        <div class="info-table__row">
          <span class="info-table__row-title proposal__table-row-title"
            >Status</span
          >
          <StatusBlock
            :text="proposalStatusType[proposal.status].name"
            :status="proposalStatusType[proposal.status].status"
          />
        </div>
        <div class="info-table__row">
          <span class="info-table__row-title proposal__table-row-title"
            >"Support" tally</span
          >
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

      <h3 class="view-main__subtitle mg-b24">Details</h3>
      <div class="info-table mg-b32">
        <div class="info-table__row">
          <span class="info-table__row-title proposal__table-row-title"
            >Proposal created</span
          >
          <span class="info-table__row-value">
            {{ $fDate(proposal.submitTime) }}
          </span>
        </div>
        <div class="info-table__row">
          <span class="info-table__row-title proposal__table-row-title"
            >Voting start</span
          >
          <span class="info-table__row-value">
            {{ $fDate(proposal.votingStartTime) }}
          </span>
        </div>
        <div class="info-table__row">
          <span class="info-table__row-title proposal__table-row-title"
            >Voting end</span
          >
          <span class="info-table__row-value">
            {{ $fDate(proposal.votingEndTime) }}
          </span>
        </div>
        <div class="info-table__row">
          <span class="info-table__row-title proposal__table-row-title"
            >Deposited</span
          >
          <span class="info-table__row-value">
            {{ $fCoin(proposal.totalDeposit[0]) }}
          </span>
        </div>
      </div>
      <div v-if="proposal.content?.changes">
        <h3 class="view-main__subtitle mg-b24">Changes</h3>
        <div class="info-table mg-b32">
          <div
            v-for="(change, title) in proposal.content.changes[0]"
            :key="change"
            class="info-table__row"
          >
            <span class="info-table__row-title proposal__table-row-title">{{
              capitalizeFirstLetter(title)
            }}</span>
            <span class="info-table__row-value">
              {{ change }}
            </span>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="app-table__empty-stub">
        <p v-if="isLoading" class="empty mg-t32">Loading…</p>
        <p v-else class="empty mg-t32">No items yet</p>
      </div>
    </template>

    <div class="view-main__mobile-activities">
      <button
        class="app-btn w-full app-btn--medium"
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
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { getTransformedProposals } from '@/helpers/proposalHelpers'
import { proposalStatusType } from '@/helpers/statusTypes'
import Tally from '@/components/Tally.vue'
import BackButton from '@/components/BackButton.vue'
import StatusBlock from '@/components/StatusBlock.vue'
import CopyButton from '@/components/CopyButton.vue'
import { capitalizeFirstLetter } from '@/helpers/formatters'

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
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
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
      capitalizeFirstLetter,
    }
  },
})
</script>

<style lang="scss" scoped>
.proposal__title {
  margin: 0 1.6rem 0 2rem;
}
.proposal__title-info {
  display: flex;
  align-items: center;
}
@include respond-to(tablet) {
  .proposal {
    padding-bottom: 10rem;
  }
  .proposal__title {
    margin: 0.8rem 0 0.4rem 0;
  }
  .proposal__title-btn {
    display: none;
  }
  .proposal__table-row-title {
    display: inline-block;
    min-width: 15.4rem;
  }
  .proposal__title-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

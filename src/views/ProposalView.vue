<template>
  <div class="view-main proposal-view">
    <div class="view-main__title-wrapper">
      <div class="view-main__title proposal-view__title-info">
        <BackButton text="Governance" />
        <h2 class="view-main__title proposal-view__title">Proposal</h2>
        <span class="view-main__subtitle" v-if="proposal">
          {{ proposal.content.title }}
        </span>
      </div>
      <router-link
        v-if="proposal && !wallet.isEmpty"
        :to="{ name: $routes.voting }"
        custom
        v-slot="{ navigate }"
      >
        <button
          @click="navigate"
          @keypress.enter="navigate"
          class="proposal-view__title-btn app-btn app-btn--medium"
        >
          {{ voteBtnText }}
        </button>
      </router-link>
    </div>

    <template v-if="!isLoading">
      <template v-if="isLoadingError">
        <ui-loading-error-message
          message="Something went wrong"
          title="Try again!"
        />
      </template>
      <template v-else>
        <template v-if="proposal">
          <div class="info-table proposal-view__table mg-b32">
            <div v-if="proposal.proposerAddress" class="info-table__row">
              <span class="info-table__row-title proposal-view__table-row-title"
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
              <span class="info-table__row-title proposal-view__table-row-title"
                >Description</span
              >
              <Markdown
                class="info-table__row-value"
                :source="proposal.content?.description"
              />
            </div>
            <div class="info-table__row">
              <span class="info-table__row-title proposal-view__table-row-title"
                >Status</span
              >
              <StatusBlock
                :text="proposalStatusType[proposal.status].name"
                :status="proposalStatusType[proposal.status].status"
              />
            </div>
            <div class="info-table__row">
              <span class="info-table__row-title proposal-view__table-row-title"
                >"Support" tally</span
              >
              <Tally
                v-if="tally"
                class="app-table__cell-txt"
                :tally="tally"
                is-only-yes
                is-short
                is-titled
              />
            </div>
          </div>

          <h3 class="view-main__subtitle mg-b24">Details</h3>
          <div class="info-table mg-b32">
            <div class="info-table__row">
              <span class="info-table__row-title proposal-view__table-row-title"
                >Proposal created</span
              >
              <span class="info-table__row-value">
                {{ $fDate(proposal.submitTime) }}
              </span>
            </div>
            <div class="info-table__row">
              <span class="info-table__row-title proposal-view__table-row-title"
                >Voting start</span
              >
              <span class="info-table__row-value">
                {{ $fDate(proposal.votingStartTime) }}
              </span>
            </div>
            <div class="info-table__row">
              <span class="info-table__row-title proposal-view__table-row-title"
                >Voting end</span
              >
              <span class="info-table__row-value">
                {{ $fDate(proposal.votingEndTime) }}
              </span>
            </div>
            <div class="info-table__row">
              <span class="info-table__row-title proposal-view__table-row-title"
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
                <span
                  class="info-table__row-title proposal-view__table-row-title"
                  >{{ capitalizeFirstLetter(title) }}</span
                >
                <span class="info-table__row-value">
                  {{ change }}
                </span>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="app-table__empty-stub">
            <ui-no-data-message />
          </div>
        </template>
      </template>
    </template>

    <template v-else>
      <div class="app-table__empty-stub">
        <ui-loader positionCenter message="Loading" />
      </div>
    </template>

    <div class="view-main__mobile-activities">
      <router-link
        v-if="proposal && !wallet.isEmpty"
        :to="{ name: $routes.voting }"
        custom
        v-slot="{ navigate }"
      >
        <button
          @click="navigate"
          @keypress.enter="navigate"
          class="app-btn w-full app-btn--medium"
        >
          {{ voteBtnText }}
        </button>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { API_CONFIG } from '@/api/api-config'
import { callers } from '@/api/callers'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { ProposalDecoded } from '@/helpers/proposalDecoders'
import { PROPOSAL_STATUS } from '@/enums'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { getTransformedProposals } from '@/helpers/proposalHelpers'
import { proposalStatusType } from '@/helpers/statusTypes'
import { capitalizeFirstLetter } from '@/helpers/formatters'
import { wallet } from '@/api/wallet'
import {
  UiLoadingErrorMessage,
  UiLoader,
  UiNoDataMessage,
} from '@/components/ui'
import Tally from '@/components/Tally.vue'
import BackButton from '@/components/BackButton.vue'
import StatusBlock from '@/components/StatusBlock.vue'
import CopyButton from '@/components/CopyButton.vue'
import Markdown from 'vue3-markdown-it'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const route: RouteLocationNormalizedLoaded = useRoute()
const proposal = ref()
const tally = ref()
const voteBtnText = ref('Show result')
const isLoadingError = ref(false)

const getProposal = async () => {
  lockLoading()
  try {
    const response = await callers.getProposal(String(route.params.id))
    const transformedProposals = await getTransformedProposals([
      response.proposal,
    ])
    proposal.value = transformedProposals[0]
    if (proposal.value?.status === PROPOSAL_STATUS.votingPeriod) {
      voteBtnText.value = 'Vote'
    }
    await getTally(proposal.value)
  } catch (error) {
    isLoadingError.value = true
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

const getTally = async (proposal: ProposalDecoded) => {
  lockLoading()
  try {
    if (Number(proposal.status) === PROPOSAL_STATUS.votingPeriod) {
      tally.value = await callers
        .getProposalTally(proposal.proposalId)
        .then(r => r.tally)
        .catch(() => proposal.finalTallyResult)
    } else {
      tally.value = proposal.finalTallyResult
    }
  } catch (error) {
    isLoadingError.value = true
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

onMounted(async () => {
  await getProposal()
})
</script>

<style lang="scss" scoped>
.proposal-view__title {
  margin: 0 1.6rem 0 2rem;
}
.proposal-view__title-info {
  display: flex;
  align-items: center;
}
@include respond-to(tablet) {
  .proposal-view {
    padding-bottom: 10rem;
  }
  .proposal-view__title {
    margin: 0.8rem 0 0.4rem 0;
  }
  .proposal-view__title-btn {
    display: none;
  }
  .proposal-view__table-row-title {
    display: inline-block;
    min-width: 15.4rem;
  }
  .proposal-view__title-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

<template>
  <div class="app__main-view proposal-view">
    <div class="proposal-view__header">
      <div class="app__main-view-detail-container proposal-view__container">
        <div class="app__main-view-detail-back-icon">
          <BackButton />
        </div>
        <div class="app__main-view-detail-title-container">
          <h2 class="app__main-view-detail-title">Proposal</h2>
          <div class="app__main-view-detail-subtitle-container">
            <span v-if="proposal" class="app__main-view-detail-subtitle">
              {{ proposal.content.title }}
            </span>
          </div>
        </div>
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
        <div class="app-table__empty-stub">
          <ui-loading-error-message message="Not Found" title="404" />
        </div>
      </template>
      <template v-else>
        <template v-if="proposal">
          <div class="app-table proposal-view__table mg-b32">
            <div v-if="proposal.proposerAddress" class="app-table__row">
              <span
                class="app-table__cell app-table__cell--label proposal-view__table-row-title"
              >
                Proposer's account ID
              </span>
              <div class="app-table__cell">
                <TitledLink
                  :name="{
                    name: $routes.accountDetails,
                    params: { hash: proposal.proposerAddress },
                  }"
                  :text="proposal.proposerAddress"
                  class="app-table__cell-txt app-table__link"
                />
                <CopyButton :text="proposal.proposerAddress" />
              </div>
            </div>
            <div class="app-table__row">
              <span
                class="app-table__cell app-table__cell--label proposal-view__table-row-title"
              >
                Description
              </span>
              <div class="app-table__cell">
                <Markdown
                  class="info-table__row-value"
                  :source="proposal.content?.description"
                />
              </div>
            </div>
            <div class="app-table__row">
              <span
                class="app-table__cell app-table__cell--label proposal-view__table-row-title"
              >
                Status
              </span>
              <div class="app-table__cell">
                <Tag
                  :text="proposalStatusType[proposal.status].name"
                  :type="proposalStatusType[proposal.status].status"
                />
              </div>
            </div>
            <div class="app-table__row">
              <span
                class="app-table__cell app-table__cell--label proposal-view__table-row-title"
              >
                "Support" tally
              </span>
              <div class="app-table__cell">
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
          </div>

          <h3 class="view-main__subtitle mg-b24">Details</h3>
          <div class="app-table mg-b32">
            <div class="app-table__row">
              <span
                class="app-table__cell app-table__cell--label proposal-view__table-row-title"
              >
                Proposal created
              </span>
              <div class="app-table__cell">
                <span class="app-table__cell-date">
                  {{ $fDate(proposal.submitTime, 'dd/MM/yy') }}
                </span>
                <span class="app-table__cell-time">
                  {{ $fDate(proposal.submitTime, 'HH:mm') }}
                </span>
              </div>
            </div>
            <div class="app-table__row">
              <span
                class="app-table__cell app-table__cell--label proposal-view__table-row-title"
              >
                Voting start
              </span>
              <div class="app-table__cell">
                <span class="app-table__cell-date">
                  {{ $fDate(proposal.votingStartTime, 'dd/MM/yy') }}
                </span>
                <span class="app-table__cell-time">
                  {{ $fDate(proposal.votingStartTime, 'HH:mm') }}
                </span>
              </div>
            </div>
            <div class="app-table__row">
              <span
                class="app-table__cell app-table__cell--label proposal-view__table-row-title"
              >
                Voting end
              </span>
              <div class="app-table__cell">
                <span class="app-table__cell-date">
                  {{ $fDate(proposal.votingEndTime, 'dd/MM/yy') }}
                </span>
                <span class="app-table__cell-time">
                  {{ $fDate(proposal.votingEndTime, 'HH:mm') }}
                </span>
              </div>
            </div>
            <div class="app-table__row">
              <span
                class="app-table__cell app-table__cell--label proposal-view__table-row-title"
              >
                Deposited
              </span>
              <div class="app-table__cell app-table__cell-txt">
                <span :title="$fCoin(proposal.totalDeposit[0])">
                  {{ $fCoin(proposal.totalDeposit[0]) }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="proposal.content?.changes">
            <h3 class="view-main__subtitle mg-b24">Changes</h3>
            <div class="app-table mg-b32">
              <div
                v-for="(change, title) in proposal.content.changes[0]"
                :key="change"
                class="app-table__row"
              >
                <span
                  class="app-table__cell app-table__cell--label proposal-view__table-row-title"
                >
                  {{ capitalizeFirstLetter(title) }}
                </span>
                <div class="app-table__cell">
                  <span class="app-table__cell-txt">{{ change }}</span>
                </div>
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
import CopyButton from '@/components/CopyButton.vue'
import Tag from '@/components/Tag.vue'
import Markdown from 'vue3-markdown-it'
import TitledLink from '@/components/TitledLink.vue'

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

.proposal-view__title-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.proposal-view__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4rem;
}

.proposal-view__container {
  margin-bottom: 0;
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

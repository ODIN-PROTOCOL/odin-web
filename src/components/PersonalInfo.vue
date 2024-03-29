<template>
  <div class="personal-info mg-b40">
    <div class="personal-info__card card-frame">
      <h3 class="personal-info__card-title">Your address</h3>
      <div
        class="personal-info__card-address app-table__cell-txt"
        :title="accountAddress"
      >
        {{ accountAddress }}
      </div>
      <div class="personal-info__card-activities">
        <button
          class="personal-info__share-btn app-btn app-btn--small"
          @click="receive()"
        >
          <ShareIcon class="personal-info__share-icon" />
          Share
        </button>
        <CopyButtonWithText
          class="personal-info__copy-button-with-text"
          text="Copy address"
          scheme="no-border"
          :value="accountAddress"
        />
      </div>
    </div>
    <div class="personal-info__card card-frame">
      <div class="personal-info__card-title-wrapper">
        <h2 class="personal-info__card-title">Balance</h2>
        <div class="personal-info__card-btn-wrapper">
          <a class="personal-info__link-scan" :href="accountLink"
            >Go to account explorer
          </a>
          <a
            class="personal-info__link-scan personal-info__link-scan--mobile"
            :href="accountLink"
            >Account explorer
          </a>
          <button
            class="personal-info__send-btn app-btn app-btn--small"
            @click="send()"
            :disabled="isEmptyBalance"
          >
            Send
          </button>
        </div>
      </div>
      <div class="personal-info__card-balance">
        <div class="personal-info__card-balance-row">
          <span class="personal-info__card-balance-row-title">ODIN</span>
          <div class="personal-info__card-balance-row-value-wrapper">
            <span
              class="personal-info__card-balance-row-value app-table__cell-txt"
              :title="$convertLokiToOdin(lokiCoins.amount)"
            >
              {{ $convertLokiToOdin(lokiCoins.amount, { onlyNumber: true }) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { COINS_LIST } from '@/api/api-config'
import { wallet } from '@/api/wallet'
import { usePoll } from '@/composables/usePoll'
import { useBalances } from '@/composables/useBalances'
import { ShareFormModal, SendFormModal } from '@/components/modals'
import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import { ShareIcon } from '@/components/icons'
import CopyButtonWithText from '@/components/CopyButtonWithText.vue'

const accountAddress = wallet.account.address
const validatorPrefix = 'odinvaloper'

const accountLink = computed(() => {
  if (accountAddress.includes(validatorPrefix)) {
    return `/validators/${accountAddress}`
  } else {
    return `/accounts/${accountAddress}`
  }
})

const {
  coins: [lokiCoins],
  load: loadBalances,
} = useBalances([COINS_LIST.LOKI])

const lokiPoll = usePoll(loadBalances, 5000)

const isEmptyBalance = computed(() => {
  return lokiCoins.value && !Number(lokiCoins.value.amount)
})

const receive = async () => {
  await showDialogHandler(ShareFormModal)
}

const send = async () => {
  await showDialogHandler(
    SendFormModal,
    {},
    {
      balance: [lokiCoins.value],
    },
  )
}

onMounted(async () => {
  lokiPoll.start()
})

onUnmounted(() => {
  lokiPoll.stop()
})
</script>

<style lang="scss" scoped>
.personal-info {
  display: grid;
  grid: auto/ minmax(10rem, 0.5fr) minmax(10rem, 0.5fr);
  gap: 2.4rem;
  font-size: 2.4rem;
  line-height: 3.2rem;
  font-weight: 400;
}

.personal-info__card-btn-wrapper {
  display: flex;
  align-items: center;
  gap: 1.6rem;
}

.personal-info__link-scan {
  text-decoration-line: underline;
  text-align: center;
  color: var(--clr__action);
  font-size: 1.4rem;
  line-height: 2rem;

  &--mobile {
    display: none;
  }
}

.personal-info__card {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.personal-info__card-title {
  display: inline-block;
  font-size: 2.4rem;
  font-weight: 400;
  padding-right: 0.8rem;
  margin-bottom: 3.2rem;
}

.personal-info__card-balance {
  display: flex;
  justify-content: center;
  align-items: center;
}

.personal-info__card-balance-row {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 10rem;
  &:not(:last-child) {
    border-right: 0.1rem solid var(--clr__input-border);
    margin-right: 2rem;
  }
}

.personal-info__card-balance-row-title {
  font-size: 1.6rem;
}

.personal-info__card-balance-row-value-wrapper {
  display: flex;
  flex-direction: column;
  position: relative;
}

.personal-info__card-balance-row-value {
  width: 100%;
  font-weight: 600;
}

.personal-info__card-activities {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  gap: 2.4rem;
}

.personal-info__card-title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.personal-info__card-address {
  margin-bottom: 2rem;
  font-size: 1.6rem;
  @include ellipsis();
}

.personal-info__copy-button-with-text {
  align-items: flex-start;
}

.personal-info__share-btn {
  width: 8.9rem;
  height: 3.2rem;
  padding: 0.6rem 0;
}

.personal-info__send-btn {
  width: 6.5rem;
  height: 3.2rem;
}

.personal-info__share-icon {
  margin-right: 0.8rem;
}

@include respond-to(tablet) {
  .personal-info {
    display: flex;
    flex-direction: column;
  }

  .personal-info__card {
    width: 100%;
  }

  .personal-info__card-balance-row {
    padding-left: 0.4rem;
  }

  .personal-info__link-scan {
    display: none;

    &--mobile {
      display: inline-block;
    }
  }
}

@include respond-to(small) {
  .personal-info__card {
    padding: 2.2rem;
  }

  .personal-info__card-btn-wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
}
</style>

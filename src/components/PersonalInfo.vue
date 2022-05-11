<template>
  <div class="personal-info mg-b40">
    <div class="personal-info__card">
      <h3 class="personal-info__card-title">Your address</h3>
      <div
        class="personal-info__card-address app-table__cell-txt"
        :title="accountAddress"
      >
        {{ accountAddress }}
      </div>
      <div class="personal-info__card-activities">
        <button class="app-btn app-btn_small" @click="receive()">
          <ShareIcon />
          Share
        </button>
        <CopyButtonWithText
          class="personal-info__copy-button-with-text"
          text="Copy address"
          :scheme="SCHEMES.noBorder"
          :value="accountAddress"
        />
      </div>
    </div>
    <div class="personal-info__card">
      <div class="personal-info__card-title-wrapper">
        <h2 class="personal-info__card-title">Balance</h2>
        <button
          class="app-btn app-btn_small"
          @click="send()"
          :disabled="isEmptyBalance"
        >
          Send
        </button>
      </div>
      <div class="personal-info__card-balance">
        <div class="personal-info__card-balance-row">
          <span class="personal-info__card-balance-row-title">ODIN</span>
          <div class="personal-info__card-balance-row-value-wrapper">
            <a
              class="personal-info__card-balance-row-value app-table__cell-txt app-table__link"
              :title="$convertLokiToOdin(lokiCoins.amount)"
              :href="accountLink"
            >
              {{ $convertLokiToOdin(lokiCoins.amount) }}
            </a>
            <span class="personal-info__tooltip">
              Switching to an account explorer
            </span>
          </div>
        </div>
        <div class="personal-info__card-balance-row">
          <span class="personal-info__card-balance-row-title">GEO</span>
          <div class="personal-info__card-balance-row-value-wrapper">
            <a
              class="personal-info__card-balance-row-value app-table__cell-txt app-table__link"
              :href="accountLink"
              :title="0"
            >
              {{ 0 }}
            </a>
            <span class="personal-info__tooltip">
              Switching to an account explorer
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted } from 'vue'
import { API_CONFIG } from '@/api/api-config'

import { COINS_LIST } from '@/api/api-config'
import { wallet } from '@/api/wallet'
import { usePoll } from '@/composables/usePoll'
import { useBalances } from '@/composables/useBalances'

import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import SendFormModal from '@/components/modals/SendFormModal.vue'
import ShareFormModal from '@/components/modals/ShareFormModal.vue'

import CopyButtonWithText, {
  SCHEMES,
} from '@/components/CopyButtonWithText.vue'
import ShareIcon from '@/components/icons/ShareIcon.vue'

export default defineComponent({
  components: { ShareIcon, CopyButtonWithText },
  setup: function () {
    const accountAddress = wallet.account.address
    const accountLink = computed(() => {
      if (accountAddress.includes('odinvaloper')) {
        return `${API_CONFIG.odinScan}/validators/${accountAddress}`
      } else {
        return `${API_CONFIG.odinScan}/account/${accountAddress}`
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
        }
      )
    }

    onMounted(async () => {
      lokiPoll.start()
    })

    onUnmounted(() => {
      lokiPoll.stop()
    })

    return {
      API_CONFIG,
      lokiCoins,
      receive,
      send,
      isEmptyBalance,
      accountAddress,
      accountLink,
      SCHEMES,
    }
  },
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
.personal-info__card {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 3.2rem;
  border: 0.1rem solid var(--clr__wallet-info-border);
  box-shadow: 0 0.4rem 0.8rem var(--clr__wallet-info-box-shadow);
  border-radius: 0.8rem;
}
.personal-info__card-title {
  display: inline-block;
  font-size: 2.4rem;
  font-weight: 400;
  margin-bottom: 3.2rem;
}
.personal-info__card-balance {
  display: flex;
  justify-content: center;
  align-items: center;
  //   height: 100%;
}
.personal-info__card-balance-row {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1.6rem;
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
  max-width: 200px;
  position: relative;
  &:hover {
    .personal-info__tooltip {
      display: block;
    }
  }
}
.personal-info__card-balance-row-value {
  width: 100%;
  font-weight: 600;
  cursor: pointer;
  color: var(--clr__text);
  &:hover {
    text-decoration-line: underline;
    color: var(--clr__action);
  }
}
.personal-info__card-activities {
  display: flex;
  align-items: center;
  gap: 2.4rem;
}
.personal-info__tooltip {
  display: none;
  position: absolute;
  background: var(--clr__tooltip-bg);
  border-radius: 0.8rem;
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 1.6rem;
  color: var(--clr__tooltip-text);
  top: 125%;
  padding: 1rem 2.4rem;
  left: -10rem;
  width: 27rem;
  &:before {
    content: '';
    display: block;
    width: 0.6rem;
    height: 0.6rem;
    position: absolute;
    top: -0.3rem;
    left: 40%;
    transform: translateX(-50%) rotate(45deg);
    background: var(--clr__tooltip-bg);
  }
}
.personal-info__card-title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.personal-info__card-address {
  color: var(--clr__text-muted);
  margin-bottom: 2rem;
}
.personal-info__copy-button-with-text {
  align-items: flex-start;
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
  .personal-info__tooltip {
    left: -3rem;
    width: 13.5rem;
    &:before {
      left: 25%;
    }
  }
}
@include respond-to(small) {
  .personal-info__card {
    padding: 2.2rem;
  }
}
</style>

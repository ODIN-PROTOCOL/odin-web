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
              class="personal-info__card-balance-row-value app-table__link"
              :title="$convertLokiToOdin(lokiCoins.amount)"
              :href="accountLink"
            >
              {{ $convertLokiToOdin(lokiCoins.amount) }}
              <span class="wallet__tooltip wallet__tooltip--balance">
                Switching to an account explorer
              </span>
            </a>
          </div>
        </div>
        <div class="personal-info__card-balance-row">
          <span class="personal-info__card-balance-row-title">GEO</span>
          <div class="app-table__cell-txt app-table__link">
            <a
              class="personal-info__card-balance-row-value app-table__cell-txt app-table__link"
              :href="accountLink"
              :title="0"
            >
              {{ 0 }}
              <span class="wallet__tooltip wallet__tooltip--balance">
                Switching to an account explorer
              </span>
            </a>
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
  height: 100%;
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
  line-height: 2.4rem;
}
.personal-info__card-balance-row-value-wrapper {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.personal-info__card-balance-row-value {
  font-weight: 600;
  font-size: 2.4rem;
  line-height: 3.2rem;
  position: relative;
  cursor: pointer;
  color: var(--clr__text);
  &:hover {
    .wallet__tooltip {
      display: block;
    }
    text-decoration-line: underline;
    color: var(--clr__action);
  }
}
.personal-info__card-activities {
  display: flex;
  align-items: center;
  gap: 2.4rem;
}
.wallet__tooltip {
  display: none;
  position: absolute;
  bottom: 130%;
  left: -0.7rem;
  width: 20rem;
  padding: 1.2rem 2.4rem;
  background: var(--clr__tooltip-bg);
  border-radius: 0.8rem;
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 1.6rem;
  color: var(--clr__tooltip-text);
  &:before {
    content: '';
    display: block;
    width: 0.6rem;
    height: 0.6rem;
    position: absolute;
    bottom: -0.3rem;
    left: 8%;
    transform: translateX(-50%) rotate(45deg);
    background: var(--clr__tooltip-bg);
  }
  &--balance {
    top: 130%;
    right: -0.7rem;
    width: 27.5rem;
    height: 4.5rem;
    &:before {
      top: -0.3rem;
      left: 8%;
      transform: translateX(-50%) rotate(45deg);
    }
  }
}
.personal-info__card-title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.personal-info__card-address {
  color: var(--clr__text-muted);
  font-size: 2.4rem;
  line-height: 3.2rem;
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
}
@include respond-to(small) {
  .personal-info__card {
    padding: 2.2rem;
  }
}
</style>

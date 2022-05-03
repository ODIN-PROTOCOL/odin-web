<template>
  <div class="wallet view-main">
    <div class="wallet__title-wrapper view-main__title-wrapper">
      <h2 class="wallet__title view-main__title">Wallet</h2>
    </div>

    <div class="wallet__info mg-b40">
      <div class="wallet__info-card">
        <span class="wallet__info-card-title">Balance</span>
        <div class="wallet__info-card-balance mg-b40">
          <div class="wallet__info-card-row">
            <span class="wallet__info-card-row-title">ODIN</span>
            <span
              class="wallet__info-card-row-value"
              :title="
                $convertLokiToOdin(lokiCoins.amount, {
                  withDenom: true,
                  withPrecise: true,
                  forTitle: true,
                })
              "
            >
              {{ $convertLokiToOdin(lokiCoins.amount, { withDenom: true }) }}
            </span>
          </div>
        </div>
        <div
          class="wallet__info-card-activities wallet__info-card-activities--full"
        >
          <button
            class="app-btn app-btn_outlined app-btn_small"
            @click="receive()"
          >
            Receive
          </button>
          <button
            class="app-btn app-btn_small"
            @click="send()"
            :disabled="isEmptyBalance"
          >
            Send
          </button>
        </div>
      </div>
    </div>

    <div class="wallet__subtitle view-main__subtitle mg-b24">
      <div class="wallet__tx-info">
        <img src="~@/assets/icons/info.svg" alt="info" />
        <span class="wallet__tooltip">
          Based on last 100 transactions in system
        </span>
      </div>
      <span class="view-main__subtitle-item">Transaction list</span>
    </div>
    <div class="app-table">
      <div class="app-table__head">
        <span>Transaction hash</span>
        <span>Type</span>
        <span>Block</span>
        <span>Date and time</span>
        <span>Sender</span>
        <span>Receiver</span>
        <span>Amount</span>
        <span>Transaction Fee</span>
      </div>
      <div class="app-table__body">
        <template v-if="transactions?.length">
          <div
            v-for="item in filteredTransactions"
            :key="item.hash"
            class="app-table__row"
          >
            <div class="app-table__cell">
              <span class="app-table__title">Transaction hash</span>
              <a
                class="app-table__cell-txt app-table__link"
                :href="`${API_CONFIG.odinScan}/transactions/${item.hash}`"
              >
                {{ `0x${item.hash}` }}
              </a>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Type</span>
              <span>{{ item.type }}</span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Block</span>
              <a
                class="app-table__cell-txt app-table__link"
                :href="`${API_CONFIG.odinScan}/blocks/${item.block}`"
              >
                {{ item.block.toString() }}
              </a>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Date and time</span>
              <span>{{ $fDate(item.time) }}</span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Sender</span>
              <a
                class="app-table__cell-txt app-table__link"
                :href="`${API_CONFIG.odinScan}/${generateAddrLink(
                  item.sender
                )}`"
              >
                {{ item.sender }}
              </a>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Receiver</span>
              <a
                class="app-table__cell-txt app-table__link"
                :href="`${API_CONFIG.odinScan}/${generateAddrLink(
                  item.receiver
                )}`"
              >
                {{ item.receiver }}
              </a>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Amount</span>
              <span class="app-table__cell-txt" :title="item.amount">
                {{ item.amount }}
              </span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Transaction Fee</span>
              <span>{{ item.fee }}</span>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="app-table__empty-stub">
            <p v-if="isLoading">Loading…</p>
            <p v-else>No items yet</p>
          </div>
        </template>
      </div>
    </div>

    <template v-if="transactionsCount > ITEMS_PER_PAGE">
      <AppPagination
        class="mg-t32 mg-b32"
        v-model="currentPage"
        :pages="totalPages"
        @update:modelValue="paginationHandler"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref } from 'vue'
import { API_CONFIG } from '@/api/api-config'
import { callers } from '@/api/callers'
import { COINS_LIST } from '@/api/api-config'
import { wallet } from '@/api/wallet'
import { prepareTransaction } from '@/helpers/helpers'
import { usePoll } from '@/composables/usePoll'
import { useBalances } from '@/composables/useBalances'
import { adjustedData } from '@/helpers/Types'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleError } from '@/helpers/errors'
import AppPagination from '@/components/AppPagination/AppPagination.vue'

import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import SendFormModal from '@/components/modals/SendFormModal.vue'
import ReceiveFormModal from '@/components/modals/ReceiveFormModal.vue'
import WalletExchangeFormModal from '@/components/modals/WalletExchangeFormModal.vue'

export default defineComponent({
  components: { AppPagination },
  setup: function () {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const ITEMS_PER_PAGE = 50
    const currentPage = ref(1)
    const totalPages = ref()
    const transactionsCount = ref(0)
    const transactions = ref()
    const filteredTransactions = ref()

    const getTransactions = async () => {
      lockLoading()
      try {
        const { txs } = await callers.getTxSearch({
          query: `transfer.recipient='${wallet.account.address}' AND transfer.sender='${wallet.account.address}'`,
          per_page: 100,
          page: currentPage.value,
          order_by: 'desc',
        })
        const preparedTxs = await prepareTransaction(txs)

        transactions.value = filterNecessaryTxs(preparedTxs)
        transactionsCount.value = transactions.value.length
        totalPages.value = Math.ceil(transactionsCount.value / ITEMS_PER_PAGE)
        filterTransactions(currentPage.value)
      } catch (error) {
        handleError(error as Error)
      }
      releaseLoading()
    }

    // temporary filtering until the backend filtering is ready
    const filterNecessaryTxs = (txs: adjustedData[]) => {
      return txs.filter((item) => {
        return (
          (item.sender === wallet.account.address ||
            item.receiver === wallet.account.address) &&
          (item.type === 'Send' ||
            item.type === 'Delegate' ||
            item.type === 'Withdraw delegator reward' ||
            item.type === 'Withdraw')
        )
      })
    }

    const {
      coins: [lokiCoins],
      load: loadBalances,
    } = useBalances([COINS_LIST.LOKI])
    const lokiPoll = usePoll(loadBalances, 5000)
    const isEmptyBalance = computed(() => {
      return lokiCoins.value && !Number(lokiCoins.value.amount)
    })

    const filterTransactions = (newPage: number) => {
      let tempArr = transactions.value

      if (newPage === 1) {
        filteredTransactions.value = tempArr.slice(0, newPage * ITEMS_PER_PAGE)
      } else {
        filteredTransactions.value = tempArr.slice(
          (newPage - 1) * ITEMS_PER_PAGE,
          (newPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        )
      }
      currentPage.value = newPage
    }

    const paginationHandler = (num: number) => {
      currentPage.value = num
      filterTransactions(num)
    }

    const generateAddrLink = (addr: string) => {
      if (addr.includes('odinvaloper')) {
        return `validators/${addr}`
      } else {
        return `account/${addr}`
      }
    }

    const receive = async () => {
      await showDialogHandler(ReceiveFormModal)
    }

    const exchange = async () => {
      await showDialogHandler(WalletExchangeFormModal)
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
      await getTransactions()
    })

    onUnmounted(() => {
      lokiPoll.stop()
    })

    return {
      API_CONFIG,
      ITEMS_PER_PAGE,
      totalPages,
      currentPage,
      transactionsCount,
      transactions,
      filteredTransactions,
      isLoading,
      lokiCoins,
      paginationHandler,
      generateAddrLink,
      receive,
      exchange,
      send,
      isEmptyBalance,
    }
  },
})
</script>

<style lang="scss" scoped>
.wallet__info {
  display: flex;
  flex-direction: row;
  gap: 2.4rem;
}
.wallet__info-card {
  display: flex;
  flex-direction: column;
  width: 39rem;
  padding: 3.2rem 2.4rem;
  border: 0.1rem solid var(--clr__action);
  border-radius: 0.8rem;
}
.wallet__info-card-title {
  display: inline-block;
  font-size: 2.4rem;
  margin-bottom: 4rem;
}
.wallet__info-card-balance {
  & > *:not(:last-child) {
    margin-bottom: 2.4rem;
  }
}
.wallet__info-card-row-title {
  display: inline-block;
  min-width: 10rem;
}
.wallet__info-card-row-value {
  font-weight: 600;
}
.wallet__info-card-activities {
  display: flex;
  margin-top: auto;
}
.wallet__info-card-activities--full {
  gap: 2.4rem;
  & > * {
    flex: 1;
  }
}
.wallet__subtitle {
  display: flex;
  align-items: center;
}
.wallet__tx-info {
  display: flex;
  align-items: center;
  height: 2.3rem;
  position: relative;
  cursor: pointer;
  margin-right: 0.9rem;
  &:hover {
    .wallet__tooltip {
      display: block;
    }
  }
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
}
@include respond-to(tablet) {
  .wallet__info-card {
    width: 100%;
  }
  .wallet__info {
    flex-direction: column;
  }
}
</style>

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
    <div class="wallet__subtitle-wrapper">
      <div class="wallet__subtitle view-main__subtitle mg-b32">
        <div class="wallet__tx-info">
          <img src="~@/assets/icons/info.svg" alt="info" />
          <span class="wallet__tooltip">
            Based on last transactions in system
          </span>
        </div>
        <span class="view-main__subtitle-item">Transaction list</span>
      </div>
      <div class="wallet__selection">
        <div class="wallet__selection-item">
          <span class="wallet__selection-item-title">Filter</span>
          <VuePicker
            class="wallet__vue-picker _vue-picker"
            name="filter"
            v-model="sortingValue"
            :isDisabled="isLoading"
          >
            <template #dropdownInner>
              <div class="_vue-picker__dropdown-custom">
                <VuePickerOption
                  v-for="{ text, value } in sortingTypeTx"
                  :key="text"
                  :value="value"
                  :text="text"
                >
                  {{ text }}
                </VuePickerOption>
              </div>
            </template>
          </VuePicker>
        </div>
      </div>
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
          <TxLine
            v-for="(item, index) in transactions"
            :key="index"
            :tx="item.attributes"
          />
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
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue'
import { API_CONFIG } from '@/api/api-config'
import { callers } from '@/api/callers'
import { COINS_LIST } from '@/api/api-config'
import { wallet } from '@/api/wallet'
import { usePoll } from '@/composables/usePoll'
import { useBalances } from '@/composables/useBalances'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleError } from '@/helpers/errors'
import AppPagination from '@/components/AppPagination/AppPagination.vue'

import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import SendFormModal from '@/components/modals/SendFormModal.vue'
import ReceiveFormModal from '@/components/modals/ReceiveFormModal.vue'
import TxLine from '@/components/TxLine.vue'
import { sortingTypeTx, TYPE_TX_SORT } from '@/helpers/sortingHelpers'
export default defineComponent({
  components: { AppPagination, TxLine },
  setup: function () {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const ITEMS_PER_PAGE = 50
    const currentPage = ref(1)
    const totalPages = ref()
    const transactionsCount = ref(0)
    const transactions = ref()
    const sortingValue = ref(TYPE_TX_SORT.all)

    const getTransactions = async () => {
      lockLoading()
      try {
        const tx = await callers
          .getAccountTx(
            currentPage.value - 1,
            50,
            wallet.account.address,
            'desc',
            sortingValue.value
          )
          .then((resp) => resp.json())
        transactions.value = tx.data
        transactionsCount.value = tx.total_count
        totalPages.value = Math.ceil(transactionsCount.value / ITEMS_PER_PAGE)
      } catch (error) {
        handleError(error as Error)
      }
      releaseLoading()
    }

    const {
      coins: [lokiCoins],
      load: loadBalances,
    } = useBalances([COINS_LIST.LOKI])
    const lokiPoll = usePoll(loadBalances, 5000)
    const isEmptyBalance = computed(() => {
      return lokiCoins.value && !Number(lokiCoins.value.amount)
    })

    const paginationHandler = async (num: number) => {
      currentPage.value = num
      await getTransactions()
    }
    const receive = async () => {
      await showDialogHandler(ReceiveFormModal)
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
    watch([sortingValue], async () => {
      currentPage.value = 1
      await getTransactions()
    })

    return {
      API_CONFIG,
      ITEMS_PER_PAGE,
      totalPages,
      currentPage,
      transactionsCount,
      transactions,

      isLoading,
      lokiCoins,
      paginationHandler,
      receive,
      send,
      isEmptyBalance,
      sortingTypeTx,
      sortingValue,
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
.wallet__subtitle-wrapper {
  display: flex;
  justify-content: space-between;
}
.wallet__selection {
  display: flex;
  justify-content: flex-end;
}
.wallet__selection-item-title {
  font-size: 1.4rem;
  font-weight: 300;
  margin-right: 0.4rem;
}
@include respond-to(tablet) {
  .wallet__info-card {
    width: 100%;
  }
  .wallet__info {
    flex-direction: column;
  }
  .wallet__selection {
    width: 100%;
    flex-direction: column;
    margin-bottom: 0rem;
  }
  .wallet__subtitle-wrapper {
    flex-direction: column;
  }
  .wallet__selection-item {
    display: flex;
    flex-direction: column;
  }

  .wallet__selection-item-title {
    margin: 0 0 0.4rem;
  }
  .wallet__vue-picker {
    width: 100%;
  }
}
</style>

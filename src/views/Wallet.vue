<template>
  <div class="wallet view-main">
    <div class="wallet__title-wrapper view-main__title-wrapper">
      <h1 class="wallet__title view-main__title">Wallet</h1>
    </div>
    <PersonalInfo />
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
          <SkeletonTable v-if="isLoading" :header-titles="headerTitles" />
          <div v-else class="app-table__empty-stub">
            <p class="empty mg-t32">No items yet</p>
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
import { defineComponent, onMounted, ref, watch } from 'vue'
import { API_CONFIG } from '@/api/api-config'
import { callers } from '@/api/callers'
import { wallet } from '@/api/wallet'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import TxLine from '@/components/TxLine.vue'
import PersonalInfo from '@/components/PersonalInfo.vue'
import { sortingTypeTx, TYPE_TX_SORT } from '@/helpers/sortingHelpers'
import SkeletonTable from '@/components/SkeletonTable.vue'
import { Router, useRouter } from 'vue-router'
import { setPage } from '@/router'
export default defineComponent({
  components: {
    AppPagination,
    TxLine,
    PersonalInfo,
    SkeletonTable,
  },
  setup: function () {
    const router: Router = useRouter()
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const ITEMS_PER_PAGE = 50
    const currentPage = ref(1)
    const totalPages = ref(1)
    const transactionsCount = ref(0)
    const transactions = ref()
    const sortingValue = ref(TYPE_TX_SORT.all)
    const headerTitles = [
      { title: 'Transaction hash' },
      { title: 'Type' },
      { title: 'Block' },
      { title: 'Date and time' },
      { title: 'Sender' },
      { title: 'Receiver' },
      { title: 'Amount' },
      { title: 'Transaction Fee' },
    ]
    const getTransactions = async () => {
      lockLoading()
      try {
        transactions.value = []
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
        if (
          totalPages.value < currentPage.value &&
          transactionsCount.value > 0
        ) {
          currentPage.value = 1
          setPage(currentPage.value)
          getTransactions()
        }
      } catch (error) {
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
      }
      releaseLoading()
    }

    const paginationHandler = async (num: number) => {
      currentPage.value = num
      setPage(currentPage.value)
      await getTransactions()
    }

    onMounted(async () => {
      if (
        router.currentRoute.value.query.page &&
        Number(router.currentRoute.value.query.page) > 1
      ) {
        currentPage.value = Number(router.currentRoute.value.query.page)
      } else {
        setPage(currentPage.value)
      }
      await getTransactions()
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
      paginationHandler,
      sortingTypeTx,
      sortingValue,
      headerTitles,
    }
  },
})
</script>

<style lang="scss" scoped>
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

<template>
  <div class="app__main-view accounts-item">
    <div class="app__main-view-detail-container">
      <div class="app__main-view-detail-back-icon">
        <BackButton />
      </div>
      <div class="app__main-view-detail-title-container">
        <h2 class="app__main-view-detail-title">Account</h2>
        <div
          v-if="!isLoadingError"
          class="app__main-view-detail-subtitle-container"
        >
          <span class="app__main-view-detail-subtitle">
            {{ route.params.hash }}
          </span>
          <CopyButton class="mg-l8" :text="String(route.params.hash)" />
        </div>
      </div>
    </div>

    <template v-if="isLoadingError">
      <div class="app-table__empty-stub">
        <ui-loading-error-message message="Not Found" title="404" />
      </div>
    </template>
    <template v-else>
      <AccountInfo
        :address="String(route.params.hash)"
        :geo-balance="geoBalance"
        :odin-balance="odinBalance"
        :doki-balance="dokiBalance"
        :myrk-balance="myrkBalance"
      />
      <div class="accounts-item__subtitle-line">
        <div class="accounts-item__subtitle app__main-view-subtitle mg-b32">
          <InfoIcon message="Based on last transactions in system" />
          <span class="accounts-item__subtitle-text">Transactions</span>
        </div>
        <div class="accounts-item__selection">
          <div class="accounts-item__selection-item">
            <VuePicker
              class="accounts-item__vue-picker _vue-picker"
              name="filter"
              v-model="sortingValue"
              :is-disabled="isLoading"
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

      <div v-if="transactions" class="app-table">
        <div class="app-table__head accounts-item__head">
          <span v-for="(item, index) in headerTitles" :key="index">
            {{ item.title }}
          </span>
        </div>
        <div class="app-table__body">
          <template v-if="transactions?.length">
            <TxLine
              v-for="(item, index) in transactions"
              :key="index"
              :tx="item"
            />
          </template>
          <template v-else>
            <SkeletonTable
              v-if="isLoading"
              :header-titles="headerTitles"
              table-size="10"
              class-string="accounts-item__table-row"
            />
            <div v-else class="app-table__empty-stub">
              <ui-no-data-message />
            </div>
          </template>
        </div>
      </div>
      <AppPagination
        v-if="totalTxCount > ITEMS_PER_PAGE"
        class="mg-t32"
        v-model="currentPage"
        :pages="totalPages"
        @update:modelValue="updateHandler"
      />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { callers } from '@/api/callers'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { Bech32 } from '@cosmjs/encoding'
import { big } from '@/helpers/bigMath'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import {
  prepareTransaction,
  sortingTypeTx,
  TYPE_TX_SORT,
} from '@/helpers/helpers'
import { UiLoadingErrorMessage, UiNoDataMessage } from '@/components/ui'
import BackButton from '@/components/BackButton.vue'
import CopyButton from '@/components/CopyButton.vue'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import TxLine from '@/components/TxLine.vue'
import AccountInfo from '@/components/AccountInfo.vue'
import SkeletonTable from '@/components/SkeletonTable.vue'
import InfoIcon from '@/components/icons/InfoIcon.vue'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const route: RouteLocationNormalizedLoaded = useRoute()

const isLoadingError = ref(false)
const geoBalance = ref('0.0')
const odinBalance = ref('0.0')
const dokiBalance = ref('0.0')
const myrkBalance = ref('0.0')
const transactions = ref()
const totalTxCount = ref(0)
const currentPage = ref(1)
const totalPages = ref(1)
const sortingValue = ref(TYPE_TX_SORT.all)

const ITEMS_PER_PAGE = 20

const headerTitles = [
  { title: 'Transaction hash' },
  { title: 'Type' },
  { title: 'Block' },
  { title: 'Date and time' },
  { title: 'Sender' },
  { title: 'Receiver' },
  { title: 'Transaction Fee' },
  { title: 'Amount' },
]

const getAllBalances = async (address: string): Promise<any> =>
  callers.getAllBalances(address).then(res => {
    let balances: any = {}
    res.forEach((item: any) => {
      balances[item.denom] = big
        .bigConvectOdinAndGeo(item.amount || '0.0')
        .toString()
    })
    return balances
  })

const getAccountInfo = async () => {
  lockLoading()

  try {
    transactions.value = []
    console.log(route.params.hash as string)
    const txResponse = await callers.getAccountIndexedTx(
      currentPage.value - 1,
      20,
      route.params.hash as string,
      'desc',
      sortingValue.value,
    )

    const balances = await getAllBalances(route.params.hash as string)

    geoBalance.value = balances['minigeo'] || '0.0'
    odinBalance.value = balances['loki'] || '0.0'
    dokiBalance.value = balances['udoki'] || '0.0'
    myrkBalance.value = balances['umyrk'] || '0.0'

    const txs = txResponse.data.message.map(
      (message: any) => message.transaction,
    )

    transactions.value = prepareTransaction(txs, [])
    totalTxCount.value = txResponse.data.transactions_aggregate.aggregate.count
    totalPages.value = Math.ceil(totalTxCount.value / ITEMS_PER_PAGE)
  } catch (error) {
    isLoadingError.value = true
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

onMounted(async () => {
  await getAccountInfo()
})

const updateHandler = async () => {
  await getAccountInfo()
}

watch([sortingValue], async () => {
  currentPage.value = 1
  await getAccountInfo()
})

// Watch 'route.params.hash' to get the Account info
watch(
  () => route.params.hash,
  async () => {
    currentPage.value = 1
    await getAccountInfo()
  },
)
</script>

<style lang="scss" scoped>
.accounts-item__title {
  margin: 0 1.6rem 0 2rem;
}

.accounts-item__subtitle-wrapper {
  display: flex;
}

.accounts-item__stats {
  display: inline-block;
}

.accounts-item__stats-row {
  display: grid;
  grid-template-columns: 10rem 1fr;
  align-items: center;

  &:not(:last-child) {
    margin-bottom: 2.4rem;
  }
}

.accounts-item__stats-title {
  font-size: 1.6rem;
  width: 10rem;
  display: inline-block;
}

.accounts-item__stats-amount {
  font-weight: 600;
  font-size: 1.6rem;
  margin-left: 2.4rem;
  @include ellipsis();
}

.accounts-item__subtitle-line {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.accounts-item__selection {
  display: flex;
}

.accounts-item__selection-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.accounts-item__subtitle {
  display: flex;
  align-items: center;
  font-size: 1.6rem;
  font-weight: 600;
}

@include respond-to(tablet) {
  .accounts-item__title {
    margin: 0.8rem 0 0.4rem 0;
  }

  .accounts-item__subtitle-wrapper {
    width: 100%;
  }

  .accounts-item__stats {
    width: 100%;
  }

  .accounts-item__selection {
    width: 100%;
    flex-direction: column;
    margin: 1.6rem 0;
  }

  .accounts-item__subtitle-line {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }

  .accounts-item__selection-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .accounts-item__vue-picker {
    width: 100%;
  }
}

@include respond-to(medium) {
  .accounts-item__head {
    display: none;
  }
}
</style>

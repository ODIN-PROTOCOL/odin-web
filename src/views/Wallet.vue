<template>
  <div class="wallet view-main">
    <div class="wallet__title-wrapper view-main__title-wrapper">
      <h1 class="wallet__title view-main__title">Wallet</h1>
      <div class="theme_switch" :class="{'dark': settings && settings.theme === 'dark'}">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 12c0 2.8 2.2 5 5 5s5-2.2 5-5-2.2-5-5-5S7 9.2 7 12zM12 9c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3S10.3 9 12 9zM13 5V3c0-.6-.4-1-1-1s-1 .4-1 1v2c0 .6.4 1 1 1S13 5.6 13 5zM19.1 4.9c-.4-.4-1-.4-1.4 0l-1.4 1.4c-.4.4-.4 1 0 1.4.2.2.5.3.7.3s.5-.1.7-.3l1.4-1.4C19.5 6 19.5 5.3 19.1 4.9zM21 11h-2c-.6 0-1 .4-1 1s.4 1 1 1h2c.6 0 1-.4 1-1S21.6 11 21 11zM17.7 16.2c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l1.4 1.4c.2.2.5.3.7.3s.5-.1.7-.3c.4-.4.4-1 0-1.4L17.7 16.2zM11 19v2c0 .6.4 1 1 1s1-.4 1-1v-2c0-.6-.4-1-1-1S11 18.4 11 19zM4.9 19.1c.2.2.5.3.7.3s.5-.1.7-.3l1.4-1.4c.4-.4.4-1 0-1.4s-1-.4-1.4 0l-1.4 1.4C4.5 18 4.5 18.7 4.9 19.1zM2 12c0 .6.4 1 1 1h2c.6 0 1-.4 1-1s-.4-1-1-1H3C2.4 11 2 11.4 2 12zM6.3 4.9c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l1.4 1.4C6.5 8 6.8 8.1 7.1 8.1S7.6 8 7.8 7.8c.4-.4.4-1 0-1.4L6.3 4.9z"/></svg>
        <Switch :action="updateTheme" :initialState="settings && settings.theme == 'dark' ? true : false" />
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"><path d="M20.63,20a9,9,0,0,1-9.12-8.78A8.61,8.61,0,0,1,14.17,5,10.17,10.17,0,0,0,5,15,10.23,10.23,0,0,0,15.42,25,10.43,10.43,0,0,0,25,18.9,9.3,9.3,0,0,1,20.63,20Z"/></svg>
      </div>
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
import { defineComponent, inject, onMounted, ref, watch } from 'vue'
import { API_CONFIG } from '@/api/api-config'
import { callers } from '@/api/callers'
import { wallet } from '@/api/wallet'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import TxLine from '@/components/TxLine.vue'
import PersonalInfo from '@/components/PersonalInfo.vue'
import Switch from '@/components/Switch.vue'
import { sortingTypeTx, TYPE_TX_SORT } from '@/helpers/sortingHelpers'
import SkeletonTable from '@/components/SkeletonTable.vue'
import { Settings, SettingsStateSymbol, SettingsUpdateSymbol } from '@/ThemeProvider'

export default defineComponent({
  components: {
    AppPagination,
    TxLine,
    PersonalInfo,
    SkeletonTable,
    Switch
  },
  setup: function () {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const settings: Settings | undefined = inject(SettingsStateSymbol)
    const updateUserSettings: ((x: Settings) => any) | undefined = inject(SettingsUpdateSymbol)
    const ITEMS_PER_PAGE = 50
    const currentPage = ref(1)
    const totalPages = ref()
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
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
      }
      releaseLoading()
    }

    const paginationHandler = async (num: number) => {
      currentPage.value = num
      await getTransactions()
    }

    const updateTheme = (dark: boolean) => {
      let newSettings: Settings = settings as Settings
      newSettings.theme = dark ? 'dark' : 'light'
      if (updateUserSettings) updateUserSettings(newSettings)
    }

    onMounted(async () => {
      await getTransactions()
    })

    watch([sortingValue], async () => {
      currentPage.value = 1
      await getTransactions()
    })

    return {
      API_CONFIG,
      settings,
      ITEMS_PER_PAGE,
      totalPages,
      currentPage,
      transactionsCount,
      transactions,
      isLoading,
      paginationHandler,
      updateTheme,
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
.theme_switch {
  display: inherit;
}
.theme_switch > svg {
  width: 28px;
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
body.dark {
  .theme_switch > svg {
    fill: #fff;
  }
}
</style>

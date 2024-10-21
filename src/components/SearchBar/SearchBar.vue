<template>
  <div class="search-bar">
    <div class="search-bar__row">
      <!-- IMPORTANT::Temporary remove vue-picker -->
      <!-- <VuePicker
        class="app-form__field-input app-filter app-filter--rounding-left _vue-picker"
        name="filter"
        v-model="activeFilter"
      >
        <template #dropdownInner>
          <div class="_vue-picker__dropdown-custom">
            <VuePickerOption
              v-for="(filter, index) in filters"
              :key="index"
              :value="filter"
              :text="filter"
            >
              {{ filter }}
            </VuePickerOption>
          </div>  
        </template>
      </VuePicker> -->
      <!-- IMPORTANT::Temporary remove vue-picker -->
      <div class="search-bar__input-wrapper">
        <input
          :class="{
            'search-bar__input': true,
            'search-bar__input--with-value': searchedText,
          }"
          :placeholder="inputPlaceholder"
          v-model="searchedText"
          @keydown.enter="searchBy()"
        />
        <template v-if="searchedText">
          <button @click="clearText" class="search-bar__clear-btn">
            <CloseIcon />
          </button>
        </template>
        <template v-if="searchLoading">
          <div class="search-bar__dropdown">
            <div class="search-bar__dropdown-empty-msg">
              <span>Loading...</span>
            </div>
          </div>
        </template>
        <template v-if="!searchLoading && searchResult">
          <div class="search-bar__dropdown">
            <template v-for="(result, idx) in searchResult" :key="idx">
              <template v-if="result.blocks?.length !== 0">
                <BlockResultItem
                  v-for="block in result.blocks"
                  :result="block"
                  :key="block.height"
                />
              </template>
              <template v-if="result.transactions?.length !== 0">
                <TransactionItem
                  v-for="transaction in result.transactions"
                  :result="transaction"
                  :key="transaction.height"
                />
              </template>
              <template v-if="result.accounts?.length !== 0">
                <AccountItem
                  v-for="accounts in result.accounts"
                  :result="accounts"
                  :key="accounts"
                />
              </template>
              <template v-if="result.nfts?.length !== 0">
                <NFTItem
                  v-for="nft in result.nfts"
                  :result="nft"
                  :key="nft.id"
                />
              </template>
              <template
                v-if="
                  !result.transactions?.length &&
                  !result.blocks?.length &&
                  !result.accounts?.length &&
                  !result.nfts?.length
                "
              >
                <div class="search-bar__dropdown-empty-msg">
                  <span>Does not match any result!</span>
                </div>
              </template>
            </template>
          </div>
        </template>
      </div>
      <button @click.prevent="searchBy" class="search-bar__btn">
        <search-icon />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Router, useRouter } from 'vue-router'
import { callers } from '@/api/callers'
import {
  AccountItem,
  BlockResultItem,
  TransactionItem,
} from '@/components/SearchBar'
import { CloseIcon, SearchIcon } from '@/components/icons'
import {
  isMobile,
  prepareRPCTransaction,
  prepareTransaction,
} from '@/helpers/helpers'
import {
  DecodedTxData,
  SearchResultType,
  TempSearchAccountInfoType,
  TransformedBlocks,
} from '@/helpers/Types'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { prepareBlockMetas } from '@/helpers/blocksHelper'
import { ROUTE_NAMES } from '@/enums'
import { NFTInfo, TransformedBlockInfo, ValidatorDetailedInfo } from '@/graphql/types'
import NFTItem from './NFTItem.vue'

enum FILTER_BY {
  ACCOUNT = 'Account',
  ALL = 'All Filters',
  BLOCK = 'Block',
  TRANSACTION = 'Tx hash',
}

const filters = ref<Array<string>>([
  FILTER_BY.ALL,
  FILTER_BY.BLOCK,
  FILTER_BY.TRANSACTION,
  FILTER_BY.ACCOUNT,
])

const inputPlaceholder = computed(() =>
  isMobile() ? 'Search' : 'Search by Address, TX hash, Block',
)

const activeFilter = ref<string>(filters.value[0])
const searchedText = ref<string | null>('')
const searchResult = ref<Array<SearchResultType> | null>(null)
const searchLoading = ref<boolean>(false)
const validators = ref<ValidatorDetailedInfo[]>([])

const getValidators = async (): Promise<void> => {
  const response = await callers.getValidators()
  validators.value = response.data.validators || []
}

watch(activeFilter, () => {
  searchResult.value = null
})

watch(searchResult, value => {
  // Adding delay to show the result before auto-redirect
  setTimeout(() => {
    if (value) {
      const [firstResult] = value

      if (firstResult.blocks?.length === 1) {
        const blockHeight = firstResult.blocks[0].height 
        router.push({
          name: ROUTE_NAMES.blockDetails,
          params: { id: blockHeight },
        })
        return
      }

      if (firstResult.transactions?.length === 1) {
        const transactionHash = firstResult.transactions[0].hash

        router.push({
          name: ROUTE_NAMES.transactionDetails,
          params: { hash: transactionHash },
        })

        return
      }

      if (firstResult.accounts?.length === 1) {
        const accountAddress = firstResult.accounts[0].address

        router.push({
          name: ROUTE_NAMES.accountDetails,
          params: { hash: accountAddress },
        })

        return
      }

      if (firstResult.nfts?.length === 1) {        
        router.push({
          name: ROUTE_NAMES.nft_detail,
          params: { id: firstResult.nfts[0].id },
        })

        return
      }
    }
  }, 500)
})

const getTransactions = async (): Promise<Array<DecodedTxData>> => {
  const TRANSACTION_HASH_LENGTH = 64
  await getValidators()
  const transactionToSearch = String(searchedText.value)
  if (
    !transactionToSearch ||
    transactionToSearch.length < TRANSACTION_HASH_LENGTH
  ) {
    return []
  }
  try {
    const res = await callers.getTxForTxDetailsPage(String(transactionToSearch))
    return await prepareRPCTransaction([res.data.result], validators.value)
  } catch {
    return []
  }
}

const getAccount = async (): Promise<Array<TempSearchAccountInfoType>> => {
  const ACCOUNT_LENGTH = 43
  const accountToSearch = String(searchedText.value)
  if (
    !accountToSearch ||
    !accountToSearch.startsWith('odin') ||
    accountToSearch.length < ACCOUNT_LENGTH
  ) {
    return []
  }
  try {
    const geoBalance = await callers.getUnverifiedBalances(
      accountToSearch,
      'minigeo',
    )
    const odinBalance = await callers.getUnverifiedBalances(
      accountToSearch,
      'loki',
    )
    return [
      {
        address: accountToSearch,
        geoBalance: { ...geoBalance },
        odinBalance: { ...odinBalance },
      },
    ]
  } catch {
    return []
  }
}

const getBlock = async (): Promise<TransformedBlockInfo[]> => {
  try {
    const { data } = await callers.getBlock(
      searchedText.value,
      Number(searchedText.value) || 0,
    )
    const res = await prepareBlockMetas(data.blockMetas, validators.value)
    return res 
  } catch {
    return []
  }
}


const getNFTs = async (): Promise<NFTInfo[]> => {
  if (!searchedText.value) {
    return []
  }

  try {
    const nfts = await callers.searchNFT(searchedText.value || '')
    return nfts
  } catch {
    return []
  }
}

const searchBy = async (): Promise<Array<SearchResultType> | null> => {
  if (searchedText.value === '') return (searchResult.value = null)
  try {
    searchLoading.value = true
    if (activeFilter.value === FILTER_BY.BLOCK) {
      return (searchResult.value = [
        {
          blocks: await getBlock(),
        },
      ])
    }
    if (activeFilter.value === FILTER_BY.TRANSACTION) {
      return (searchResult.value = [
        {
          transactions: await getTransactions(),
        },
      ])
    }
    if (activeFilter.value === FILTER_BY.ACCOUNT) {
      return (searchResult.value = [
        {
          accounts: await getAccount(),
        },
      ])
    }
    searchResult.value = [
      {
        blocks: await getBlock(),
        transactions: await getTransactions(),
        accounts: await getAccount(),
        nfts: await getNFTs(),
      },
    ]
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
    searchResult.value = null
  } finally {
    searchLoading.value = false
  }
  return null
}

const clearText = (): void => {
  searchedText.value = ''
}

const router: Router = useRouter()
router.beforeEach(() => {
  searchResult.value = null
})
</script>

<style lang="scss" scoped>
.search-bar {
  width: 100%;
}

.search-bar__input-wrapper {
  max-width: 39.6rem;
  width: 100%;
  position: relative;
  border-radius: none;
}

.search-bar__dropdown {
  position: absolute;
  background-color: var(--clr__dropdown-bg);
  border: 0.1rem solid var(--clr__light-gray);
  width: 100%;
  z-index: 2;
  @media (max-width: 48rem) {
    left: 0;
  }
}

.search-bar__dropdown-empty-msg {
  display: flex;
  justify-content: center;
  padding: 1rem;
  background-color: var(--clr__dropdown-bg);
  color: var(--clr__dropdown);
}

.search-bar__row {
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.search-bar__input-wrapper > .search-bar__input {
  background-color: var(--clr__search-field-bg);
  border: none;
}

.search-bar .app-filter {
  background-color: var(--clr__search-field-bg);
  border: none;
  border-right: 0.1rem solid var(--clr__light-gray);
}

.search-bar__input {
  height: 4.8rem;
  padding: 1.2rem 1.5rem;
  width: 100%;
  max-width: 42.6rem;
  color: var(--clr__search-icon);
  border-left: transparent;
  border-right: transparent;
  border-radius: 0;

  &::placeholder {
    color: var(--clr__text-muted);
  }

  &::-webkit-search-cancel-button {
    display: none;
  }

  &.search-bar__input--with-value {
    padding-right: 3.5rem;
  }
}

.search-bar__btn {
  width: 4.8rem;
  height: 4.8rem;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  background-color: var(--clr__action);
  border-top-right-radius: 0.4rem;
  border-bottom-right-radius: 0.4rem;

  img {
    width: 1.8rem;
    height: 1.8rem;
    display: block;
  }
}

.search-bar__clear-btn {
  overflow: visible;
  position: absolute;
  right: 1rem;
  top: 1.2rem;
}

@include respond-to(tablet) {
  .search-bar__input {
    &::placeholder {
      font-size: 1.4rem;
    }
  }
}
</style>

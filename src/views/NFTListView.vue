<template>
  <div class="app__main-view">
    <div class="nfts-view__subtitle-wrapper">
        <div class="nfts-view__subtitle app__view-main__subtitle mg-b32">
          <h2 class="app__view-main__subtitle">All NFTs</h2>
        </div>
        <div class="nfts-view__selection">
          <div class="nfts-view__selection-item">            
            <VuePicker
              class="nfts-view__vue-picker _vue-picker"
              name="filter"
              v-model="sortingValue"
              :isDisabled="isLoading"
            >
              <template #dropdownInner>
                <div class="_vue-picker__dropdown-custom">
                  <VuePickerOption
                    v-for="{ text, value } in nftSortTypes"
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
    <div>
      <div v-if="isLoading">Loading...</div>
      <div class="nft-grid" v-else>
        <div v-for="nft in nfts" :key="nft.id" class="nft-item">
          <router-link
            :to="{ name: ROUTE_NAMES.nft_detail, params: { id: nft.id } }"
          >
            <img
              :src="
                nft.details.preview.replace(
                  'https://ipfs.io/ipfs',
                  API_CONFIG.ipfsNodeUrl,
                )
              "
              :alt="nft.details.prompt"
              class="nft-image"
            />
          </router-link>
          <div class="nft-social">
            <button
              @click="Like(nft.id, nft.class_id)"
              :disabled="alreadyLiked.includes(`${nft.class_id}#${nft.id}`)"
            >
              <FontAwesomeIcon :icon="faThumbsUp" />
              <span>{{ nft.likes.aggregate.count }}</span>
            </button>
            <a :href="nft.shareableXUrl" target="_blank">
              <span>Share</span>
              <FontAwesomeIcon :icon="faXTwitter" />
            </a>
            <a :href="nft.shareableThreadsUrl" target="_blank">
              <span>Share</span>
              <FontAwesomeIcon :icon="faThreads" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { blockChainDataBlocks, chartPagesProps } from '@/const'
import { ref, onMounted, computed, watch } from 'vue'
import { callers } from '@/api/callers'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { START_VALUE } from '@/api/api-config'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import { ROUTE_NAMES } from '@/enums'
import { API_CONFIG } from '@/api/api-config'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faThumbsUp, faShareNodes } from '@fortawesome/free-solid-svg-icons'
import { faXTwitter, faThreads } from '@fortawesome/free-brands-svg-icons'
import { nftSortTypes, TYPE_NFT_SORT } from '@/helpers/sortingHelpers'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const ITEMS_PER_PAGE = 50

const shareText = '#NFT generated with #SKÖPUN on @Odinprotocol\nCheck it here :point_right:'
const hashtagsText = '#NFT #AI $ODIN #ArtWork #GenerativeAI'

const sortingValue = ref(TYPE_NFT_SORT.recency)
const nfts = ref()
const currentPage = ref<number>(1)
const alreadyLiked = ref()
const pageSize = ref(50)
const totalPages = ref<number>()

const reloadNFTs = async () => {
  const path = location.protocol + '//' + location.host
  let nftResults = await callers.getNFTs(currentPage.value, pageSize.value, sortingValue.value)
  nftResults.every((nft: any) => {
    let threadsShareableText = encodeURIComponent(
      `${shareText} ${hashtagsText} ${path}/nfts/${nft.id}`,
    )
    nft.shareableThreadsUrl = `${API_CONFIG.threadsShareUrl}?text=${threadsShareableText}`
    nft.shareableXUrl = `${API_CONFIG.xShareUrl}?text=${shareText}&url=${path}/nfts/${nft.id}&hashtags=nft,blockchain,ai,images,generativeais`
    nft.details.preview = nft.details.preview.replace(
      'https://ipfs.io/ipfs',
      API_CONFIG.ipfsNodeUrl,
    )
    return nft
  })
  alreadyLiked.value = await callers.getAlreadyLiked()
  nfts.value = nftResults
}

const fetchAllNFTs = async (): Promise<void> => {
  lockLoading()
  try {
    await reloadNFTs()
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

const updateHandler = async (num: number) => {
  await fetchAllNFTs()
}

const Like = async (id: string, classId: string) => {
  try {
    let result: boolean = await callers.likeNFT(id, classId)
    if (result) {
      await reloadNFTs()
      handleNotificationInfo('NFT Like processed', TYPE_NOTIFICATION.success)
    }
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
}

onMounted(async (): Promise<void> => {
  await fetchAllNFTs()
})

watch([sortingValue], async () => {
  await fetchAllNFTs()
})
</script>

<style lang="scss">
.nft-grid {
  display: grid;
  grid-gap: var(--spacing);
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  min-height: calc(100vh - var(--spacing) * 2);
}

.nft-item {
  position: relative;

  .nft-social {
    display: flex;
  }
}

img {
  width: 100%;
  display: block;
}

.nft-social {
  display: none;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  color: white;
  padding: 8px;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.nft-item .nft-social > button {
  padding: 4px 8px;
  font-size: 13px;
  background-color: var(--clr__action);
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 4px;

  span {
    display: block;
    margin-top: 3px;
  }
}
.nft-item .nft-social > button:disabled {
  background-color: var(--clr__btn-disabled);
}
.nft-item .nft-social > a {
  padding: 4px 8px;
  font-size: 13px;
  background-color: var(--clr__action);
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 4px;
  color: white;
  text-decoration: none;

  &:visited {
    color: white;
    text-decoration: none;
  }
  span {
    display: block;
    margin-top: 3px;
  }
}

@include respond-to(tablet) {
  .blocks-list__table-row {
    grid: none !important;
    padding: 3.4rem 0 1.6rem !important;
  }

  .blocks-list__table-head {
    display: none !important;
  }

  .blocks-list__table-title {
    display: inline-block !important;
    min-width: 15rem;
    margin-right: 2.4rem !important;
    font-weight: 300;
  }
}

.charts-view__section {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2.4rem;
  margin-bottom: 4rem;

  .charts-view__chart-wrapper {
    padding: 2rem;
    border-radius: 8px;
    border: 0.1rem solid var(--clr__card-border);

    .charts-view__chart-title {
      margin-top: 0;
      color: var(--clr__text-muted);
      margin-bottom: 4rem;
    }

    .custom-bar-chart {
      height: 100px;
    }
  }
}

@include respond-to(small) {
  .charts-view__section {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

.nfts-view__subtitle-wrapper {
  display: flex;
  justify-content: space-between;
}

.nfts-view__subtitle {
  display: flex;
  align-items: center;
}

.nfts-view__vue-picker {
  margin-left: 1rem;
}

.nfts-view__selection-item-title {
  margin-right: 0.4rem;
  font-size: 1.4rem;
  font-weight: 300;
}

.nfts-view__tx-info {
  margin-right: 0.9rem;
  height: 2.3rem;
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
}

@include respond-to(tablet) {
  .nfts-view__selection {
    margin-bottom: 1.6rem;
    width: 100%;
    flex-direction: column;
  }

  .nfts-view__subtitle-wrapper {
    flex-direction: column;
  }

  .nfts-view__selection-item {
    display: flex;
    flex-direction: column;
  }

  .nfts-view__selection-item-title {
    margin: 0 0 0.4rem;
  }

  .nfts-view__vue-picker {
    margin-left: 0;
    width: 100%;
  }
}
</style>

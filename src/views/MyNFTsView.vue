<template>
  <div class="app__main-view">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { blockChainDataBlocks, chartPagesProps } from '@/const'
import { ref, onMounted, computed } from 'vue'
import { callers } from '@/api/callers'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { API_CONFIG, START_VALUE } from '@/api/api-config'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import { ROUTE_NAMES } from '@/enums'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const ITEMS_PER_PAGE = 50

const nfts = ref()
const currentPage = ref<number>(1)
const pageSize = ref(50)
const totalPages = ref<number>()

const fetchAllNFTs = async (): Promise<void> => {
  lockLoading()
  try {
    console.log(currentPage.value, pageSize.value)
    let nftResults = await callers.getMyNFTs(currentPage.value, pageSize.value)
    nfts.value = nftResults
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

const updateHandler = async (num: number) => {
  await fetchAllNFTs()
}

onMounted(async (): Promise<void> => {
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
  max-width: 100%;
  display: block;
  margin: 10px;
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
</style>

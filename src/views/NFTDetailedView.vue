<template>
  <div class="app__main-view">
    <div>
      <div v-if="isLoading || !nft">Loading...</div>
      <div class="nft-detail" v-else>
        <div class="nft-item">
          <div class="preview">
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
          </div>
          <div class="app-table__row">
            <div class="app-table__cell-txt">
              {{ nft.details.prompt }}
            </div>
          </div>
          <div class="app-table__body">
            <div class="app-table__row">
              <div class="app-app-table__cell-txt app-table__link">
                <label class="app-form__field-lbl"
                  >By
                  <router-link
                    :to="{
                      name: ROUTE_NAMES.accountDetails,
                      params: { hash: nft.details.owner },
                    }"
                    >{{ nft.details.owner }}</router-link
                  >
                  at <router-link
                    :to="{
                      name: ROUTE_NAMES.blockDetails,
                      params: { hash: nft.details.request_height },
                    }"
                    >{{ nft.details.request_height }}</router-link> -> <router-link
                    :to="{
                      name: ROUTE_NAMES.transactionDetails,
                      params: { hash: nft.mint_tx_hash },
                    }"
                    >{{ nft.mint_tx_hash }}</router-link> (<a
                    target="_blank"
                    :href="ipfsLink"
                    >IPFS link</a
                  >)</label
                >
              </div>
            </div>
            <div class="app-table__row">
              <div class="app-table__cell-txt app-table__link">
                <div class="user-widget fx-row fx-sae control-buttons">
                  <button
                    @click="Like(nft.id, nft.class_id)"
                    class="share-btn app-btn app-btn--small"
                    network="threads"
                    target="_blank"
                    :disabled="alreadyLiked.includes(`${nft.class_id}#${nft.id}`) || isLikeProcessing"
                  >
                    <FontAwesomeIcon :icon="faThumbsUp" />
                    <span>{{ likesCount }}</span>
                  </button>
                  <span class="share_on app-table__title"> Share on: </span>
                  <a
                    :href="shareThreads"
                    class="share-btn app-btn app-btn--small"
                    network="threads"
                    target="_blank"
                    ><FontAwesomeIcon :icon="faThreads"
                  /></a>
                  <a
                    :href="shareX"
                    class="share-btn app-btn app-btn--small"
                    network="x"
                    target="_blank"
                    ><FontAwesomeIcon :icon="faXTwitter"
                  /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, onMounted, computed, reactive } from 'vue'
import { callers } from '@/api/callers'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { API_CONFIG, START_VALUE } from '@/api/api-config'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { ROUTE_NAMES } from '@/enums'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faXTwitter, faThreads } from '@fortawesome/free-brands-svg-icons'
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'
import { useHead } from '@vueuse/head'
import { NFTInfo } from '@/graphql/types'

const route: RouteLocationNormalizedLoaded = useRoute()
const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const [isLikeProcessing, lockLike, releaseLike] = useBooleanSemaphore()
const shareText = 'NFT generated with SKÖPUN - Odin network'
const hashtagsText = '#generativeai #nft #blockchain'

const shareThreads = ref<string>()
const shareX = ref<string>()

const nft = ref<NFTInfo | null>(null)
const likesCount = ref<number>(0)
const alreadyLiked = ref<string[]>([])

const ipfsLink = computed(() => {
  return `${API_CONFIG.ipfsNodeUrl}/${nft.value?.uri}`
})


const fetchNFT = async (): Promise<void> => {
  lockLoading()
  try {
    nft.value = await callers.getNFT(route.params.id)
    if (nft.value) {
      useHead({
        title: nft.value.details?.prompt || '',
        meta: [
          { property: 'og:title', content: nft.value.details?.prompt },
          {
            property: 'og:description',
            content: 'Create a prompt to generate a unique NFT image',
          },
          {
            property: 'og:image',
            content: nft.value.details?.preview?.replace(
              'https://ipfs.io/ipfs',
              API_CONFIG.ipfsNodeUrl,
            ),
          },
        ],
      })
      const likeCount = await callers.getNFTLikes(nft.value.id, nft.value.class_id)
      alreadyLiked.value = await callers.getAlreadyLiked()
      likesCount.value = likeCount
    }
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}


const Like = async (id: string, classId: string) => {
  lockLike()
  try {
    let result: boolean = await callers.likeNFT(id, classId)
    if (result) {            
      alreadyLiked.value = await callers.getAlreadyLiked()      
      likesCount.value = await callers.getNFTLikes(id, nft.value.class_id)
      handleNotificationInfo('NFT Like processed', TYPE_NOTIFICATION.success)
    }
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLike()
}

onMounted(async (): Promise<void> => {
  await fetchNFT()
  const shareableText = encodeURIComponent(
    `${shareText} ${hashtagsText} ${window.location}`,
  )
  shareThreads.value = `https://threads.net/intent/post?text=${shareableText}`
  shareX.value = `https://twitter.com/intent/post?text=${shareText}&url=${window.location}&hashtags=nft,blockchain,ai,images,generativeai`
})
</script>

<style lang="scss">
.share_on {
  margin-right: 1rem;
}
.preview {
  margin-bottom: 1rem;
}
.app-table__row {
  padding-bottom: 1rem;
}
.share-btn {
  padding: 12px;
}
img {  
  max-height: 800px;
  display: block;
}
.control-buttons .app-btn {
  margin-right: 1rem;
  span {
    margin-left: 4px;
    font-size: 13px;
    line-height: 13px;
  }
}
</style>

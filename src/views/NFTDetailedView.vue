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
            <div class="app-table__cell">
              {{ nft.details.prompt }}
            </div>
          </div>
          <div class="app-table__body">
            <div class="app-table__row">
              <div class="app-app-table__cell">
                <label class="app-form__field-lbl"
                  >
                  <span class="lbl_by">By - </span>
                  <router-link
                    :to="{
                      name: ROUTE_NAMES.accountDetails,
                      params: { hash: nft.details.owner },
                    }"
                    >{{ nft.details.owner }}</router-link
                  >
                  <br />
                  <br />
                  <span class="lbl_by">at - </span>
                  <router-link
                    :to="{
                      name: ROUTE_NAMES.blockDetails,
                      params: { hash: nft.details.request_height },
                    }"
                    >{{ nft.details.request_height }}</router-link
                  >
                  ->
                  <router-link
                    :to="{
                      name: ROUTE_NAMES.transactionDetails,
                      params: { hash: nft.mint_tx_hash },
                    }"
                    >{{ nft.mint_tx_hash }}</router-link
                  >
                  <br />
                  <br />
                  (<a target="_blank" :href="ipfsLink">IPFS link</a>)</label
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
                    :disabled="
                      alreadyLiked.includes(`${nft.class_id}#${nft.id}`) ||
                      isLikeProcessing
                    "
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
            <div
              v-if="!wallet.isEmpty && nft.owner == wallet.account.address"
              class="app-table__row"
            >
              <div class="app-table__cell">
                <div class="user-widget fx-row fx-sae control-buttons">
                  <button
                    @click="Send('')"
                    class="send-btn app-btn app-btn--small"
                    :disabled="isLoading || recipient === '' || isTransfering"
                  >
                    <FontAwesomeIcon :icon="faMoneyBillTransfer" />
                    <span>Transfer NFT to</span>
                  </button>
                  <input
                    class="app-form__field-input send_nft_receiver"
                    name="send-nft-receiver"
                    type="text"
                    placeholder="odin1cgfdwtrqfdrzh4z8rkcyx8g4jv22v8wgav3rjx"
                    v-model="recipient"
                    :disabled="isLoading || isTransfering"
                  />
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
import {
  faThumbsUp,
  faMoneyBillTransfer,
} from '@fortawesome/free-solid-svg-icons'
import { useHead } from '@vueuse/head'
import { NFTInfo } from '@/graphql/types'
import { wallet } from '@/api/wallet'
import { MsgSend } from 'cosmjs-types/cosmos/nft/v1beta1/tx'
import { shareText, hashtagsText } from '@/const'

const route: RouteLocationNormalizedLoaded = useRoute()
const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const [isLikeProcessing, lockLike, releaseLike] = useBooleanSemaphore()
const [isTransfering, lockTransfer, releaseTransfer] = useBooleanSemaphore()

const shareThreads = ref<string>()
const shareX = ref<string>()

const recipient = ref<string>('')
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
      console.log(nft.value)
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
      const likeCount = await callers.getNFTLikes(
        nft.value.id,
        nft.value.class_id,
      )
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

const Send = async (address: string) => {
  lockTransfer()
  try {
    const msgSend = MsgSend.fromJSON({
      sender: wallet.account.address,
      receiver: recipient.value,
      id: nft.value?.id,
      classId: nft.value?.class_id,
    })

    await callers.transferNFT(msgSend)
    await fetchNFT()
    handleNotificationInfo('NFT transferred', TYPE_NOTIFICATION.success)
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseTransfer()
}

onMounted(async (): Promise<void> => {
  await fetchNFT()
  let path = window.location
  let processedShareText = encodeURIComponent(
      `${shareText} ${path} ${hashtagsText}`,
  )
  shareThreads.value = `https://threads.net/intent/post?text=${processedShareText}`
  shareX.value = `https://twitter.com/intent/post?text=${processedShareText}`
})
</script>

<style lang="scss">
.nft-detail {
  max-width: 85rem;
  margin: 0 auto;
}
.share_on {
  margin-right: 1rem;
}
.preview {
  margin-bottom: 1rem;
}
.app-table__row {
  padding-bottom: 1rem;
  padding: 16px;
  border: 1px solid var(--clr__card-border);
}
.share-btn {
  padding: 12px;
}
.send-btn {
  margin-right: 1rem;
  padding: 12px;
}
.send_nft_receiver {
  padding: 12px;
}
img {
  width: 100%;
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

.app-form__field-lbl {
  .lbl_by {
    display: inline-block;
    margin-right: 8px;
  }

  a {
    color: var(--clr__action);
    word-break: break-all;
  }
}
</style>

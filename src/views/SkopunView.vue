<template>
  <div class="app__main-view">
    <h2 class="app__main-view-detail-title">{{ title }}</h2>
    <div class="app-form__main">
      <form @submit="handleSubmit">
        <div class="app-form__field prompt-field">
          <TextareaField
            v-model="prompt"
            name="image-generation-prompt"
            :rows="5"
            placeholder="Image generation prompt"
            style="font-family: sans-serif"
          />
        </div>

        <div id="result"></div>
        <div class="user-widget fx-row fx-sae control-buttons">
          <button
            type="submit"
            class="app-btn app-btn--large"
            :disabled="isLoading || isGenerating"
          >
            <img
              :src="AiGenerate"
              class="ai-generate-icon"
              v-if="isGenerating"
            />
            Generate Image
          </button>
          <button
            v-if="requestId !== null && !isGenerating"
            @click="handleNFTCreate"
            class="app-btn app-btn--large"
            :disabled="isAddingNFT || isLoading || isGenerating"
          >
            Create NFT
          </button>
        </div>
      </form>

      <template v-if="isLoading">
        <div class="skopun-loading">
          <img :src="OdinYellowAsset" />
          <p>Loading...</p>
        </div>
      </template>
    </div>

    <div class="how-to-use-skopun">
      <h3>How to use sköpun</h3>
      <ul>
        <li>
          <b>Access</b>
          <p>
            Go to
            <a href="https://testnet.odinprotocol.io/skopun"
              >https://testnet.odinprotocol.io/skopun</a
            >
          </p>
        </li>
        <li>
          <b>Connect Wallet</b>
          <p>Connect your crypto wallet.</p>
        </li>
        <li>
          <b>Enter Prompt</b>
          <p>
            Input your creative prompt and confirm the transaction. For well
            known people use capital letters for the name & last name.
          </p>
        </li>
        <li>
          <b>AI Magic</b>
          <p>The AI will generate your unique artwork.</p>
        </li>
        <li>
          <b>Receive Art</b>
          <p>
            After a few seconds, you’ll get the art tied to your wallet as the
            creator.
          </p>
        </li>
        <li>
          <b>Generate NFT</b>
          <p>If satisfied, click “Generate NFT.”</p>
        </li>
        <li>
          <b>Confirm Transaction</b>
          <p>Confirm the transaction to mint the NFT.</p>
        </li>
        <li>
          <b>Receive NFT</b>
          <p>The NFT will be sent to your wallet.</p>
        </li>
        <li>
          <b>CHECK NFTs</b>
          <p>Go to “MY NFTS” Section to review your NFTs.</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { useRouter } from 'vue-router'
import TextareaField from '@/components/fields/TextareaField.vue'

import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { API_CONFIG, START_VALUE } from '@/api/api-config'
import AiGenerate from '@/assets/icons/ai-generate.svg'
import OdinYellowAsset from '@/assets/brand/odin-yellow.png'

import { wallet } from '../api/wallet'
import axios from 'axios'
import { ROUTE_NAMES } from '@/enums'
import { useHead } from '@vueuse/head'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const [isGenerating, lockGenerating, releaseGenerating] = useBooleanSemaphore()
const [isAddingNFT, lockNFTAdding, releaseNFTGenerating] = useBooleanSemaphore()

const requestId = ref<number | null>()

const prompt = ref<string>('')

const title = 'SKÖPUN - THE ART OF CREATION'

useHead({
  title,
  meta: [
    { property: 'og:title', content: title },
    {
      property: 'og:description',
      content:
        'Create a prompt to generate a unique NFT image using Sköpun on Odin chain.',
    },
    {
      property: 'og:image',
      content:
        'https://testnet-tyr-1.odinprotocol.io/ipfs/QmU4EPSPuPUnyfWfpNimPL9SKuT7mryUWodLV2rfMRJ6GJ',
    },
    { name: 'twitter:title', content: title },
    {
      name: 'twitter:description',
      content:
        'Create a prompt to generate a unique NFT image using Sköpun on Odin chain.',
    },
    {
      name: 'twitter:image',
      content:
        'https://testnet-tyr-1.odinprotocol.io/ipfs/QmU4EPSPuPUnyfWfpNimPL9SKuT7mryUWodLV2rfMRJ6GJ',
    },
  ],
})

const handleSubmit = async (e: Event) => {
  e.preventDefault()

  if (wallet.isEmpty || !wallet.account || !wallet.wasmSigner) {
    handleNotificationInfo(
      'Please connect your wallet first.',
      TYPE_NOTIFICATION.info,
    )
    return
  }

  lockLoading()
  lockGenerating()

  requestId.value = null
  const msg = {
    request_generation: {
      metadata: prompt.value,
    },
  }

  try {
    const result = await wallet.wasmSigner.execute(
      wallet.account.address, // Sender address
      API_CONFIG.skopunContractAddress, // Contract address
      msg, // Execute message
      'auto', // Fee (auto-estimated)
      '', // Memo (optional)
      [{ denom: 'loki', amount: '100' }], // Funds (if required by contract)
    )
    console.log('Transaction result:', result)

    const wasmEvent = result.events.find(
      event => event.type === 'wasm-wasm_request',
    )

    if (wasmEvent) {
      const idAttribute = wasmEvent.attributes.find(attr => attr.key === 'id')
      if (idAttribute) {
        const request = idAttribute.value

        lockGenerating
        requestId.value = parseInt(request)

        let attempts = 0
        let response = null

        while (attempts < 100) {
          let query = {
            list_request_reports: { request_id: parseInt(request) },
          }
          try {
            response = await wallet.wasmSigner.queryContractSmart(
              API_CONFIG.skopunContractAddress,
              query,
            )

            if (response && response.length > 0) {
              const hash = response[0].hash

              const nftDataUrl = `${API_CONFIG.ipfsNodeUrl}/${hash}`
              const nftData = await axios.get(nftDataUrl)

              const imageUrl = nftData.data.preview.replace(
                'https://ipfs.io/ipfs',
                API_CONFIG.ipfsNodeUrl,
              )

              // Create an image element and set its source to the imageUrl
              const img = document.createElement('img')
              img.src = imageUrl
              img.alt = 'Generated Image'
              img.className = 'nft-image mt-4'

              // Showing result
              const resultContainer = document.querySelector('#result')
              if (resultContainer !== null) {
                resultContainer.innerHTML = ''
                resultContainer.appendChild(img)
                break
              }
            }
          } catch (error) {
            console.error('Query failed:', error)
          }

          attempts++
          await new Promise(resolve => setTimeout(resolve, 3000)) // 3 second delay
        }

        if (attempts === 100) {
          console.error(
            'Failed to get a successful response after 20 attempts.',
          )
          handleNotificationInfo(
            'Failed to get a successful response after 20 attempts.',
            TYPE_NOTIFICATION.failed,
          )
        }
      } else {
        console.error('ID attribute not found in wasm-wasm_request event.')
        handleNotificationInfo(
          'NFT generation requested, but ID attribute not found.',
          TYPE_NOTIFICATION.failed,
        )
      }
    } else {
      console.error('wasm-wasm_request event not found.')
      handleNotificationInfo(
        'NFT generation requested, but wasm-wasm_request event not found.',
        TYPE_NOTIFICATION.failed,
      )
    }
  } catch (error) {
    console.error('Transaction failed:', error)
    handleNotificationInfo('Transaction failed.', TYPE_NOTIFICATION.failed)
  } finally {
    releaseLoading()
    releaseGenerating()
  }
}

const handleNFTCreate = async (e: Event) => {
  e.preventDefault()

  if (!wallet.account || wallet.wasmSigner === null) {
    handleNotificationInfo(
      'Please connect your wallet first.',
      TYPE_NOTIFICATION.info,
    )
    return
  }

  lockNFTAdding()

  if (requestId.value === null) {
    handleNotificationInfo(
      'Please generate image first',
      TYPE_NOTIFICATION.info,
    )
    return
  }

  let msg = { mint_nft: { request_id: requestId.value } }

  try {
    const result = await wallet.wasmSigner.execute(
      wallet.account.address, // Sender address
      API_CONFIG.skopunContractAddress, // Contract address
      msg, // Execute message
      'auto', // Fee (auto-estimated)
      '', // Memo (optional)
      [{ denom: 'loki', amount: '100' }], // Funds (if required by contract)
    )

    console.log('Transaction result:', result)
    releaseNFTGenerating()
    requestId.value = null
    handleNotificationInfo(
      'NFT created successfully.',
      TYPE_NOTIFICATION.success,
    )
  } catch (error) {
    releaseNFTGenerating()
    console.error('Transaction failed:', error)
    handleNotificationInfo('Transaction failed.', TYPE_NOTIFICATION.failed)
  }
}
</script>

<style lang="scss">
.app-form__main {
  position: relative;
  margin-bottom: 40px;
}

.how-to-use-skopun {
  h3 {
    font-size: 20px;
  }
  ul {
    margin-left: -40px;
    list-style: none;
    li {
      padding: 8px 16px;
      border: 1px solid var(--clr__card-border);
      margin-bottom: 16px;
      a {
        color: var(--clr__action);
      }

      b {
        color: var(--clr__text-muted);
        font-weight: 400;
      }

      p {
        margin-top: 4px;
        font-weight: 900;
      }
    }
  }
}

.result {
  margin-top: 2rem;
  margin-bottom: 2rem;
}
.control-buttons .app-btn {
  margin-right: 1rem;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 16px;

  .ai-generate-icon {
    width: 20px;
    animation: pulse 1.5s infinite;
  }
}

.skopun-loading {
  position: absolute;
  border: 1px solid var(--clr__card-border);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--clr__main-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  img {
    width: 70px;
  }

  p {
    font-size: 18px;
    display: block;
    animation: pulse 1.5s infinite;
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05); /* Slightly larger scale */
    opacity: 0.7; /* Reduce opacity at the peak of the pulse */
  }
}

.prompt-field {
  margin-top: 1rem;
  margin-bottom: 1rem;
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

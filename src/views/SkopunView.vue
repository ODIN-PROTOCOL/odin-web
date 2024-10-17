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
          />
        </div>

        <div id="result"></div>
        <div class="user-widget fx-row fx-sae control-buttons">
          <button
            type="submit"
            class="app-btn app-btn--large generate-image"
            :disabled="isLoading || isGenerating"
          >
            <img
              :src="AiGenerate"
              class="ai-generate-icon"
              v-if="isGenerating"
            />
            <span>Generate Image</span>
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
      content: 'Create a prompt to generate a unique NFT image',
    },
    { property: 'og:image', content: 'https://example.com/dynamic-image.jpg' },
  ],
})

const handleSubmit = async (e: Event) => {
  e.preventDefault()

  if (wallet.isEmpty || !wallet.account || !wallet.wasmSigner) {
    handleNotificationInfo(
      'Please connect your wallet first.',
      TYPE_NOTIFICATION.info
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
      [{ denom: 'loki', amount: '100' }] // Funds (if required by contract)
    )
    console.log('Transaction result:', result)

    const wasmEvent = result.events.find(
      event => event.type === 'wasm-wasm_request'
    )

    if (wasmEvent) {
      const idAttribute = wasmEvent.attributes.find(attr => attr.key === 'id')
      if (idAttribute) {
        const request = idAttribute.value
        console.log('Request ID:', request)

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
              query
            )

            if (response && response.length > 0) {
              const hash = response[0].hash

              const nftDataUrl = `${API_CONFIG.ipfsNodeUrl}/${hash}`
              const nftData = await axios.get(nftDataUrl)

              console.log('NFT Data:', nftData)
              const imageUrl = nftData.data.preview.replace(
                'https://ipfs.io/ipfs',
                API_CONFIG.ipfsNodeUrl
              )

              // Create an image element and set its source to the imageUrl
              const img = document.createElement('img')
              img.src = imageUrl
              img.alt = 'Generated Image'
              img.className = 'w-full h-auto mt-4'

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
            'Failed to get a successful response after 20 attempts.'
          )
          handleNotificationInfo(
            'Failed to get a successful response after 20 attempts.',
            TYPE_NOTIFICATION.failed
          )
        }
      } else {
        console.error('ID attribute not found in wasm-wasm_request event.')
        handleNotificationInfo(
          'NFT generation requested, but ID attribute not found.',
          TYPE_NOTIFICATION.failed
        )
      }
    } else {
      console.error('wasm-wasm_request event not found.')
      handleNotificationInfo(
        'NFT generation requested, but wasm-wasm_request event not found.',
        TYPE_NOTIFICATION.failed
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
      TYPE_NOTIFICATION.info
    )
    return
  }

  lockNFTAdding()

  if (requestId.value === null) {
    handleNotificationInfo(
      'Please generate image first',
      TYPE_NOTIFICATION.info
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
      [{ denom: 'loki', amount: '100' }] // Funds (if required by contract)
    )

    console.log('Transaction result:', result)
    releaseNFTGenerating()
    requestId.value = null
    handleNotificationInfo(
      'NFT created successfully.',
      TYPE_NOTIFICATION.success
    )
  } catch (error) {
    releaseNFTGenerating()
    console.error('Transaction failed:', error)
    handleNotificationInfo('Transaction failed.', TYPE_NOTIFICATION.failed)
  }
}
</script>

<style lang="scss">
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

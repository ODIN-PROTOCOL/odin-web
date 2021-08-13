<template>
  <button class="metamask-btn" type="submit" @click.prevent="connectMetaMask">
    <img src="~@/assets/brand/metamask-fox.svg" alt="metamask_logo" />
    <span>MetaMask</span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { showMetaMaskFormDialog } from './MetaMaskModal.vue'

export default defineComponent({
  name: 'MetaMask',
  setup() {
    const connectMetaMask = (): void => {
      showMetaMaskFormDialog()
    }

    return { connectMetaMask }
  },
})
</script>

<style scoped></style>

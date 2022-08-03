<template>
  <ModalBase class="info-modal" @close="onClose()">
    <template #title>
      <h3 class="app-form__title">{{ title }}</h3>
    </template>

    <template #main>
      <div class="info-modal__info">
        <p class="info-modal__info-text mg-b24">{{ text }}</p>
      </div>
    </template>
  </ModalBase>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { dialogs } from '@/helpers/dialogs'
import { preventIf } from '@/helpers/functions'
import { ModalBase } from '@/components/modals'

defineProps<{
  title: string
  text: string
}>()

const isLoading = ref(false)
const onClose = preventIf(dialogs.getHandler('onClose'), isLoading)
</script>

<style lang="scss" scoped>
.info-modal {
  &__info {
    padding: 0 1rem;
  }

  &__info-text {
    text-align: center;
  }
}
</style>

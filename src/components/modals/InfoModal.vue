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

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { dialogs } from '@/helpers/dialogs'
import { preventIf } from '@/helpers/functions'
import ModalBase from './ModalBase.vue'

const InfoModal = defineComponent({
  props: {
    title: { type: String, required: true },
    text: { type: String, required: true },
  },
  components: { ModalBase },
  setup: function () {
    const isLoading = ref(false)

    return {
      onClose: preventIf(dialogs.getHandler('onClose'), isLoading),
    }
  },
})

export default InfoModal
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

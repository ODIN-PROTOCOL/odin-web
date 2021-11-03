<template>
  <ModalBase class="info-modal" @close="onClose()">
    <template #title>
      <h3 class="app-form__title">Become a validator</h3>
    </template>

    <template #main>
      <div class="info-modal__info">
        <p class="mg-b24">
          To become a validator, please follow the instructions on the Github
          link below
        </p>
        <a class="info-modal__link" :href="githubLink">{{ githubLink }}</a>
      </div>
    </template>
  </ModalBase>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { DialogHandler, dialogs } from '@/helpers/dialogs'
import { ConditionArg, preventIf } from '@/helpers/functions'
import ModalBase from './ModalBase.vue'

const InfoModal = defineComponent({
  components: { ModalBase },
  setup: function () {
    const isLoading = ref(false)
    const githubLink = ref(
      `https://github.com/GeoDB-Limited/odin-testnet-public-tools#sending-transaction-to-become-a-validator`
    )
    return {
      githubLink,
      onClose: preventIf(
        dialogs.getHandler('onClose'),
        isLoading as unknown as ConditionArg
      ),
    }
  },
})

export default InfoModal
export function showBecomeValidatorInfoModal(callbacks: {
  onClose?: DialogHandler
}): Promise<unknown | null> {
  return dialogs.show(InfoModal, callbacks)
}
</script>

<style lang="scss" scoped>
.info-modal {
  &__info {
    padding: 0 1rem;
  }

  &__link {
    text-decoration: none;
    color: var(--clr__action);
  }
}
</style>

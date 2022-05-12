<template>
  <ModalBase @close="onClose()">
    <template #title>
      <h3 class="app-form__title">Share</h3>
    </template>

    <template #main>
      <div class="receive-modal">
        <div class="receive-modal__main">
          <QrcodeVue
            class="mg-b16"
            :value="address"
            :size="200"
            render-as="svg"
          />
          <div class="receive-modal__info">
            <span class="receive-modal__info-title">Address</span>
            <div class="receive-modal__info-address">
              <span>{{ address }}</span>
              <CopyButton :text="address" />
            </div>
          </div>
        </div>
        <div class="receive-modal__footer">
          <button class="app-btn" type="button" @click="onClose()">
            Share
          </button>
        </div>
      </div>
    </template>
  </ModalBase>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { dialogs } from '@/helpers/dialogs'
import { wallet } from '@/api/wallet'
import QrcodeVue from 'qrcode.vue'
import ModalBase from '@/components/modals/ModalBase.vue'
import CopyButton from '@/components/CopyButton.vue'

export default defineComponent({
  components: { ModalBase, QrcodeVue, CopyButton },
  setup: function () {
    const address = ref(wallet.account.address)

    return {
      address,
      onSubmit: dialogs.getHandler('onSubmit'),
      onClose: dialogs.getHandler('onClose'),
    }
  },
})
</script>

<style lang="scss" scoped>
.receive-modal {
  &__main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2.4rem 1rem;
    overflow: none;
  }

  &__info-address {
    display: flex;
    width: 100%;
    flex-direction: row;

    span {
      font-weight: 300;
      word-break: break-all;
    }
  }

  &__footer {
    display: flex;
    margin-top: 3.2rem;

    & > * {
      flex: 1;
    }
  }
}
</style>

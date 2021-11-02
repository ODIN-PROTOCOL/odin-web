<template>
  <ModalBase @close="onClose()">
    <template #title>
      <h3 class="app-form__title">Receive</h3>
    </template>

    <template #main>
      <div class="app-form">
        <div class="app-form__main">
          <QrcodeVue
            class="mg-b16"
            :value="address"
            :size="200"
            render-as="svg"
          />
          <div class="app-form__info">
            <span class="app-form__info-title">Address</span>
            <div class="app-form__info-address">
              <span>{{ address }}</span>
              <CopyButton :text="address" />
            </div>
          </div>
        </div>
        <div class="app-form__footer">
          <button class="app-btn" type="button" @click="onSubmit()">
            Share
          </button>
        </div>
      </div>
    </template>
  </ModalBase>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { DialogHandler, dialogs } from '@/helpers/dialogs'
import { wallet } from '@/api/wallet'
import QrcodeVue from 'qrcode.vue'
import ModalBase from '@/components/modals/ModalBase.vue'
import CopyButton from '@/components/CopyButton.vue'

const ReceiveDialog = defineComponent({
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

export default ReceiveDialog
export function showReceiveDialog(callbacks: {
  onSubmit?: DialogHandler
  onClose?: DialogHandler
}): Promise<unknown | null> {
  return dialogs.show(ReceiveDialog, callbacks)
}
</script>

<style lang="scss" scoped>
.app-form {
  &__main {
    display: flex;
    align-items: center;
    padding: 2.4rem 1rem;
  }

  &__info {
    &-address {
      display: flex;
      width: 100%;
      flex-direction: row;

      span {
        font-weight: 300;
        word-break: break-all;
      }
    }
  }
}
</style>

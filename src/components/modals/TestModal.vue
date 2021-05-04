<template>
  <ModalBase class="test-modal" @close="onClose()">
    <template #main>
      <p class="test-modal__test">
        <span>Hello, {{ userName }}!</span><br />
        <span>This is the test modal</span>
      </p>
    </template>
  </ModalBase>
</template>

<script lang="ts">
import { DialogEventHandler, makeDialog } from '@/helpers/dialog-helpers'
import { defineComponent, inject } from 'vue'
import ModalBase from './ModalBase.vue'

const TestModal = defineComponent({
  props: { userName: String },
  components: { ModalBase },
  setup() {
    const onClose = inject<DialogEventHandler>('onClose')
    return {
      onClose: onClose || (() => console.warn('Missing onClose handler')),
    }
  },
})

export default TestModal
export function showTestDialog(userName: string): Promise<null> {
  return makeDialog<null>(TestModal, {}, { props: { userName } })
}
</script>

<style scoped></style>

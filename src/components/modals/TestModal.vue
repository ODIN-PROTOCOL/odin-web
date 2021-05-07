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
import { makeDialog } from '@/helpers/dialogs'
import { defineComponent } from 'vue'
import ModalBase from './ModalBase.vue'
import { injectDialogHandler } from './modal-helpers'

const TestModal = defineComponent({
  props: { userName: String },
  components: { ModalBase },
  setup() {
    return {
      onClose: injectDialogHandler('onClose'),
    }
  },
})

export default TestModal
export function showTestDialog(userName: string): Promise<unknown | null> {
  return makeDialog(TestModal, {}, { props: { userName } })
}
</script>

<style scoped></style>

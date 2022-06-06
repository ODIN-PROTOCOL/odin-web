<template>
  <ModalBase class="confirmation-modal" @close="onClose">
    <template #title>
      <h3 class="app-form__title">Are you sure?</h3>
    </template>
    <template #main>
      <div class="app-form">
        <div class="app-form__main">
          <div class="app-form__field">
            {{ text }}
          </div>
        </div>
        <div class="app-form__footer">
          <button class="app-btn app-btn--outlined" @click="onClose">No</button>
          <button class="app-btn" type="button" @click="onSubmit">Yes</button>
        </div>
      </div>
    </template>
  </ModalBase>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { dialogs } from '@/helpers/dialogs'
import ModalBase from './ModalBase.vue'

export default defineComponent({
  props: {
    text: { type: String, default: 'Choose some' },
  },
  components: { ModalBase },
  setup: function () {
    return {
      onSubmit: dialogs.getHandler('onSubmit'),
      onClose: dialogs.getHandler('onClose'),
    }
  },
})
</script>

<style lang="scss" scoped></style>

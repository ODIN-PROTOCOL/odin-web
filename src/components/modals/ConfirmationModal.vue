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

<script setup lang="ts">
import { dialogs } from '@/helpers/dialogs'
import ModalBase from './ModalBase.vue'

withDefaults(
  defineProps<{
    text?: string
  }>(),
  {
    text: 'Choose some',
  },
)

const onSubmit = dialogs.getHandler('onSubmit')
const onClose = dialogs.getHandler('onClose')
</script>

<style lang="scss" scoped></style>

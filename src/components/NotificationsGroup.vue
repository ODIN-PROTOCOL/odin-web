<template>
  <notifications width="100%" position="" animation-name="v-fade-left" :max="3">
    <template v-slot:body="props">
      <div
        class="app__notification"
        @click="props.close"
        :class="notification?.typeNotification.toLowerCase()"
      >
        <div>
          <InfoNotificationIcon
            class="app__notification-icon"
            v-if="notification?.typeNotification === 'Info'"
          />
          <SuccessNotificationIcon
            class="app__notification-icon"
            v-else-if="notification?.typeNotification === 'Success'"
          />
          <FailedNotificationIcon class="app__notification-icon" v-else />
        </div>
        <div class="app__notification-content-wrapper">
          <p class="app__notification-title">
            {{ notification?.typeNotification }}
          </p>
          <p class="app__notification-content">{{ notification?.error }}</p>
        </div>
        <div class="app__cancel-icon-wrapper">
          <CancelIcon @click="props.close" class="app__cancel-icon" />
        </div>
      </div>
    </template>
  </notifications>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import {
  InfoNotificationIcon,
  SuccessNotificationIcon,
  FailedNotificationIcon,
  CancelIcon,
} from '@/components/icons'

import emitter from '@/helpers/emmiter'
type NotificationInfo = {
  error: Error
  typeNotification?: string
}

const notification = ref<NotificationInfo>()
// Notification
const DURATION = 7000
emitter.on('handleNotification', e => {
  notification.value = e as NotificationInfo
  notify({
    ignoreDuplicates: true,
    duration: DURATION,
  })
})
</script>

<style lang="scss" scoped></style>

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

<style lang="scss">
.vue-notification-group {
  width: 100%;
  max-width: 52rem;
  min-width: 30rem;
  bottom: 5%;
  right: 4%;
  .app__notification {
    display: flex;
    max-width: 49.6rem;
    min-width: 28rem;
    margin: 1rem;
    background: var(--clr__main-bg);
    color: var(--clr__text);
    box-shadow: 0 0.4rem 1.6rem var(--clr__vue-notifications-box-shadow);
    border-radius: 1.6rem;
    padding: 2.4rem 3.2rem;
  }
  .failed {
    border: 0.1rem solid var(--clr__vue-notifications-failed-border);
  }
  .success {
    border: 0.1rem solid var(--clr__vue-notifications-success-border);
  }
  .info {
    border: 0.1rem solid var(--clr__vue-notifications-info-border);
  }
  .app__notification-icon {
    width: 4.8rem;
    margin-right: 2.7rem;
  }
  .app__notification-title {
    font-weight: 400;
    font-size: 2.4rem;
    line-height: 3.2rem;
    color: var(--clr__text);
  }
  .app__notification-content-wrapper {
    width: 100%;
    margin-right: 2rem;
  }
  .app__notification-content {
    font-weight: 400;
    font-size: 1.4rem;
    line-height: 2rem;
    color: var(--clr__text-muted);
  }
  .app__cancel-icon {
    height: 100%;
  }
  @include respond-to(tablet) {
    top: 0;
    right: 0;
    bottom: 100%;
    .app__notification-icon {
      width: 2.8rem;
      height: 2.8rem;
      margin-right: 1.8rem;
    }
    .app__notification {
      padding: 1.6rem 2.4rem;
    }
    .app__notification-title {
      font-size: 2rem;
      line-height: 2.4rem;
    }
  }
}
.v-fade-left-enter-active,
.v-fade-left-leave-active,
.v-fade-left-move {
  transition: all 0.5s;
}
.v-fade-left-enter,
.v-fade-left-leave-to {
  opacity: 0;
  transform: translateX(-50rem) scale(0.2);
}
</style>

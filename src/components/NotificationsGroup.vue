<template>
  <notifications
    :max="3"
    width="100%"
    position=""
    animation-name="v-fade-left"
    class="notifications-group"
  >
    <template v-slot:body="props">
      <button
        type="button"
        class="notifications-group__inner"
        @click="props.close"
      >
        <component :key="component" :is="component" />
        <div class="notifications-group__inner-content-wrapper">
          <p class="notifications-group__inner-title">
            {{ notification.typeNotification || TYPE_NOTIFICATION.error }}
          </p>
          <p class="notifications-group__inner-content">
            {{ notification.error || DEFAULT_TEXT }}
          </p>
        </div>
        <div class="notifications-group__cancel-icon-wrapper">
          <CancelIcon
            @click="props.close"
            class="notifications-group__cancel-icon"
          />
        </div>
      </button>
    </template>
  </notifications>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import {
  InfoNotificationIcon,
  SuccessNotificationIcon,
  FailedNotificationIcon,
  CancelIcon,
} from '@/components/icons'
import { TYPE_NOTIFICATION } from '@/helpers/errors'
import emitter from '@/helpers/emmiter'

type NotificationInfo = {
  error: Error
  typeNotification: string
}

const DEFAULT_TEXT = 'Something went wrong!!!'

const notification = ref<NotificationInfo>()

const DURATION = 7000

emitter.on('handleNotification', e => {
  notification.value = e as NotificationInfo
  notify({
    ignoreDuplicates: true,
    duration: DURATION,
  })
})

const component = computed(() => {
  if (notification.value?.typeNotification === TYPE_NOTIFICATION.info) {
    return InfoNotificationIcon
  } else {
    return notification.value?.typeNotification === TYPE_NOTIFICATION.success
      ? SuccessNotificationIcon
      : FailedNotificationIcon
  }
})
</script>

<style lang="scss">
.vue-notification-group {
  width: 100%;
  max-width: 52rem;
  min-width: 30rem;
  bottom: 5%;
  right: 4%;
  .notifications-group__inner {
    display: flex;
    align-items: center;
    gap: 2rem;
    max-width: 49.6rem;
    width: 93%;
    min-width: 28rem;
    margin: 2rem;
    background: var(--clr__main-bg);
    color: var(--clr__text);
    box-shadow: 0 0.4rem 1.6rem var(--clr__vue-notifications-box-shadow);
    border-radius: 1.6rem;
    padding: 2.4rem 3.2rem;
  }

  .notifications-group__inner-icon {
    width: 4.8rem;
    margin-right: 2.7rem;
  }
  .notifications-group__inner-title {
    font-weight: 400;
    font-size: 2.4rem;
    line-height: 3.2rem;
    color: var(--clr__text);
  }
  .notifications-group__inner-content-wrapper {
    width: 100%;
    text-align: start;
  }
  .notifications-group__inner-content {
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
    .notifications-group__inner-icon {
      width: 2.8rem;
      height: 2.8rem;
      margin-right: 1.8rem;
    }
    .notifications-group__inner {
      padding: 1.6rem 2.4rem;
      margin: 2rem 1rem;
    }
    .notifications-group__inner-title {
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

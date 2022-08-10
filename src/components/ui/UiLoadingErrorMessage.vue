<template>
  <div class="ui-loading-error-message">
    <h1 class="ui-loading-error-message__title">
      {{ title }}
    </h1>
    <div v-if="message" class="ui-loading-error-message__text">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; message?: string }>()
</script>

<style lang="scss" scoped>
.ui-loading-error-message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.ui-loading-error-message__title {
  font-size: 12rem;
  font-weight: 600;
  color: var(--clr__light-gray);
  line-height: 13rem;
}

.ui-loading-error-message__text {
  font-size: 2.2rem;
  line-height: 2.4rem;
  opacity: 0.7;
}
</style>

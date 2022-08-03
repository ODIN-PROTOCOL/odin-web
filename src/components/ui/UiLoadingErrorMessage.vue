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
  font-size: 3.2rem;
  margin-bottom: 1rem;
  font-weight: 400;
}

.ui-loading-error-message__text {
  color: var(--clr__action);
  font-size: 2.4rem;
  line-height: 2.4rem;
}
</style>

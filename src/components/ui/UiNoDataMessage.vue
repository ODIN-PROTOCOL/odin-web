<template>
  <div class="ui-no-data-message">
    <h1 class="ui-no-data-message__title">
      {{ title }}
    </h1>
    <div v-if="message" class="ui-no-data-message__text">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ title?: string; message?: string }>(), {
  title: 'NO INFORMATION YET',
})
</script>

<style lang="scss" scoped>
.ui-no-data-message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.ui-no-data-message__title {
  font-size: 3.2rem;
  margin-bottom: 1rem;
  text-transform: uppercase;
  color: var(--clr__light-gray);
}

.ui-no-data-message__text {
  opacity: 0.7;
  color: var(--clr__light-gray);
}
</style>

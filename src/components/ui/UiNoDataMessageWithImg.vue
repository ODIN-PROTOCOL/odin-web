<template>
  <div class="ui-no-data-message-with-img">
    <img
      class="ui-no-data-message-with-img__picture"
      :src="require(`/src/assets/images/${imgName}`)"
      :alt="imgName"
    />

    <div v-if="message" class="ui-no-data-message-with-img__text">
      {{ message }}
    </div>
  </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{ imgName?: string; message?: string }>(), {
  message: 'NO INFORMATION YET',
  imgName: 'emptyBarChart.png',
})
</script>

<style lang="scss" scoped>
.ui-no-data-message-with-img {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  opacity: 0.7;
}

.ui-no-data-message-with-img__picture {
  margin-bottom: 2.4rem;
}

.ui-no-data-message-with-img__text {
  font-weight: 600;
  font-size: 2.4rem;
  line-height: 3.2rem;
  color: var(--clr__text-muted);
}
</style>

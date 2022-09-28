<template>
  <div class="tag" :class="{ [tagClass]: true }">
    <span class="tag__text">{{ props.text }}</span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{ type: string; text: string }>()

const tagClass = computed(() => {
  return `tag--${props.type.toLowerCase()}`
})
</script>

<style lang="scss" scoped>
.tag {
  padding: 0.2rem 1.1rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 0.4rem;
  font-size: 1rem;
  line-height: 2rem;
}

.tag--success {
  color: var(--clr__tag-success);
  background-color: var(--clr__tag-success-bg);
}

.tag--failed,
.tag--error {
  color: var(--clr__tag-failed);
  background-color: var(--clr__tag-failed-bg);
}
</style>

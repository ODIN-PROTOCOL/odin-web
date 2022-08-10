<template>
  <div class="status-block" :class="`status-block--${status}`">
    {{ displayText }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    status: string
    text?: string
  }>(),
  {
    text: '',
  },
)

const displayText = computed(() => {
  if (!props.text) return 'Default'
  return props.text
})
</script>

<style lang="scss" scoped>
.status-block {
  padding: 0.4rem 0.8rem;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.6rem;
  border-radius: 3.2rem;
  width: 10rem;
  background: var(--clr__status-default);
  color: var(--clr__text-on-action);
  text-align: center;
}
.status-block--success {
  background: var(--clr__status-success);
}
.status-block--pending {
  background: var(--clr__status-pending);
}
.status-block--error {
  background: var(--clr__status-error);
}
.status-block--progress {
  background: var(--clr__status-progress);
}
</style>

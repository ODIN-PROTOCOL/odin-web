<template>
  <div class="validator-status" :class="`validator-status--${status}`">
    <component
      :width="width"
      :height="height"
      :key="component"
      :is="component"
    />
    <span
      class="validator-status__text"
      :class="`validator-status__text--${status}`"
    >
      {{ validatorStatusText }}</span
    >
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SuccessIcon from '@/components/icons/SuccessIcon.vue'
import ErrorIcon from '@/components/icons/ErrorIcon.vue'
import InactiveIcon from '@/components/icons/InactiveIcon.vue'
import { VALIDATOR_STATUS_TYPE } from '@/helpers/validatorHelpers'

const props = withDefaults(
  defineProps<{
    status: string
    width?: number | string
    height?: number | string
  }>(),
  {
    width: 24,
    height: 24,
  },
)

const component = computed(() => {
  if (props.status === VALIDATOR_STATUS_TYPE.inactive) {
    return InactiveIcon
  } else {
    return props.status === VALIDATOR_STATUS_TYPE.success
      ? SuccessIcon
      : ErrorIcon
  }
})

const validatorStatusText = computed(() =>
  props.status === VALIDATOR_STATUS_TYPE.inactive ? 'Inactive' : 'Oracle',
)
</script>
<style lang="scss" scoped>
.validator-status {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--clr__modal-field-bg);
  border-radius: 3.2rem;
  width: 7.8rem;
  height: 2.8rem;
  padding: 0.4rem 1.2rem 0.4rem 0.8rem;
  gap: 0.4rem;
  &--inactive {
    gap: 0.5rem;
    width: 8.7rem;
  }
}
.validator-status__text {
  font-weight: 400;
  font-size: 1.4rem;
  line-height: 2rem;
  &--success {
    color: var(--clr__oracle-status-success);
  }
  &--error {
    color: var(--clr__oracle-status-error);
  }
  &--inactive {
    color: var(--clr__text-muted);
  }
}
</style>

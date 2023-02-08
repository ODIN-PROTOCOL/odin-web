<template>
  <div class="validator-status" :class="`validator-status--${status}`">
    <component
      :width="width"
      :height="height"
      :key="component"
      :is="component"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { VALIDATOR_STATUS_TYPE } from '@/helpers/validatorHelpers'
import { SuccessIcon, ErrorIcon, InactiveIcon } from '@/components/icons'

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
</script>

<style lang="scss" scoped>
.validator-status {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

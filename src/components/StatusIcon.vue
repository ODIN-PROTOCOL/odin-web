<template>
  <component :width="width" :height="height" :key="component" :is="component" />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import SuccessIcon from '@/components/icons/SuccessIcon.vue'
import ErrorIcon from '@/components/icons/ErrorIcon.vue'

export default defineComponent({
  name: 'StatusIcon',
  props: {
    status: { type: String, required: true },
    width: { type: Number, default: 24 },
    height: { type: Number, default: 24 },
  },
  components: { SuccessIcon, ErrorIcon },
  setup(props) {
    const component = computed(() => {
      return props.status === 'success' ? 'SuccessIcon' : 'ErrorIcon'
    })

    return { component }
  },
})
</script>

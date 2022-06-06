<template>
  <div>
    <SuccessIcon :width="width" :height="height" v-if="status === 'success'" />
    <ErrorIcon :width="width" :height="height" v-else-if="status === 'error'" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SuccessIcon from '@/components/icons/SuccessIcon.vue'
import ErrorIcon from '@/components/icons/ErrorIcon.vue'

export default defineComponent({
  props: {
    status: { type: String, required: true },
    width: { type: Number, default: 24 },
    height: { type: Number, default: 24 },
  },
  components: { SuccessIcon, ErrorIcon },
})
</script>

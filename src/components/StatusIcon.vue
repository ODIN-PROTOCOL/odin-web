<template>
  <div>
    <SuccessIcon v-if="status === 'success'" />
    <ErrorIcon v-else-if="status === 'error'" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SuccessIcon from '@/components/icons/SuccessIcon.vue'
import ErrorIcon from '@/components/icons/ErrorIcon.vue'

export default defineComponent({
  props: {
    status: { type: String, required: true },
  },
  components: { SuccessIcon, ErrorIcon },
})
</script>

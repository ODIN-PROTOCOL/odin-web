<template>
  <input class="input-file" type="file" @change="parseFile($event)" />
</template>

<script lang="ts">
import { getEventFile } from '@/helpers/files'
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['update:modelValue'],
  props: {
    modelValue: File,
  },
  setup(props, { emit }) {
    const parseFile = (event: Event | DragEvent) => {
      const file = getEventFile(event)
      if (!file) return
      emit('update:modelValue', file)
    }

    return { parseFile }
  },
})
</script>

<style scoped></style>

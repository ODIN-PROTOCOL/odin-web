<template>
  <template v-if="!$attrs.readonly && $attrs.readonly !== 'readonly'">
    <input class="input-file" type="file" @change="parseFile($event)" />
  </template>
  <template v-else>
    <p class="input-file__stub fs-cut">{{ modelValue }}</p>
  </template>
</template>

<script lang="ts">
import { getEventFile } from '@/helpers/files'
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['update:modelValue'],
  props: {
    modelValue: { type: [File, String] },
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

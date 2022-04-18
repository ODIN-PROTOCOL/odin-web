<template>
  <div class="pagination-wrapper">
    <VPagination v-model="page" :pages="pages" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import VPagination from '@/components/Pagination/VPagination.vue'

export default defineComponent({
  name: 'pagination',
  components: { VPagination },
  emits: ['update:modelValue'],
  props: {
    modelValue: { type: Number, required: true },
    pages: { type: Number, required: true },
  },
  setup(props, { emit }) {
    const page = computed({
      get: () => props['modelValue'],
      set: (value) => emit(`update:modelValue`, value),
    })

    return { page }
  },
})
</script>

<style lang="scss">
.pagination-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--clr-text);
}
</style>

<template>
  <div class="app-pagination__wrapper">
    <VPagination class="app-pagination" v-model="page" :pages="pages" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import VPagination from '@/components/AppPagination/VPagination.vue'

export default defineComponent({
  name: 'AppPagination',
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
.app-pagination {
  justify-content: center;
  color: var(--clr-text);
}
body.dark .app-pagination {
  color: var(--d-clr-text);
}
</style>

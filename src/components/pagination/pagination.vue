<template>
  <div class="pagination-wrapper">
    <VPagination
      v-model="page"
      :pages="pages"
      :range-size="rangeSize"
      :active-color="activeColor"
      :hideFirstButton="hideFirstButton"
      :hideLastButton="hideLastButton"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import '@hennge/vue3-pagination/dist/vue3-pagination.css'
import VPagination from '@hennge/vue3-pagination'

export default defineComponent({
  name: 'pagination',
  components: { VPagination },
  emits: ['update:modelValue'],
  props: {
    modelValue: { type: Number, required: true },
    pages: { type: Number, required: true },
    rangeSize: { type: Number, default: 1 },
    activeColor: { type: String, default: '#007bff' },
    hideFirstButton: { type: Boolean, default: true },
    hideLastButton: { type: Boolean, default: true },
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

  li {
    background: var(--clr__main-bg);
    border-radius: 0.4rem;
    margin: 0 0.4rem;
    min-width: 2.6rem;
    height: 3.6rem;
  }

  button {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 1rem;
    border: 0.1rem solid var(--clr__action);
  }

  .Page {
    color: var(--clr__action);

    &:hover {
      border: 0.1rem solid var(--clr__action);
    }
  }
  .Page-active {
    color: var(--clr__text-on-action);
  }

  .PaginationControl {
    border: 0.1rem solid var(--clr__action);
  }

  .PaginationControl .Control.Control-active {
    fill: var(--clr__action);
  }
  .PaginationControl .Control {
    fill: var(--clr__table-border);
  }

  .DotsHolder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    svg,
    path {
      color: var(--clr__action);
    }
  }
}
</style>

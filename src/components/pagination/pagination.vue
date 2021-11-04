<template>
  <div class="pagination">
    <div class="pagination__buttons">
      <paginationArrow
        @paginationArrowClick="changePageNumber($event)"
        direction="left"
        :disabled="pageNumber === 1"
      />
      <paginationButton
        :class="{ 'pagination__button--current': pageNumber === count }"
        v-for="count in pageCount"
        :number="count"
        :key="count"
        @paginationButtonClick="changePageNumber($event)"
      />
      <paginationArrow
        @paginationArrowClick="changePageNumber($event)"
        direction="right"
        :disabled="pageNumber === pageCount"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue'
import paginationButton from '@/components/pagination/paginationButton.vue'
import paginationArrow from '@/components/pagination/paginationArrow.vue'

type changePageNumberEvent = {
  number?: number
  direction?: string
}

export default defineComponent({
  emits: ['changePageNumber'],
  props: {
    totalLength: { type: [String, Number], default: 0 },
    blocksPerPage: { type: Number, required: false, default: 3 },
    startFrom: { type: Number, default: 1 },
  },
  components: { paginationButton, paginationArrow },
  setup(props, { emit }) {
    let pageNumber = ref<number>(props.startFrom)
    const pageCount = computed(() =>
      Math.ceil((props.totalLength as number) / props.blocksPerPage)
    )

    watch(
      () => props.startFrom,
      () => {
        if (props.startFrom === 1) {
          pageNumber.value = props.startFrom
        }
      }
    )

    const changePageNumber = (event: changePageNumberEvent) => {
      pageNumber.value = event.number
        ? event.number
        : event.direction === 'right'
        ? pageNumber.value + 1
        : pageNumber.value - 1

      emit('changePageNumber', pageNumber.value)
    }

    return { pageCount, pageNumber, changePageNumber }
  },
})
</script>

<style scoped lang="scss">
.pagination {
  margin: 4rem 0 6rem 0;
  &__buttons {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 0.8rem;
  }
  &__button {
    padding: 0.6rem 1.2rem;
    color: var(--clr__action);
    border: 1px solid var(--clr__action);
    border-radius: 0.4rem;
    cursor: pointer;
    transition: all 0.5s ease;
    &--current,
    &:hover {
      background: var(--clr__action);
      color: white;
    }
    &--disabled {
      background: #cce4ff;
      color: white;
      border: 1px solid #cce4ff;
      &:hover {
        background: #cce4ff;
        color: white;
        border: 1px solid #cce4ff;
        cursor: not-allowed;
      }
    }
  }
}
</style>

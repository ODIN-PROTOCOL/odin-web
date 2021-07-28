<template>
  <button
    class="pagination__button"
    :class="{ 'pagination__button--disabled': disabled }"
    @click="clickHandler"
    :disabled="disabled"
  >
    <svg
      :class="arrowDirection"
      width="7"
      height="10"
      viewBox="0 0 7 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.84199 1.175L5.66699 0L0.666992 5L5.66699 10L6.84199 8.825L3.02533 5L6.84199 1.175Z"
      />
    </svg>
  </button>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  props: {
    direction: { type: String },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const arrowDirection = computed(() =>
      props.direction === 'left' ? 'left-arrow' : 'right-arrow'
    )
    const clickHandler = (event: Event | MouseEvent) => {
      event.preventDefault()
      emit('paginationArrowClick', { direction: props.direction })
    }

    return { arrowDirection, clickHandler }
  },
})
</script>

<style lang="scss" scoped>
.pagination {
  &__button {
    .right-arrow,
    .left-arrow {
      fill: var(--clr__action);
    }
    .right-arrow {
      transform: rotate(180deg);
    }
    &[disabled],
    &:hover {
      .right-arrow,
      .left-arrow {
        fill: #fff;
      }
    }
  }
}
</style>

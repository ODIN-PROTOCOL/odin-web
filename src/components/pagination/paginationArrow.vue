<template>
  <button
    class="pagination__button"
    :class="{ 'pagination__button--disabled': disabled }"
    @click="clickHandler"
    :disabled="disabled"
  >
    <ArrowIcon :className="arrowDirection" width="7" height="10" />
  </button>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import ArrowIcon from '@/components/icons/ArrowIcon.vue'

export default defineComponent({
  components: { ArrowIcon },
  emits: ['paginationArrowClick'],
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
      display: flex;
      flex-shrink: 0;
      justify-content: center;
      align-items: center;
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

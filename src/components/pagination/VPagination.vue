<template>
  <ul class="pagination">
    <li
      class="pagination__control"
      :class="{ ['pagination__control_active']: isPrevControlsActive }"
    >
      <ArrowIcon
        class="pagination__control-arrow rotate-left"
        :width="6"
        :height="10"
        :class="{ 'pagination__control-arrow_active': isPrevControlsActive }"
        @click="goToPrev"
      />
    </li>
    <li>
      <input
        class="pagination__input"
        type="number"
        :min="1"
        :max="pages"
        :value="modelValue"
        :aria-label="`Page ${modelValue}`"
        @keydown.enter="goTo($event)"
      />
    </li>
    <li class="pagination__total-page">
      <span>of {{ pages }}</span>
    </li>
    <li
      class="pagination__control"
      :class="{ ['pagination__control_active']: isNextControlsActive }"
    >
      <ArrowIcon
        class="pagination__control-arrow rotate-right"
        :width="6"
        :height="10"
        :class="{ 'pagination__control-arrow_active': isNextControlsActive }"
        @click="goToNext"
      />
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import ArrowIcon from '@/components/icons/ArrowIcon.vue'

export default defineComponent({
  name: 'VPagination',
  components: {
    ArrowIcon,
  },
  props: {
    pages: {
      type: Number,
      default: 0,
    },
    modelValue: {
      type: Number,
      default: 0,
    },
  },
  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const isPrevControlsActive = computed((): boolean => {
      return props.modelValue > 1
    })
    const isNextControlsActive = computed((): boolean => {
      return props.modelValue < props.pages
    })
    function goToPrev(): void {
      if (isPrevControlsActive.value) {
        emit('update:modelValue', props.modelValue - 1)
      }
    }
    function goToNext(): void {
      if (isNextControlsActive.value) {
        emit('update:modelValue', props.modelValue + 1)
      }
    }
    function goTo(event: { target: { value: string | null } }): void {
      if (
        Number(event.target.value) > 0 &&
        Number(event.target.value) <= props.pages
      ) {
        emit('update:modelValue', Number(event.target.value))
      } else {
        emit('update:modelValue', 1)
      }
    }

    return {
      isPrevControlsActive,
      isNextControlsActive,
      goToPrev,
      goToNext,
      goTo,
    }
  },
})
</script>

<style scoped lang="scss">
.pagination {
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  align-items: center;
  list-style-type: none;
  margin: 0;
  padding: 0;
  &__control {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.6rem;
    height: 3.6rem;
    border: 0.1rem solid var(--clr__input-border);
    fill: var(--clr__input-border);
    &_active {
      border: 0.1rem solid var(--clr__action);
    }
  }
  &__control-arrow {
    position: absolute;
    display: block;
    width: 1rem;
    height: 1.2rem;
    margin: 0 0.2rem;
    fill: var(--clr__input-border);
    &_active {
      fill: var(--clr__action);
      cursor: pointer;
      transition: fill 0.2s ease-in-out;
      &:hover {
        fill: var(--clr__btn-hover);
        transition: fill 0.2s ease-in-out;
      }
    }
  }
  &__total-page {
    display: flex;
    justify-content: center;
    align-items: center;
    border: none;
    font-size: 1.6rem;
    margin: 0 0.8rem;
  }
  &__input {
    border: 0.1rem solid var(--clr__input-border);
    width: 6rem;
    height: 3.6rem;
    margin: 0 0.2rem;
    border-radius: 0.4rem;
    text-align: center;
    &:hover {
      border: 0.1rem solid var(--clr__action);
    }
  }
}
.rotate-right {
  transform: rotate(180deg);
}
.rotate-left {
  transform: translateX(-0.3rem) rotate(0deg);
}
li {
  background: var(--clr__main-bg);
  border-radius: 0.4rem;
  margin: 0 0.2rem;
  min-width: 2.6rem;
  height: 3.6rem;
}
</style>

<template>
  <ul class="v-pagination">
    <li
      class="v-pagination__control"
      :class="{ ['v-pagination__control--active']: isPrevControlsActive }"
      @click="goToPrev"
    >
      <ArrowIcon
        class="v-pagination__control-arrow rotate-left"
        :width="6"
        :height="10"
      />
    </li>
    <li>
      <input
        class="v-pagination__input"
        type="number"
        :min="1"
        :max="pages"
        :value="modelValue"
        :aria-label="`Page ${modelValue}`"
        @keydown.enter="goTo($event)"
        @blur="goTo($event)"
      />
    </li>
    <li class="v-pagination__total-page">
      <span>of {{ pages }}</span>
    </li>
    <li
      class="v-pagination__control"
      :class="{ ['v-pagination__control--active']: isNextControlsActive }"
      @click="goToNext"
    >
      <ArrowIcon
        class="v-pagination__control-arrow rotate-right"
        :width="6"
        :height="10"
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
.v-pagination {
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  align-items: center;
  list-style-type: none;
  margin: 0;
  padding: 0;
  user-select: none;
}
.v-pagination__control {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem;
  width: 3.6rem;
  height: 3.6rem;
  border: 0.1rem solid var(--clr__input-border);
  fill: var(--clr__input-border);
}
.v-pagination__control--active {
  cursor: pointer;
  border: 0.1rem solid var(--clr__action);
  fill: var(--clr__action);
  svg {
    fill: var(--clr__action);
    transition: all 0.5s ease;
  }
  &:hover {
    svg {
      fill: var(--clr__btn-hover);
    }
    border-color: var(--clr__btn-hover);
  }
}
.v-pagination__control-arrow {
  width: 1rem;
  height: 1.2rem;
  fill: var(--clr__input-border);
}
.v-pagination__total-page {
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  font-size: 1.6rem;
  margin: 0 0.8rem;
}
.v-pagination__input {
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
.rotate-right {
  transform: translateX(0.25rem) rotate(180deg);
}
.rotate-left {
  transform: translateX(-0.1rem) rotate(0deg);
}
li {
  background: var(--clr__main-bg);
  border-radius: 0.4rem;
  margin: 0 0.2rem;
  min-width: 2.6rem;
  height: 3.6rem;
}
body.dark {
  .v-pagination__control {
    border: 0.1rem solid var(--d-clr__input-border);
    fill: var(--d-clr__input-border);
  }
  .v-pagination__control--active {
    border: 0.1rem solid var(--d-clr__action);
    fill: var(--d-clr__action);
    &:hover {
      svg {
        fill: var(--d-clr__btn-hover);
      }
      border-color: var(--d-clr__btn-hover);
    }
  }
  .v-pagination__control-arrow {
    fill: var(--d-clr__input-border);
  }
  .v-pagination__input {
    border: 0.1rem solid var(--d-clr__input-border);
    &:hover {
      border: 0.1rem solid var(--d-clr__action);
    }
  }
  li {
    background: var(--d-clr__main-bg);
  }
}
</style>

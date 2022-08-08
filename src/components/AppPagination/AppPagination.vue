<template>
  <div class="app-pagination__wrapper">
    <div class="app-pagination">
      <button
        class="app-pagination__control app-pagination__border"
        :class="{ 'app-pagination__control--active': isPrevControlsActive }"
        @click="goToPreviousPage"
      >
        <ArrowIcon
          class="app-pagination__control-arrow rotate-left"
          :width="6"
          :height="10"
        />
      </button>
      <div>
        <input
          class="app-pagination__input app-pagination__border"
          type="number"
          :min="1"
          :max="pages"
          :value="modelValue"
          :aria-label="`Page ${modelValue}`"
          @keydown.enter="goToSelectedPage($event)"
          @blur="goToSelectedPage($event)"
        />
      </div>
      <div class="app-pagination__total-page">
        <span>of {{ pages }}</span>
      </div>
      <button
        class="app-pagination__control app-pagination__border"
        :class="{ 'app-pagination__control--active': isNextControlsActive }"
        @click="goToNextPage"
      >
        <ArrowIcon
          class="app-pagination__control-arrow rotate-right"
          :width="6"
          :height="10"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowIcon } from '@/components/icons'

enum EVENTS {
  updateModelValue = 'update:model-value',
}

const emit = defineEmits<{
  (e: EVENTS.updateModelValue, payload: number | string | undefined): void
}>()

const props = defineProps<{
  modelValue: number
  pages: number
}>()

const isPrevControlsActive = computed((): boolean => {
  return props.modelValue > 1
})
const isNextControlsActive = computed((): boolean => {
  return props.modelValue < props.pages
})
function goToPreviousPage(): void {
  if (isPrevControlsActive.value) {
    emit(EVENTS.updateModelValue, props.modelValue - 1)
  }
}
function goToNextPage(): void {
  if (isNextControlsActive.value) {
    emit(EVENTS.updateModelValue, props.modelValue + 1)
  }
}
function goToSelectedPage(event: { target: { value: string } }): void {
  if (Number(event.target.value) === props.modelValue) return
  if (
    Number(event.target.value) > 0 &&
    Number(event.target.value) <= props.pages
  ) {
    emit(EVENTS.updateModelValue, Number(event.target.value))
  } else {
    emit(EVENTS.updateModelValue, 1)
  }
}
</script>

<style lang="scss">
.app-pagination__wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--clr-text);
  max-height: 3.8rem;
}

.app-pagination {
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  align-items: center;
  list-style-type: none;
  justify-content: center;
  color: var(--clr-text);
  margin: 0;
  padding: 0;
}

.app-pagination__control {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.6rem;
  height: 3.6rem;
  border: 0.1rem solid var(--clr__input-border);
  fill: var(--clr__input-border);
  &--active {
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
}

.app-pagination__control-arrow {
  position: absolute;
  display: block;
  width: 1rem;
  height: 1.2rem;
  margin: 0 0.2rem;
  fill: var(--clr__input-border);
}

.app-pagination__total-page {
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  font-size: 1.6rem;
  margin: 0 0.8rem;
}

.app-pagination__input {
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

.app-pagination__border {
  background: var(--clr__main-bg);
  border-radius: 0.4rem;
  margin: 0 0.2rem;
  min-width: 2.6rem;
  height: 3.6rem;
}

.rotate-right {
  transform: rotate(180deg);
}
.rotate-left {
  transform: translateX(-0.25rem) rotate(0deg);
}
</style>
